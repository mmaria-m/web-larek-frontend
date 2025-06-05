# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Архитектура основана на паттерне MVP. Т.е. приложение разделено на три слоя:

- Model – работает с данными;
- View – работает с отображением;
- Presenter — передает информацию между Model и View. Логика Presenter находится в index.ts.

## Взаимодействие компонентов

Компоненты взаимодействуют через события, реализованные с помощью EventEmitter, который слушает события от View и Model и инициирует изменения.
View генерирует события в ответ на действия пользователя.

Model отправляет события об изменениях состояния.

Presenter подписывается на события, обрабатывает их и координирует работу между слоями.

## Ключевые события

- items:receive — получение списка товаров.

- card:select — выбор карточки товара.

- catalog:changed — обновление каталога товаров.

- basket:open — открытие корзины.

- basket:changed — изменение корзины.

- basket:remove — удаление товара из корзины.

- basket:order — переход к оформлению заказа.

- order:changed — изменение данных формы оплаты/адреса.

- order:submit — отправка формы оплаты/адреса.

- contacts:changed — изменение данных формы контактов.

- contacts:submit — отправка заказа на сервер.

- success:closed — закрытие окна об успешном заказе.

- modal:opened — открытие модального окна.

- modal:closed — закрытие модального окна.

## Типы и интерфейсы

Типы и интерфейсы заданы в src/types/index.ts.

#### ProductCategory

Виды категорий товаров

```ts
type ProductCategory =
	| 'soft'
	| 'other'
	| 'additional'
	| 'button'
	| 'hard';
```

#### PaymentMethod

Возможные методы оплаты заказа

```ts
type PaymentMethod = 'card' | 'cash';
```

#### IItem

Описывает товар из каталога

```ts
interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	price: number | null;
	category: ProductCategory;
}
```

#### IOrder

Описывает заказ пользователя

```ts
interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

#### IBasket

Описывает список товаров в корзине и их общую стоимость

```ts
interface IBasket {
	items: string[];
	total: number;
}
```

#### IForm

Данные, которые пользователь вводит при оформлении заказа

```ts
interface IForm {
	paymentMethod?: PaymentMethod;
	address?: string;
	email?: string;
	phone?: string;
}
```

#### ISuccessView

Данные для окна успешного оформления заказа

```ts
interface ISuccessView {
	total: number;
}
```

## Классы

### Базовые

#### API

**Назначение:** взаимодействие с сервером.

**Методы:**

- `handleResponse` — обрабатывает ответы.
- `get` – отправляет запрос на сервер и получает ответ.
- `post` – отправляет данные на сервер.

#### EventEmitter

**Назначение:** организация работы с событиями.

**Методы:**

- `on` – добавляет обработчик события.
- `off` – убирает обработчик события.
- `emit` – вызывает событие.
- `onAll` — добавляет обработчик на все события.
- `ofAll` — снимает обработчик со всех событий.

#### Component

**Назначение:** базовый класс для компонентов отображения.

**Методы:**

- `toggleClass()` — переключает класс.
- `setText()` — устанавливает текст.
- `setDisabled()` — управляет disabled.
- `setHidden()` — скрывает элемент.
- `setVisible()` — показывает элемент.
- `setImage()` — устанавливает изображение.
- `render()` — рендерит компонент.

#### Model

**Назначение:** базовый класс для моделей данных.

**Методы:**

- `emitChanges()` — вызывает событие.

### Model

#### ProductListModel

**Назначение:** логика работы с товарами.

**Поля:**

- `productCards` – хранит массив товаров.

**Методы:**

- `set productCards()` – заполняет массив товаров данными.
- `get productCards()` – возвращает массив товаров.
- `getProduct()` – получает товар по id.

#### BasketModel

**Назначение:** логика работы с товарами, добавленными в корзину.

**Поля:**

- `items` — хранит массив товаров (`IItem[]`).

**Методы:**

- `addToBasket()` – позволяет добавить товар в корзину.
- `removeFromBasket()` – позволяет убрать товар из корзины.
- `clearBasket()` – позволяет очистить корзину.
- `getBasket()` — возвращает корзину (`IBasket`).
- `getItems()` — возвращает товары корзины.
- `calculateTotal()` — вычисляет сумму товаров.

### OrderModel

**Назначение:** хранение данных заказа.

**Поля:**
payment, address, email, phone.

**Методы:**

- `setPayment()` -  устанавливает метод оплаты.
- `setAddress()` - устанавливает адрес
- `setEmail()` - устанавливает email
- `setPhone()` -  устанавливает телефон
- `getOrder()` — возвращает заказ.
- `clearOrder()` — очищает данные.
- `isOrderValid()` - проверяет валидность данных оплаты и адреса.
- `isContactsValid()` - проверяет валидность контактов
- `isValid()` – проверяет валидность всего заказа.

### View

#### ModalView

**Назначение:** реализация модального окна.

**Поля:** DOM-элемент для контента, DOM-элемент кнопки, pagewrapper.

**Методы:**

- `open()`
- `close()`
- `render()`

#### CardView

**Назначение:** реализация отображения карточки товара.

**Поля:** DOM-элементы названия товара, категории, изображения, цены, описания, кнопки, порядкового номера.

**Методы:**
- `set id`
- `set title `
- `set price`
- `set category`
- `set image`
- `set description`
- `set buttonText`
- `set index`

#### BasketView

**Назначение:** отображение корзины.

**Поля:** DOM-элемент списка товаров, DOM-элемент итоговой суммы, DOM-элемент кнопки.

**Методы:**

- `set total()`
- `set items()`

#### FormView

**Назначение:** общий класс для отображения форм.

**Поля:** DOM-элемент для отображения ошибок, DOM-элемент кнопки.

**Методы:**

- `set valid()`
- `set error()`
- `getFormData()`

#### OrderFormView

**Назначение:** Форма оплаты и адреса.

**Поля:** \_paymentButtons, \_address, \_submitButton, \_errors.

**Методы:**
- `set paymentMethod()`
- `set address()`
- `getFormData()`
- `set valid()`
- `set error()`

#### ContactsFormView

**Назначение:** Форма контактов.

**Поля:** \_email, \_phone, \_submitButton, \_errors.

**Методы:**
- `set email()`
- `set phone()`
- `getFormData()`
- `set valid()`

#### SuccessView

**Назначение:** отображение окна успешного заказа.

**Поля:** сумма заказа, DOM-элемент кнопки закрытия.

**Методы:**

- `set total()`
- `close()`
- `set locked()`

#### GalleryView
**Назначение:** отображение каталога товаров.

**Поля:** DOM-элемент контейнера.

**Методы:**
- `set items()` 

#### CardListView

**Назначение:**  отображение списка карточек товаров.

**Методы:**
`createCard()`

#### HeaderView
**Назначение:** отображение шапки сайта.

**Поля:** DOM-элементы корзины и счетчика товаров.

**Методы:**
`set counterValue()` — отображает количество товаров в корзине.

### Presenter

**Назначение:** координация между Model и View. Логика Presenter реализована в index.ts:
**Реализация:** в index.ts. Используется EventEmitter для обработки событий и управления состоянием интерфейса.
