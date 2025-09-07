import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Plus, X } from "lucide-react";
import { TradeEntry } from "@/types/trading";
import { ScreenshotOCR } from "./ScreenshotOCR";

interface TradeRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trade: Omit<TradeEntry, 'id'>) => void;
  initialData?: Partial<TradeEntry>;
}

export function TradeRegistrationForm({ isOpen, onClose, onSubmit, initialData }: TradeRegistrationFormProps) {
  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || "",
    direction: initialData?.direction || "LONG" as const,
    entryPrice: initialData?.entryPrice || 0,
    entryTime: initialData?.entryTime ? initialData.entryTime.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    stopPrice: initialData?.stopPrice || 0,
    quantity: initialData?.quantity || 0,
    notes: initialData?.notes || "",
    category: initialData?.category || "swing" as const,
  });

  const [exits, setExits] = useState(initialData?.exits || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [showOCR, setShowOCR] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPnL = exits.reduce((sum, exit) => sum + exit.pnl, 0);
    const status = exits.length === 0 ? "open" : (exits.reduce((sum, exit) => sum + exit.quantity, 0) >= formData.quantity ? "closed" : "partial");

    onSubmit({
      symbol: formData.symbol,
      direction: formData.direction,
      entryPrice: formData.entryPrice,
      entryTime: new Date(formData.entryTime),
      stopPrice: formData.stopPrice || undefined,
      exits,
      quantity: formData.quantity,
      totalPnL,
      notes: formData.notes,
      tags,
      category: formData.category,
      status,
    });

    onClose();
  };

  const addExit = () => {
    const newExit = {
      id: Date.now().toString(),
      price: 0,
      quantity: 0,
      time: new Date(),
      pnl: 0,
    };
    setExits([...exits, newExit]);
  };

  const updateExit = (index: number, field: string, value: any) => {
    const updatedExits = [...exits];
    updatedExits[index] = { ...updatedExits[index], [field]: value };
    
    // Calculate PnL for this exit
    if (field === 'price' || field === 'quantity') {
      const exit = updatedExits[index];
      const priceDiff = formData.direction === "LONG" 
        ? exit.price - formData.entryPrice 
        : formData.entryPrice - exit.price;
      exit.pnl = priceDiff * exit.quantity;
    }
    
    setExits(updatedExits);
  };

  const removeExit = (index: number) => {
    setExits(exits.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Trade</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={() => setShowOCR(true)} 
              variant="outline" 
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Upload Screenshot
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="BTC/USDT"
                  required
                />
              </div>

              <div>
                <Label htmlFor="direction">Direction</Label>
                <Select value={formData.direction} onValueChange={(value: "LONG" | "SHORT") => setFormData({ ...formData, direction: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LONG">LONG</SelectItem>
                    <SelectItem value="SHORT">SHORT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00000001"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="entryTime">Entry Time</Label>
                <Input
                  id="entryTime"
                  type="datetime-local"
                  value={formData.entryTime}
                  onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.00000001"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stopPrice">Stop Price (Optional)</Label>
                <Input
                  id="stopPrice"
                  type="number"
                  step="0.00000001"
                  value={formData.stopPrice}
                  onChange={(e) => setFormData({ ...formData, stopPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: "scalp" | "swing" | "position") => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scalp">Scalp</SelectItem>
                    <SelectItem value="swing">Swing</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exits Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Exits</Label>
                <Button type="button" onClick={addExit} size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Exit
                </Button>
              </div>

              {exits.map((exit, index) => (
                <Card key={exit.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Exit Price</Label>
                      <Input
                        type="number"
                        step="0.00000001"
                        value={exit.price}
                        onChange={(e) => updateExit(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        step="0.00000001"
                        value={exit.quantity}
                        onChange={(e) => updateExit(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Exit Time</Label>
                      <Input
                        type="datetime-local"
                        value={exit.time.toISOString().slice(0, 16)}
                        onChange={(e) => updateExit(index, 'time', new Date(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>PnL</Label>
                        <div className={`p-2 rounded border ${exit.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          ${exit.pnl.toFixed(2)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeExit(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 flex-wrap">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">Add</Button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Trade analysis, market conditions, etc..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Register Trade
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ScreenshotOCR
        isOpen={showOCR}
        onClose={() => setShowOCR(false)}
        onParsed={(data) => {
          if (data.symbol) setFormData(prev => ({ ...prev, symbol: data.symbol! }));
          if (data.direction) setFormData(prev => ({ ...prev, direction: data.direction! }));
          if (data.entryPrice) setFormData(prev => ({ ...prev, entryPrice: data.entryPrice! }));
          if (data.quantity) setFormData(prev => ({ ...prev, quantity: data.quantity! }));
          if (data.stopPrice) setFormData(prev => ({ ...prev, stopPrice: data.stopPrice! }));
          setShowOCR(false);
        }}
      />
    </>
  );
}