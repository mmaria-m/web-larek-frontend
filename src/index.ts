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
import { IForm } from './types';
import { OrderFormView, ContactsFormView } from './components/view/FormView';
import { SuccessView } from './components/view/SuccessView';
import { OrderModel } from './components/model/OrderModel';

// Инициализация
const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const productListModel = new ProductListModel({}, events);
const basketModel = new BasketModel({}, events, productListModel);
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new ModalView(modalContainer, events);
const cardGallery = ensureElement<HTMLElement>('.gallery');
const orderModel = new OrderModel({}, events);

// Загрузка списка товаров
api.getItemsList().then((items) => {
	productListModel.setProducts(items);
});

// Отображение карточек на странице
events.on('catalog:changed', ({ items }: { items: IItem[] }) => {
	cardGallery.innerHTML = '';
	items.forEach((item) => {
		const cardElement = cloneTemplate('#card-catalog');
		const card = new CardView(cardElement, events, {
			onClick: () => {
				events.emit('card:select', item);
			},
		});
		card.render(item);
		cardGallery.append(cardElement);
	});
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
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
basketButton.addEventListener('click', () => {
	events.emit('basket:open');
});

// Отображение корзины в модальном окне
events.on('basket:open', () => {
	const basketElement = cloneTemplate('#basket');
	const basketView = new BasketView(basketElement, events);
	const basket = basketModel.getBasket();
	basketView.items = productListModel.items.filter((item) =>
		basket.items.includes(item.id)
	);
	basketView.total = basket.total;
	modal.open(basketElement);
});

// Обновление корзины
events.on('basket:changed', () => {
	const basket = basketModel.getBasket();
	const basketButtonCounter = ensureElement<HTMLElement>(
		'.header__basket-counter'
	);
	basketButtonCounter.textContent = basket.items.length.toString();

	if (
		modal.container.classList.contains('modal_active') &&
		modal.container.querySelector('.basket')
	) {
		const basketElement = cloneTemplate('#basket');
		const basketView = new BasketView(basketElement, events);
		basketView.items = productListModel.items.filter((item) =>
			basket.items.includes(item.id)
		);
		basketView.total = basket.total;
		modal.open(basketElement);
	}
});

// Обработчик удаления из корзины
events.on('basket:remove', (item: IItem) => {
	basketModel.removeFromBasket(item);
});


events.on('basket:order', () => {
    if (
        modal.container.classList.contains('modal_active') &&
        modal.container.querySelector('.form')
    ) {
        return;
    }
    const orderElement = cloneTemplate('#order');
    const orderFormView = new OrderFormView(orderElement, events);
    modal.open(orderElement);
});

// Валидация формы адреса/оплаты
events.on('order:change', (data: IForm) => {
	orderModel.setOrderData(data);
    const order = orderModel.getOrder();

	const paymentSelected = !!data.paymentMethod;
	const addressFilled = !!data.address && data.address.trim().length > 0;
	const formView = modal.container.querySelector('.form') as HTMLElement;
	if (formView) {
		const submitButton = formView.querySelector(
			'.button[type="submit"]'
		) as HTMLButtonElement;
		const errorBlock = formView.querySelector('.form__errors') as HTMLElement;
		submitButton.disabled = !(paymentSelected && addressFilled);
		errorBlock.textContent =
			paymentSelected && addressFilled ? '' : 'Заполните все поля';
	}
});

// Переход к форме контактов
events.on('order:submit', (data: IForm) => {
    orderModel.setOrderData(data);
    const order = orderModel.getOrder();
	if (data.paymentMethod && data.address) {
		const contactsElement = cloneTemplate('#contacts');
		const contactsFormView = new ContactsFormView(contactsElement, events);
		modal.open(contactsElement);
	}
});

// Валидация формы контактов
events.on('contacts:change', (data: IForm) => {
orderModel.setOrderData(data);
    const order = orderModel.getOrder();
    console.log('Contacts changed:', order);

	const emailFilled = !!data.email && data.email.trim().length > 0;
	const phoneFilled = !!data.phone && data.phone.trim().length > 0;

	const formView = modal.container.querySelector('.form') as HTMLElement;
	if (formView) {
		const submitButton = formView.querySelector(
			'.button[type="submit"]'
		) as HTMLButtonElement;
		const errorBlock = formView.querySelector('.form__errors') as HTMLElement;
		submitButton.disabled = !(emailFilled && phoneFilled);
		errorBlock.textContent =
			emailFilled && phoneFilled ? '' : 'Заполните все поля';
	}
});

// Отправка заказа
events.on('contacts:submit', async (data: IForm) => {
	const basket = basketModel.getBasket();
	orderModel.setOrderData({
		...data,
		items: basket.items,
		total: basket.total
	});
    const order = orderModel.getOrder();

	if (
order.email &&
        order.phone &&
        order.payment &&
        order.address
	) {
		try {
 console.log('Submitting order:', order);
			const result = await api.submitOrder(order);
			const successElement = cloneTemplate('#success');
			const successView = new SuccessView(successElement, events);
			successView.total = result.total;
			modal.open(successElement);
			basketModel.clearBasket();
			orderModel.clearOrder();
			const basketButtonCounter = ensureElement<HTMLElement>(
				'.header__basket-counter'
			);
			basketButtonCounter.textContent = '0';
		} catch (error) {
			console.error('Ошибка при отправке заказа:', error);
		}
	}
});
events.on('success:closed', () => {
	modal.close();
});
