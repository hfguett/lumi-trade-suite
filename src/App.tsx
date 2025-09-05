import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
          <Route path="/journal" element={<Layout><Journal /></Layout>} />
          <Route path="/analytics" element={<Layout><div className="text-center py-20 text-muted-foreground">Analytics Dashboard - Coming Soon</div></Layout>} />
          <Route path="/calendar" element={<Layout><div className="text-center py-20 text-muted-foreground">Calendar Planning - Coming Soon</div></Layout>} />
          <Route path="/risk" element={<Layout><div className="text-center py-20 text-muted-foreground">Risk Management - Coming Soon</div></Layout>} />
          <Route path="/advanced" element={<Layout><div className="text-center py-20 text-muted-foreground">Advanced Analytics - Coming Soon</div></Layout>} />
          <Route path="/market" element={<Layout><div className="text-center py-20 text-muted-foreground">Market Data - Coming Soon</div></Layout>} />
          <Route path="/goals" element={<Layout><div className="text-center py-20 text-muted-foreground">Goal Tracking - Coming Soon</div></Layout>} />
          <Route path="/settings" element={<Layout><div className="text-center py-20 text-muted-foreground">Settings - Coming Soon</div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
