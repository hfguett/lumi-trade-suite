import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileImage, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { OCRParseResult } from "@/types/trading";

interface ScreenshotOCRProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (result: OCRParseResult) => void;
}

// Mock OCR parsing function - replace with real OCR service
const mockOCRParse = (file: File): Promise<OCRParseResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate OCR parsing with random data
      const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"];
      const directions = ["LONG", "SHORT"] as const;
      
      resolve({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        direction: directions[Math.floor(Math.random() * directions.length)],
        entryPrice: Math.random() * 50000 + 20000,
        exitPrice: Math.random() * 50000 + 20000,
        stopPrice: Math.random() * 50000 + 15000,
        quantity: Math.random() * 2 + 0.1,
        pnl: (Math.random() - 0.5) * 1000,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        suggestions: [
          "Entry price detected with high confidence",
          "Symbol recognition successful",
          "Direction identified from order type",
          "Consider verifying quantity amount"
        ]
      });
    }, 2000);
  });
};

export function ScreenshotOCR({ isOpen, onClose, onParsed }: ScreenshotOCRProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRParseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile);
    }
  };

  const processOCR = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const parseResult = await mockOCRParse(file);
      setResult(parseResult);
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onParsed(result);
      resetState();
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Screenshot OCR Parser
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!file && (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Trading Screenshot</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop or click to select a screenshot of your trade
              </p>
              <Button variant="outline" className="gap-2">
                <FileImage className="w-4 h-4" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {file && preview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold">Screenshot Preview</h3>
                <Card className="p-4">
                  <img 
                    src={preview} 
                    alt="Trade screenshot" 
                    className="w-full h-auto rounded border"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={processOCR}
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Parse Trade Data
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <h3 className="font-semibold">Parsed Trade Data</h3>
                
                {isProcessing && (
                  <Card className="p-6 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing screenshot...</p>
                  </Card>
                )}

                {result && (
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Extracted Data</h4>
                      <Badge variant={result.confidence > 0.8 ? "default" : "secondary"}>
                        {Math.round(result.confidence * 100)}% Confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.symbol && (
                        <div>
                          <span className="text-muted-foreground">Symbol:</span>
                          <p className="font-mono">{result.symbol}</p>
                        </div>
                      )}
                      {result.direction && (
                        <div>
                          <span className="text-muted-foreground">Direction:</span>
                          <p className="font-mono">{result.direction}</p>
                        </div>
                      )}
                      {result.entryPrice && (
                        <div>
                          <span className="text-muted-foreground">Entry Price:</span>
                          <p className="font-mono">${result.entryPrice.toFixed(2)}</p>
                        </div>
                      )}
                      {result.quantity && (
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <p className="font-mono">{result.quantity.toFixed(4)}</p>
                        </div>
                      )}
                      {result.stopPrice && (
                        <div>
                          <span className="text-muted-foreground">Stop Price:</span>
                          <p className="font-mono">${result.stopPrice.toFixed(2)}</p>
                        </div>
                      )}
                      {result.pnl && (
                        <div>
                          <span className="text-muted-foreground">PnL:</span>
                          <p className={`font-mono ${result.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                            ${result.pnl.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {result.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Analysis Notes:</h5>
                        {result.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            {suggestion.includes('Consider') || suggestion.includes('verify') ? (
                              <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            )}
                            <span className="text-muted-foreground">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleConfirm} className="gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Use This Data
                      </Button>
                      <Button variant="outline" onClick={processOCR}>
                        Re-analyze
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}