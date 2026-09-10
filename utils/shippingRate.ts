import { parseVariantPrice } from '~/utils/mappers/shortProduct';
import { roundMoney } from '~/utils/order';

/** Decimal string for expected_total / API money fields. */
export function formatMoneyAmount(price?: number | string | null) {
  const amount = parseVariantPrice(price);
  if (amount == null) return '0.00';
  return roundMoney(amount).toFixed(2);
}
