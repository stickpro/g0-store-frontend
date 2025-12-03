export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK',
  PRE_ORDER: 'PRE_ORDER',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

export type StockStatus = typeof STOCK_STATUS[keyof typeof STOCK_STATUS];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  [STOCK_STATUS.IN_STOCK]: 'Есть в наличии',
  [STOCK_STATUS.PRE_ORDER]: 'Под заказ',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Нет в наличии',
};

export function getStockStatusLabel(status: string | undefined): string {
  if (!status) return 'Есть в наличии';
  return STOCK_STATUS_LABELS[status as StockStatus] || status;
}
