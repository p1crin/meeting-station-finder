import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import App from "./App";
import "./index.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DAY_MS,
      gcTime: DAY_MS,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Persist the cache to localStorage: timetable results are immutable for fixed
// conditions, so re-searches across reloads avoid hammering the API.
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "msf-query-cache",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: DAY_MS }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
);
