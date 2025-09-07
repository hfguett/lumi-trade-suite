export interface TradeEntry {
  id: string;
  symbol: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  entryTime: Date;
  stopPrice?: number;
  exits: TradeExit[];
  quantity: number;
  totalPnL: number;
  notes: string;
  tags: string[];
  category: "scalp" | "swing" | "position";
  screenshotUrl?: string;
  status: "open" | "closed" | "partial";
}

export interface TradeExit {
  id: string;
  price: number;
  quantity: number;
  time: Date;
  pnl: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OCRParseResult {
  symbol?: string;
  direction?: "LONG" | "SHORT";
  entryPrice?: number;
  exitPrice?: number;
  stopPrice?: number;
  quantity?: number;
  pnl?: number;
  confidence: number;
  suggestions: string[];
}

export interface ChartTimeframe {
  label: string;
  value: string;
  minutes: number;
}

export interface ChartInterval {
  label: string;
  value: string;
  seconds: number;
}