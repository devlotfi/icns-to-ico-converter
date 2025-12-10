import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import PWAProvider from "./provider/pwa-provider.tsx";
import { ThemeProvider } from "./provider/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <PWAProvider>
          <ThemeProvider>
            <App></App>
          </ThemeProvider>
        </PWAProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  </StrictMode>
);
