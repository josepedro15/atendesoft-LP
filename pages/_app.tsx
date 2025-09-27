import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { FlowchartsProvider } from "@/contexts/FlowchartsContext";
import PageTransition from "@/components/PageTransition";
import "@/index.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
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
