import { useState } from "react";
import { CalendarPlanning } from "@/components/CalendarPlanning";
import { PnLCalendar } from "@/components/PnLCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, TrendingUp } from "lucide-react";

export default function Calendar() {
  const [activeTab, setActiveTab] = useState("planning");

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="pnl" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            PnL Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning">
          <CalendarPlanning />
        </TabsContent>
        
        <TabsContent value="pnl">
          <PnLCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}