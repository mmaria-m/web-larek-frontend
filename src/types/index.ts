// ИНТЕРФЕЙсЫ И ТИПЫ

// ТИПЫ
type ProductCategory = 'soft' | 'other' | 'additional' | 'button' | 'hard';
type PaymentMethod = 'card' | 'cash'; 

// ИНТЕРФЕЙСЫ

// товар
interface IItem {
    id: string;
    description: string;
    image: string;
    title: string; 
    price: number | null;
    category: ProductCategory;
}

interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

interface IOrderResult {
    id: string;
    total: number;
}

// корзина
interface IBasket {
    items: string[];
    total: number;
}

// интерфейс отображения формы оформления заказа
interface IForm {
    paymentMethod?: PaymentMethod;
    address?: string;
    email?: string;
    phone?: string;
}

// интерфейс отображения удачного офорления заказа
interface ISuccessView {
    total: number;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export {ProductCategory, PaymentMethod, IItem, IOrder, IOrderResult, IBasket, IForm, ISuccessView, ICardActions}