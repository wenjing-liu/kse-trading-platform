export interface Trade {
  tradeId: string;
  tradeName: string;
  tradeSymbol: string;
  currentPrice: number;
  lastPrice: number;
  trend: 'up' | 'down' | 'sideways';
  updateTime: Date;
  createTime: Date;
  tradeStatus: 'open' | 'closed' | 'filled' | 'cancelled';
}