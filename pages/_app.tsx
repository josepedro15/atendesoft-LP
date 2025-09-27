import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { FlowchartsProvider } from "@/contexts/FlowchartsContext";
import PageTransition from "@/components/PageTransition";
import "@/index.css";
import { useState } from 'react';

// Criar QueryClient apenas uma vez
let queryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: sempre criar um novo
    return new QueryClient();
  } else {
    // Browser: criar apenas uma vez
    if (!queryClient) {
      queryClient = new QueryClient();
    }
    return queryClient;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => getQueryClient());
  
  return (
    <div style={{ overflow: 'visible' }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FlowchartsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
            </TooltipProvider>
          </FlowchartsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}
