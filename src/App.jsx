/**
 * @fileoverview Application root.
 *
 * Sets up:
 *  - QueryClient (TanStack React Query) — wraps the entire tree
 *  - React Router (optional, add more routes as the app grows)
 *  - DashboardPage as the default route
 *
 * Usage (main.jsx):
 *   import App from './App';
 *   ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardPage } from "./pages/DashboardPage";

// ---------------------------------------------------------------------------
// QueryClient configuration
// ---------------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                  // retry once on failure before falling back
      staleTime: 60_000,         // 1 min global stale time
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*
        Add <BrowserRouter> + <Routes> here when you need multiple pages.
        For now a single dashboard is sufficient.
      */}
      <DashboardPage />
    </QueryClientProvider>
  );
}
