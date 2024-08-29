// src/utils/trpc.ts

import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, loggerLink, splitLink, TRPCLink } from '@trpc/client';
import superjson from 'superjson';
import type { ForgeRouter } from '@arken/forge-protocol/types';
import { QueryClient } from '@tanstack/react-query';
import { observable } from '@trpc/server/observable';
import { io as ioClient } from 'socket.io-client';

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
  socket: ioClient('http://localhost:8020', {
    transports: ['websocket'],
    upgrade: false,
    autoConnect: true,
    // pingInterval: 5000,
    // pingTimeout: 20000
    // extraHeaders: {
    //   "my-custom-header": "1234"
    // }
  }),
};

// client.socket.connect();

const customLink: TRPCLink<any> =
  () =>
  ({ op, next }) => {
    return observable((observer) => {
      const { input, context } = op;

      if (!client) {
        console.log('Emit Direct failed, no client', op);
        observer.complete();
        return;
      }

      if (!client.socket || !client.socket.emit) {
        console.log('Emit Direct failed, bad socket', op);
        observer.complete();
        return;
      }
      console.log('Emit Direct', op, client.socket);

      client.socket.emit('trpc', { id: op.id, method: op.path, type: op.type, params: input });

      observer.complete();
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

export const trpc = createTRPCReact<ForgeRouter>();

export const trpcClient = trpc.createClient({
  //   transformer: superjson, // for data serialization
  links: [
    splitLink({
      // condition to decide which link to use
      condition: (op) => (op.type === 'query' ? op.context.skipBatch === true : true),
      true: customLink, // Link to use if the condition is true
      false: customLink, // Link to use if the condition is false (disabled batching in this example)
    }),
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
