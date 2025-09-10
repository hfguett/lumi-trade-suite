import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Palette, Sun, Moon, Monitor, Sparkles, Eye } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accentColor, setAccentColor] = useState("violet");
  const [fontSize, setFontSize] = useState([16]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glassEffect, setGlassEffect] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const accentColors = [
    { value: "violet", label: "Violet", color: "hsl(262, 83%, 58%)" },
    { value: "blue", label: "Blue", color: "hsl(221, 83%, 53%)" },
    { value: "green", label: "Green", color: "hsl(142, 71%, 45%)" },
    { value: "orange", label: "Orange", color: "hsl(25, 95%, 53%)" },
    { value: "red", label: "Red", color: "hsl(0, 72%, 51%)" },
    { value: "pink", label: "Pink", color: "hsl(322, 65%, 60%)" },
  ];

  const applyAccentColor = (color: string) => {
    const root = document.documentElement;
    const colorMap = {
      violet: { h: 262, s: 83, l: 58 },
      blue: { h: 221, s: 83, l: 53 },
      green: { h: 142, s: 71, l: 45 },
      orange: { h: 25, s: 95, l: 53 },
      red: { h: 0, s: 72, l: 51 },
      pink: { h: 322, s: 65, l: 60 },
    };

    const { h, s, l } = colorMap[color as keyof typeof colorMap];
    root.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    root.style.setProperty('--primary-foreground', '0 0% 100%');
    setAccentColor(color);
  };

  const applyFontSize = (size: number[]) => {
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${size[0]}px`);
    setFontSize(size);
  };

  const toggleGlassEffect = (enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.style.setProperty('--glass-opacity', '0.1');
      root.style.setProperty('--glass-blur', '12px');
    } else {
      root.style.setProperty('--glass-opacity', '0');
      root.style.setProperty('--glass-blur', '0px');
    }
    setGlassEffect(enabled);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Appearance</h3>
            <p className="text-sm text-muted-foreground">Customize the look and feel</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Mode */}
          <div>
            <Label className="text-base font-medium mb-3 block">Theme Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  onClick={() => setTheme(value)}
                  className="h-20 flex-col gap-2"
                >
                  <Icon className="w-6 h-6" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div>
            <Label className="text-base font-medium mb-3 block">Accent Color</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant={accentColor === color.value ? "default" : "outline"}
                  onClick={() => applyAccentColor(color.value)}
                  className="h-16 flex-col gap-2 relative overflow-hidden"
                >
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-background"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-xs">{color.label}</span>
                  {accentColor === color.value && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
                      ✓
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Font Size: {fontSize[0]}px
            </Label>
            <Slider
              value={fontSize}
              onValueChange={applyFontSize}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>12px</span>
              <span>18px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Visual Effects */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Visual Effects</Label>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Glass Effect</p>
                  <p className="text-sm text-muted-foreground">Frosted glass background effect</p>
                </div>
              </div>
              <Switch 
                checked={glassEffect}
                onCheckedChange={toggleGlassEffect}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Reduced Motion</p>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
              </div>
              <Switch 
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}