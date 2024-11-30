import { initTRPC } from '@trpc/server';
import {
  createRouter as createEvolutionRouter,
  Router as EvolutionRouter,
} from '@arken/evolution-protocol/realm/realm.router';
import { createRouter as createSeerRouter, Types } from '@arken/seer-protocol';

// Define the merged router type
type MergedRouter = {
  seer: Types.Router;
  evolution: EvolutionRouter;
  // seer: Types.Router;
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
    // relay: createRelayRouter(),
    evolution: createEvolutionRouter(),
    seer: createSeerRouter(),
  });

// Export the type of the router
export type AppRouter = ReturnType<typeof createRouter>;
