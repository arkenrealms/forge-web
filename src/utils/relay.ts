import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, loggerLink, splitLink, TRPCLink, TRPCClientError } from '@trpc/client';
import superjson from 'superjson';
import type { Router } from '@arken/node/types';
import { QueryClient } from '@tanstack/react-query';
import { observable } from '@trpc/server/observable';
import { io as ioClient } from 'socket.io-client';
import { generateShortId } from '@arken/node/util/db';

// Initialize the QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    },
  },
});

const client = {
  ioCallbacks: {},
  socket: ioClient('http://localhost:8020', {
    transports: ['websocket'],
    upgrade: false,
    autoConnect: true, // TODO: should delay this
    // pingInterval: 5000,
    // pingTimeout: 20000
    // extraHeaders: {
    //   "my-custom-header": "1234"
    // }
  }),
};

client.socket.onAny((eventName, res) => {
  try {
    console.log('client.socket.onAny', eventName, res);

    if (eventName === 'Events') return;

    const { id } = res;

    if (id) {
      if (client.ioCallbacks[id]) {
        console.log('Callback exists', id);

        clearTimeout(client.ioCallbacks[id].timeout);

        try {
          client.ioCallbacks[id].resolve(res);
        } catch (e) {
          console.log('Callback error', e);
          client.ioCallbacks[id].reject(e);
        }

        delete client.ioCallbacks[id]; // Cleanup after handling
      } else {
        console.warn(`No callback found for id ${id}`);
      }
    } else {
      const { method, params } = res;

      console.log('Forge web TRPC called', method, params);

      try {
        // const ctx = { client };

        // // Your business logic here...
        // const createCaller = createCallerFactory(this.emit);
        // const caller = createCaller(ctx);
        // // @ts-ignore
        // const result = await caller[method](params);

        const result = {};

        client.socket.emit('trpcResponse', { id, result });
      } catch (e) {
        client.socket.emit('trpcResponse', { id, error: e.message });
      }
    }
  } catch (e) {
    console.error('Error in socket.onAny handler:', e);
  }
});

function waitUntil(predicate: () => boolean, timeoutMs: number, intervalMs: number = 100): Promise<void> {
  const startTime = Date.now();

  // Check if the condition is already true
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

    // Start the polling after the initial interval
    setTimeout(checkCondition, intervalMs);
  });
}

const customLink: TRPCLink<any> =
  () =>
  ({ op, next }) => {
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
          console.log('Emit Direct failed, couldnt get socket connection in time', op);
          observer.error(new TRPCClientError(error.message));
        }

        console.log('Emit Direct', op, client.socket);

        client.socket.emit('trpc', { id: uuid, method: op.path, type: op.type, params: input });

        // save the ID and callback when finished
        const timeout = setTimeout(() => {
          console.log('Request timed out', op);
          delete client.ioCallbacks[uuid];
          observer.error(new TRPCClientError('Request timeout'));
        }, 15000); // 15 seconds timeout

        client.ioCallbacks[uuid] = {
          timeout,
          resolve: (response) => {
            console.log('ioCallbacks.resolve', uuid, response);
            clearTimeout(timeout);
            observer.next(response);
            observer.complete();
            delete client.ioCallbacks[uuid]; // Cleanup after completion
          },
          reject: (error) => {
            console.log('ioCallbacks.reject', error);
            clearTimeout(timeout);
            observer.error(error);
            delete client.ioCallbacks[uuid]; // Cleanup on error
          },
        };
      };

      execute();
    });
  };

// const authedCacheBypassLink: TRPCLink<Router> = () => {
//   return ({ next, op }) => {
//     // @ts-ignore
//     const isAuthed = typeof window !== undefined ? window.isAuthed : false;
//     // @ts-ignore
//     return next({ ...op, input: isAuthed && op.input ? { ...op.input, authed: true } : op.input });
//   };
// };

export const trpc = createTRPCReact<Router>();

export const trpcClient = trpc.createClient({
  //   transformer: superjson, // for data serialization
  links: [
    customLink,
    // splitLink({
    //   // condition to decide which link to use
    //   condition: (op) => (op.type === 'query' ? op.context.skipBatch === true : true),
    //   true: customLink, // Link to use if the condition is true
    //   false: customLink, // Link to use if the condition is false (disabled batching in this example)
    // }),
  ],
});

// Function to configure headers
const getHeaders = () => {
  if (typeof window === 'undefined') return {};
  const fingerprint = window.localStorage.getItem('fingerprint') ?? '';

  return {
    'x-client-version': process.env.version,
    'x-client-date': new Date().toISOString(),
    'x-client': 'web',
    'x-fingerprint': fingerprint ? JSON.parse(fingerprint) : undefined,
  };
};

export const handleTRPCError = (error: any, message = 'There was an error while performing your request') => {
  try {
    // If the error is a JSON string, parse it
    const parsedError = JSON.parse(error.message);
    console.error(message, parsedError);
  } catch (e) {
    // Log the original error if parsing fails
    console.error(message, error);
  }
};
