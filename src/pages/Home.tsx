import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calculator, BookOpen, Target, Calendar, Shield, BarChart3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "PnL Calculator",
      description: "Advanced calculations with leverage & fees"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Trading Journal",
      description: "Track all your trades with notes & tags"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard", 
      description: "Performance metrics & insights"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Management",
      description: "Position sizing & portfolio analysis"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Set & monitor trading objectives"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar Planning",
      description: "Plan trades & market events"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)] opacity-[0.05]"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-profit/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Trading Analytics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-profit bg-clip-text text-transparent leading-tight">
              TradePro
              <br />
              <span className="text-primary glow-primary">Analytics</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate trading analytics platform. Track performance, manage risk, and optimize your trading strategy with professional-grade tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="hero"
                  className="text-lg px-8 py-6 h-auto font-semibold tracking-wide hover:scale-105 transition-all duration-300 shadow-glow border border-primary/30 hover:border-primary/60"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Launch Dashboard
                </Button>
              </Link>
              
              <Link to="/calculator">
                <Button 
                  size="lg" 
                  variant="glass"
                  className="text-lg px-8 py-6 h-auto font-semibold tracking-wide hover:scale-105 transition-all duration-300"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed for serious traders who want to level up their game
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:shadow-glow hover:border-primary/30 transition-all duration-500 group cursor-pointer hover:scale-[1.02]"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 pb-20">
          <Card className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto border border-primary/20 shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-primary">Optimize</span> Your Trading?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust TradePro Analytics to track, analyze, and improve their performance.
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                variant="hero"
                className="text-lg px-12 py-6 h-auto font-semibold hover:scale-105 transition-all duration-300"
              >
                Get Started Now
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}