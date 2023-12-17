'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

export default function TanStackProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: true
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            {children}
        </QueryClientProvider>
    );
}