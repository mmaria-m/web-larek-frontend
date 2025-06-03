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

// Инициализация
const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const productListModel = new ProductListModel({}, events);

const basketModel = new BasketModel({ items: [], total: 0 }, events);

const orderModel = new OrderModel(
	{
		payment: undefined,
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	},
	events,
	basketModel
);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new ModalView(modalContainer, events);
const cardGallery = ensureElement<HTMLElement>('.gallery');
const galleryView = new GalleryView(cardGallery, events);

const orderElement = cloneTemplate('#order');
const orderFormView = new OrderFormView(orderElement, events);
const contactsElement = cloneTemplate('#contacts');
const contactsFormView = new ContactsFormView(contactsElement, events);
const successElement = cloneTemplate('#success');
const successView = new SuccessView(successElement, events);

const basketElement = cloneTemplate('#basket');
const basketView = new BasketView(basketElement, events);

const basketButton = ensureElement<HTMLButtonElement>('.header__basket');

const headerView = new HeaderView(document.querySelector('.header'), events);

// Загрузка списка товаров
api
	.getItemsList()
	.then((items) => {
		productListModel.productCards = items;
	})
	.catch((error) => {
		console.error('Ошибка при загрузке списка товаров:', error);
	});

// Отображение карточек на странице
events.on('items:receive', ({ items }: { items: IItem[] }) => {
	galleryView.items = items;
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

// Обработка открытия корзины
basketButton.addEventListener('click', () => {
	events.emit('basket:open');
});

// Отображение корзины в модальном окне
events.on('basket:open', () => {
	modal.open(basketElement);
});

// Обновление корзины
events.on('basket:changed', () => {
	const basket = basketModel.getBasket();
	basketView.items = basketModel.getItems();
	basketView.total = basket.total;
	headerView.counterValue = basket.items.length;

	if (
		modal.container.classList.contains('modal_active') &&
		modal.container.querySelector('.basket')
	) {
		modal.open(basketElement);
	}
});

// Обработчик удаления из корзины
events.on('basket:remove', (item: IItem) => {
	basketModel.removeFromBasket(item);
});

// Обработка открытия формы заказа
events.on('basket:order', () => {
	if (modal.container.querySelector('.form')) return;
	modal.open(orderElement);
	orderFormView.valid = orderModel.isValid();
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
	const order = orderModel.getOrder();
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
	orderFormView.error = orderModel.isOrderValid() ? '' : 'Заполните все поля';
});
events.on('contacts.phone:change', (data: { phone: string }) => {
	orderModel.setPhone(data.phone);
	contactsFormView.valid = orderModel.isContactsValid();
	orderFormView.error = orderModel.isOrderValid() ? '' : 'Заполните все поля';
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
	const order = {
		...orderModel.getOrder(),
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

events.on('modal:opened', () => {
	const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;
	if (pageWrapper) {
		pageWrapper.classList.add('page__wrapper_locked');
	}
});

events.on('modal:closed', () => {
	const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;
	if (pageWrapper) {
		pageWrapper.classList.remove('page__wrapper_locked');
	}
});
