// ИНТЕРФЕЙсЫ И ТИПЫ

// ТИПЫ
type ProductCategory = 'soft-skill' | 'other' | 'additional' | 'button' | 'hard-skill';
type PaymentMethod = 'online' | 'cash'; 

// ИНТЕРФЕЙСЫ

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
    totalPrice: number;
    items: string[];
}

interface IBasket {
    items: string[];
    totalPrice: number;
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
    totalPrice: number;
}
