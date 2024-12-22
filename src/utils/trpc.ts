import React from 'react';
import { createTRPCReact, TRPCLink } from '@trpc/react-query';
import { TRPCClientError } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import { observable } from '@trpc/server/observable';
import { io as ioClient } from 'socket.io-client';
import { generateShortId } from '@arken/node/util/db';
import { serialize, deserialize } from '@arken/node/util/rpc';
import type { AppRouter } from './app.router';

// ======================
// Helper Functions
// ======================

/**
 * Wait until a predicate is true or timeout occurs.
 */
function waitUntil(predicate: () => boolean, timeoutMs: number, intervalMs: number = 100): Promise<void> {
  const startTime = Date.now();

  if (predicate()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      if (predicate()) {
        resolve();
      } else if (Date.now() - startTime >= timeoutMs) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(checkCondition, intervalMs);
      }
    };

    setTimeout(checkCondition, intervalMs);
  });
}

/**
 * Handles TRPC errors by parsing and logging them.
 */
export const handleTRPCError = (error: any, message = 'There was an error while performing your request') => {
  try {
    const parsedError = JSON.parse(error.message);
    console.error(message, parsedError);
  } catch (e) {
    console.error(message, error);
  }
};

// ======================
// WebSocket Client Setup
// ======================

type BackendConfig = {
  name: 'relay' | 'evolution' | 'evolutionShard' | 'seer';
  url: string;
};

const backends: BackendConfig[] = [
  // { name: 'relay', url: 'http://localhost:8020' },
  { name: 'evolution', url: process.env.REACT_APP_EVOLUTION_SERVICE_URI },
  { name: 'evolutionShard', url: process.env.REACT_APP_EVOLUTION_SHARD_URI },
  { name: 'seer', url: process.env.REACT_APP_SEER_SERVICE_URI },
];

// Initialize a single QueryClient shared across all backends
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    },
  },
});

// Initialize socket clients for each backend
type Client = {
  ioCallbacks: Record<
    string,
    {
      timeout: any;
      resolve: (response: any) => void;
      reject: (error: any) => void;
    }
  >;
  socket: ReturnType<typeof ioClient>;
};

export const clients: Record<string, Client> = {};

backends.forEach((backend) => {
  try {
    const client: Client = {
      ioCallbacks: {},
      socket: ioClient(backend.url, {
        transports: ['websocket'],
        upgrade: false,
        autoConnect: true, // Consider setting to false and connecting manually if needed
      }),
    };

    // TODO: show the status of these in the bottom left
    client.socket.on('welcome', (message) => {
      // console.log(message);
    });
    client.socket.on('connect_error', (err) => {
      // console.error('Connection Error:', err.message);
      client.socket.close();
    });
    client.socket.on('reconnect_attempt', () => {
      // console.info(`[${backend.name}] Reconnecting...`);
    });

    client.socket.on('disconnect', () => {
      // console.log('Disconnected from server');
    });

    // Handle incoming socket events
    client.socket.on('trpcResponse', (res) => {
      try {
        console.log(`[${backend.name} Socket] Event:`, res);

        // if (eventName === 'trpc') return;

        const { id } = res;

        if (id) {
          if (client.ioCallbacks[id]) {
            console.log(`[${backend.name} Socket] Callback exists for ID:`, id);

            clearTimeout(client.ioCallbacks[id].timeout);

            try {
              client.ioCallbacks[id].resolve(res);
            } catch (e) {
              console.log(`[${backend.name} Socket] Callback error:`, e);
              client.ioCallbacks[id].reject(e);
            }

            delete client.ioCallbacks[id];
          } else {
            console.warn(`[${backend.name} Socket] No callback found for ID: ${id}`);
          }
        } else {
          const { method, params } = res;

          console.log(`[${backend.name} Socket] TRPC method called:`, method, params);

          try {
            // Implement your method handling logic here
            const result = {}; // Replace with actual result

            client.socket.emit('trpcResponse', { id, result: serialize(result) });
          } catch (e) {
            client.socket.emit('trpcResponse', { id, result: {}, error: e.stack + '' });
          }
        }
      } catch (e) {
        console.error(`[${backend.name} Socket] Error in handler:`, e);
      }
    });

    clients[backend.name] = client;
  } catch (e) {
    console.log('Failed to setup trpc backend', backend.url);
  }
});

// ======================
// Combined TRPC Link
// ======================

const combinedLink: TRPCLink<any> =
  () =>
  ({ op, next }) => {
    // Extract the router namespace from the operation path
    const [routerName, ...restPath] = op.path.split('.');

    if (!routerName || !backends.some((backend) => backend.name === routerName)) {
      return observable((observer) => {
        observer.error(new TRPCClientError(`Unknown router: ${routerName}`));
        observer.complete();
      });
    }

    const client = clients[routerName];

    const uuid = generateShortId();

    return observable((observer) => {
      const execute = async () => {
        const { input } = op;

        op.context.client = client;
        // @ts-ignore
        op.context.client.roles = ['admin', 'user', 'guest'];

        try {
          await waitUntil(() => !!client?.socket?.emit, 60 * 1000);
        } catch (error: any) {
          console.log(`[${routerName} Link] Emit failed, no socket connection in time`, op);
          observer.error(new TRPCClientError(error.message));
          return;
        }

        console.log(`[${routerName} Link] Emit Direct:`, op);

        client.socket.emit('trpc', {
          id: uuid,
          method: op.path.replace(routerName + '.', ''),
          type: op.type,
          params: serialize(input),
        });

        // Save the ID and callback
        const timeout = setTimeout(() => {
          console.log(`[${routerName} Link] Request timed out:`, op);
          delete client.ioCallbacks[uuid];
          // observer.error(new TRPCClientError('Request timeout'));
        }, 15000); // 15 seconds timeout

        client.ioCallbacks[uuid] = {
          timeout,
          resolve: (response) => {
            console.log(`[${routerName} Link] Callback resolved:`, uuid, response);
            clearTimeout(timeout);
            if (response.error) {
              observer.error(response.error);
            } else {
              const result = deserialize(response.result);
              console.log(443332, result);
              observer.next({
                result,
              });
              observer.complete();
            }
            delete client.ioCallbacks[uuid];
          },
          reject: (error) => {
            console.log(`[${routerName} Link] Callback rejected:`, error);
            clearTimeout(timeout);
            observer.error(error);
            delete client.ioCallbacks[uuid];
          },
        };
      };

      execute();
    });
  };

// ======================
// Create a Unified tRPC Instance
// ======================

// Create a single tRPC instance
export const trpc = createTRPCReact<AppRouter>();

// Create the tRPC client with the combined link
export const trpcClient = trpc.createClient({
  links: [combinedLink],
});

// ======================
// Unified Relay Export
// ======================

export const relay = {
  trpc,
  trpcClient,
  queryClient,
  handleTRPCError,
};
