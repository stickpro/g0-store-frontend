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
  post: 'Почта России',
  yandex: 'Яндекс Доставка',
};

export function formatOrderMoney(price?: number | string) {
  const amount = parseVariantPrice(price);
  if (amount == null) return `0 ${CURRENCY_CODE}`;
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${CURRENCY_CODE}`;
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

export function isCancelledOrder(status?: string) {
  return status === 'cancelled' || status === 'canceled';
}
