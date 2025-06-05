import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/BasketModel';
import { ProductListModel } from './components/model/ProductListModel';
import { CardView } from './components/view/CardView';
import { ModalView } from './components/view/ModalView';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IItem } from './types';
import { BasketView } from './components/view/BasketView';
import { IForm, PaymentMethod } from './types';
import { OrderFormView, ContactsFormView } from './components/view/FormView';
import { SuccessView } from './components/view/SuccessView';
import { OrderModel } from './components/model/OrderModel';
import { GalleryView } from './components/view/GalleryView';
import { HeaderView } from './components/view/HeaderView';
import { CardListView } from './components/view/CardListView';

// Инициализация
const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const productListModel = new ProductListModel({}, events);

const basketModel = new BasketModel({ items: [] }, events);

const orderModel = new OrderModel(
	{
		payment: undefined,
		address: '',
		email: '',
		phone: '',
	},
	events
);
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new ModalView(modalContainer, events, pageWrapper);

const orderElement = cloneTemplate('#order');
const orderFormView = new OrderFormView(orderElement, events);
const contactsElement = cloneTemplate('#contacts');
const contactsFormView = new ContactsFormView(contactsElement, events);
const successElement = cloneTemplate('#success');
const successView = new SuccessView(successElement, events, pageWrapper);

const basketElement = cloneTemplate('#basket');
const basketView = new BasketView(basketElement, events);

const headerView = new HeaderView(document.querySelector('.header'), events);
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const galleryView = new GalleryView(galleryContainer, events);

// Загрузка списка товаров
api
	.getItemsList()
	.then((items) => {
		productListModel.productCards = items;
	})
	.catch((error) => {
		console.error('Ошибка при загрузке списка товаров:', error);
	});

// функця для генерации карточек галереи
const createGalleryCard = (item: IItem): HTMLElement => {
	const cardElement = cloneTemplate('#card-catalog');
	const cardView = new CardView(cardElement, events, {
		onClick: () => events.emit('card:select', item),
	});
	cardView.render(item);
	return cardElement;
};

const cardListView = new CardListView(createGalleryCard);

// Обработчик получения товаров
events.on('items:receive', ({ items }: { items: IItem[] }) => {
	const cardElements = items.map((item, index) =>
		cardListView.createCard(item, index)
	);
	galleryView.items = cardElements;
});

// Открытие карточки товара в модальном окне
events.on('card:select', (item: IItem) => {
	const cardPreviewElement = cloneTemplate('#card-preview');
	const cardPreview = new CardView(cardPreviewElement, events, {
		onClick: () => {
			const basket = basketModel.getBasket();
			if (basket.items.includes(item.id)) {
				basketModel.removeFromBasket(item);
				cardPreview.buttonText = 'В корзину';
			} else {
				basketModel.addToBasket(item);
				cardPreview.buttonText = 'Убрать';
			}
		},
	});
	cardPreview.render(item);
	cardPreview.buttonText = basketModel.getBasket().items.includes(item.id)
		? 'Убрать'
		: 'В корзину';
	modal.open(cardPreviewElement);
});

// Отображение корзины в модальном окне
events.on('basket:open', () => {
	modal.open(basketElement);
});

events.on('basket:changed', () => {
	const items = basketModel.getItems();
	const cardElements = items.map((item, index) => {
		const cardElement = cloneTemplate('#card-basket');
		const card = new CardView(cardElement, events, {
			onClick: () => events.emit('basket:remove', item),
		});
		card.render({ ...item, index: index + 1 });
		return cardElement;
	});
	basketView.items = cardElements;
	basketView.total = basketModel.getBasket().total;
	headerView.counterValue = basketModel.getBasket().items.length;
});

// Обработчик удаления из корзины
events.on('basket:remove', (item: IItem) => {
	basketModel.removeFromBasket(item);
});

// Обработка открытия формы заказа
events.on('basket:order', () => {
	const order = orderModel.getOrder();
	modal.open(orderElement);

	orderFormView.paymentMethod = order.payment;
	orderFormView.address = order.address;
	orderFormView.valid = orderModel.isOrderValid();
});

// Валидация формы адреса/оплаты
events.on('order.payment:change', (data: { payment: PaymentMethod }) => {
	orderModel.setPayment(data.payment);
	orderFormView.valid = orderModel.isOrderValid();
	orderFormView.error = orderModel.isOrderValid() ? '' : 'Заполните все поля';
});
events.on('order.address:change', (data: { address: string }) => {
	orderModel.setAddress(data.address);
	orderFormView.valid = orderModel.isOrderValid();
	orderFormView.error = orderModel.isOrderValid() ? '' : 'Заполните все поля';
});

events.on('order:changed', () => {
	const order = {
		...orderModel.getOrder(),
		items: basketModel.getBasket().items,
		total: basketModel.getBasket().total,
	};

	orderFormView.paymentMethod = order.payment;
	orderFormView.address = order.address;
	orderFormView.valid = orderModel.isOrderValid();
});

// Переход к форме контактов
events.on('order:submit', () => {
	if (orderModel.isOrderValid()) {
		modal.open(contactsElement);
		contactsFormView.valid = orderModel.isContactsValid();
	}
});

// Валидация формы контактов
events.on('contacts.email:change', (data: { email: string }) => {
	orderModel.setEmail(data.email);
	contactsFormView.valid = orderModel.isContactsValid();
	contactsFormView.error = orderModel.isContactsValid()
		? ''
		: 'Заполните все поля';
});
events.on('contacts.phone:change', (data: { phone: string }) => {
	orderModel.setPhone(data.phone);
	contactsFormView.valid = orderModel.isContactsValid();
	contactsFormView.error = orderModel.isContactsValid()
		? ''
		: 'Заполните все поля';
});

events.on('contacts:changed', () => {
	const order = orderModel.getOrder();
	contactsFormView.email = order.email;
	contactsFormView.phone = order.phone;
	contactsFormView.valid = orderModel.isContactsValid();
});

// Отправка заказа
events.on('contacts:submit', async () => {
	if (!orderModel.isValid()) return;
	const basket = basketModel.getBasket();
	const orderData = orderModel.getOrder();
	const order = {
		payment: orderData.payment as PaymentMethod,
		address: orderData.address as string,
		email: orderData.email as string,
		phone: orderData.phone as string,
		items: basket.items,
		total: basket.total,
	};
	try {
		const result = await api.submitOrder(order);
		successView.total = result.total;
		modal.open(successElement);
		basketModel.clearBasket();
		orderModel.clearOrder();
		headerView.counterValue = 0;
	} catch (error) {
		console.error('Ошибка при отправке заказа:', error);
	}
});

events.on('success:closed', () => {
	modal.close();
});
