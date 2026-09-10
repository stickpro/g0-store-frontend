import { CURRENCY_CODE } from '~/utils/constants/currency';
import { parseVariantPrice } from '~/utils/mappers/shortProduct';

const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  pending: 'Ожидает обработки',
  awaiting_payment: 'Ожидает оплаты',
  paid: 'Оплачен',
  processing: 'В обработке',
  assembling: 'Собирается',
  shipped: 'Отправлен',
  in_transit: 'В пути',
  delivered: 'Доставлен',
  completed: 'Выполнен',
  cancelled: 'Отменён',
  canceled: 'Отменён',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает оплаты',
  unpaid: 'Не оплачен',
  paid: 'Оплачен',
  failed: 'Ошибка оплаты',
  refunded: 'Возврат',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Банковская карта',
  invoice: 'По счёту',
  cash: 'При получении',
};

const SHIPPING_METHOD_LABELS: Record<string, string> = {
  pickup: 'Самовывоз',
  cdek: 'СДЭК',
  cdek_courier: 'СДЭК курьер',
  post: 'Почта России',
  pochta: 'Почта России',
  yandex: 'Яндекс Доставка',
  yandex_delivery: 'Яндекс Доставка',
};

export function formatShippingEta(minDays?: number | null, maxDays?: number | null) {
  if (minDays == null && maxDays == null) return '';
  if (minDays != null && maxDays != null && minDays !== maxDays) {
    return `Доставка ${minDays}–${maxDays} дня`;
  }
  const days = maxDays ?? minDays;
  if (days == null) return '';
  return `Доставка ${days} дн.`;
}

/** Round to kopecks; avoids float artifacts like 254204.63999999998. */
export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatOrderMoney(price?: number | string) {
  const amount = parseVariantPrice(price);
  if (amount == null) return `0 ${CURRENCY_CODE}`;
  const [intPart, fracPart] = roundMoney(amount).toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const display = fracPart === '00' ? grouped : `${grouped}.${fracPart}`;
  return `${display} ${CURRENCY_CODE}`;
}

export function hasOrderMoney(price?: number | string) {
  const amount = parseVariantPrice(price);
  return amount != null && amount !== 0;
}

export function formatOrderDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function orderStatusLabel(status?: string) {
  if (!status) return 'Статус неизвестен';
  return ORDER_STATUS_LABELS[status] || status;
}

export function paymentStatusLabel(status?: string) {
  if (!status) return '';
  return PAYMENT_STATUS_LABELS[status] || status;
}

export function paymentMethodLabel(method?: string) {
  if (!method) return '';
  return PAYMENT_METHOD_LABELS[method] || method;
}

export function shippingMethodLabel(method?: string) {
  if (!method) return '';
  return SHIPPING_METHOD_LABELS[method] || method;
}

export function orderNumber(order: { number?: number; id?: string }) {
  if (order.number != null) return String(order.number);
  return '';
}

export function orderDetailPath(order: { number?: number }) {
  if (order.number == null) return '/account/orders';
  return `/account/orders/${order.number}`;
}

export function orderSuccessPath(order: { number?: number }, options?: { paid?: boolean }) {
  const query = new URLSearchParams();
  if (order.number != null) query.set('number', String(order.number));
  if (options?.paid) query.set('paid', '1');
  const qs = query.toString();
  return qs ? `/order/success?${qs}` : '/order/success';
}

export function isCancelledOrder(status?: string) {
  return status === 'cancelled' || status === 'canceled';
}
