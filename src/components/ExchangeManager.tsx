import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Exchange {
  id: string;
  name: string;
  makerFee: number;
  takerFee: number;
  isCustom?: boolean;
}

interface ExchangeManagerProps {
  exchanges: Exchange[];
  onExchangesChange: (exchanges: Exchange[]) => void;
  selectedExchange: string;
  onExchangeSelect: (exchangeId: string) => void;
}

export function ExchangeManager({ 
  exchanges, 
  onExchangesChange, 
  selectedExchange, 
  onExchangeSelect 
}: ExchangeManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExchange, setEditingExchange] = useState<Exchange | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    makerFee: "",
    takerFee: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.makerFee || !formData.takerFee) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const makerFee = parseFloat(formData.makerFee);
    const takerFee = parseFloat(formData.takerFee);

    if (isNaN(makerFee) || isNaN(takerFee) || makerFee < 0 || takerFee < 0) {
      toast({
        title: "Error", 
        description: "Fees must be valid positive numbers",
        variant: "destructive"
      });
      return;
    }

    const newExchange: Exchange = {
      id: editingExchange?.id || `custom-${Date.now()}`,
      name: formData.name,
      makerFee,
      takerFee,
      isCustom: true
    };

    let updatedExchanges;
    if (editingExchange) {
      updatedExchanges = exchanges.map(ex => 
        ex.id === editingExchange.id ? newExchange : ex
      );
      toast({
        title: "Success",
        description: "Exchange updated successfully"
      });
    } else {
      updatedExchanges = [...exchanges, newExchange];
      toast({
        title: "Success", 
        description: "Exchange added successfully"
      });
    }

    onExchangesChange(updatedExchanges);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (exchange: Exchange) => {
    setEditingExchange(exchange);
    setFormData({
      name: exchange.name,
      makerFee: exchange.makerFee.toString(),
      takerFee: exchange.takerFee.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (exchangeId: string) => {
    const updatedExchanges = exchanges.filter(ex => ex.id !== exchangeId);
    onExchangesChange(updatedExchanges);
    
    if (selectedExchange === exchangeId) {
      onExchangeSelect(exchanges.find(ex => !ex.isCustom)?.id || "binance");
    }
    
    toast({
      title: "Success",
      description: "Exchange deleted successfully"
    });
  };

  const resetForm = () => {
    setFormData({ name: "", makerFee: "", takerFee: "" });
    setEditingExchange(null);
  };

  const customExchanges = exchanges.filter(ex => ex.isCustom);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Custom Exchanges</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetForm()}
              className="border-primary/30 hover:border-primary/60 hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Exchange
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingExchange ? "Edit Exchange" : "Add Custom Exchange"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exchange Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Custom Exchange"
                  className="border-border-glow/30 focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="makerFee">Maker Fee (%)</Label>
                  <Input
                    id="makerFee"
                    value={formData.makerFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, makerFee: e.target.value }))}
                    placeholder="0.1"
                    className="font-mono border-border-glow/30 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takerFee">Taker Fee (%)</Label>
                  <Input
                    id="takerFee"
                    value={formData.takerFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, takerFee: e.target.value }))}
                    placeholder="0.1"
                    className="font-mono border-border-glow/30 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" variant="hero" className="flex-1">
                  {editingExchange ? "Update" : "Add"} Exchange
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customExchanges.length > 0 && (
        <div className="space-y-2">
          {customExchanges.map(exchange => (
            <Card 
              key={exchange.id} 
              className="p-3 border border-border-glow/20 hover:border-border-glow/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exchange.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Custom
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      Maker: {exchange.makerFee}% | Taker: {exchange.takerFee}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(exchange)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exchange.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}