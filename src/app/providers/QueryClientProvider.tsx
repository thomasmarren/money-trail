"use client";

import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};
