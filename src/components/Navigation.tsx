import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Calculator, 
  BookOpen, 
  Calendar, 
  Shield, 
  TrendingUp, 
  LineChart, 
  Target,
  Settings,
  Menu,
  X,
  Activity,
  Wallet,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "PnL Calculator", url: "/calculator", icon: Calculator },
  { title: "Trading Journal", url: "/journal", icon: BookOpen },
  { title: "Live Chart", url: "/live-chart", icon: Activity },
  { title: "Trading Tools", url: "/trading-tools", icon: Calculator },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Risk Management", url: "/risk", icon: Shield },
  { title: "Advanced Analytics", url: "/advanced", icon: LineChart },
  { title: "Market Data", url: "/market", icon: Activity },
  { title: "Spot Portfolio", url: "/portfolio", icon: Wallet },
  { title: "Wallet Tracker", url: "/wallet", icon: Search },
  { title: "Goal Tracking", url: "/goals", icon: Target },
];

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const location = useLocation();
  
  // Handle responsive behavior
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn(
      "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">TradePro</h1>
              <p className="text-xs text-muted-foreground">Analytics</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const active = isActive(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "text-primary-glow")} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 left-2 right-2">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
            isActive("/settings") && "bg-sidebar-primary text-sidebar-primary-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </NavLink>
      </div>
    </nav>
  );
}