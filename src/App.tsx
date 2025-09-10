import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import RiskManagementPage from "./pages/RiskManagement";
import Goals from "./pages/Goals";
import Calendar from "./pages/Calendar";
import Advanced from "./pages/Advanced";
import MarketDataPage from "./pages/MarketData";
import AdvancedPage from "./pages/Advanced";
import SpotPortfolioPage from "./pages/SpotPortfolio";
import WalletTrackerPage from "./pages/WalletTracker";
import TradingToolsPage from "./pages/TradingTools";
import LiveChartPage from "./pages/LiveChart";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="tradepro-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
          <Route path="/journal" element={<Layout><Journal /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/risk" element={<Layout><RiskManagementPage /></Layout>} />
          <Route path="/advanced" element={<Layout><Advanced /></Layout>} />
          <Route path="/market" element={<Layout><MarketDataPage /></Layout>} />
          <Route path="/portfolio" element={<Layout><SpotPortfolioPage /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletTrackerPage /></Layout>} />
          <Route path="/trading-tools" element={<Layout><TradingToolsPage /></Layout>} />
          <Route path="/live-chart" element={<Layout><LiveChartPage /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
