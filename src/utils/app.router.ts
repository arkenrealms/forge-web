// app.router.ts

import { initTRPC } from '@trpc/server';
import { createRouter as createRelayRouter, Router as RelayRouter } from '@arken/node/router';
import {
  createRouter as createEvolutionRouter,
  Router as EvolutionRouter,
} from '@arken/evolution-protocol/realm/realm.router';

// Define the merged router type
type MergedRouter = {
  relay: RelayRouter;
  evolution: EvolutionRouter;
};

// Initialize tRPC with the merged context if needed
const t = initTRPC
  .context<{
    // Define any shared context here if necessary
  }>()
  .create();

// Create the root router
export const createRouter = () =>
  t.router<MergedRouter>({
    relay: createRelayRouter(),
    evolution: createEvolutionRouter(),
  });

// Export the type of the router
export type AppRouter = ReturnType<typeof createRouter>;
