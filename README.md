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
- Presenter — передает информацию между Model и View.

## Типы и интерфесы
Типы и интерфейсы заданы в src/types/index.ts.

#### ProductCategory
Виды категорий товаров
```ts
type ProductCategory = 'soft-skill' | 'other' | 'additional' | 'button' | 'hard-skill';
```

#### PaymentMethod
Возможные методы оплаты заказа
```ts
type PaymentMethod = 'online' | 'cash'; 
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
    totalPrice: number;
    items: string[];
}
```

#### IBasket
Описывает список товаров в корзине и их общую стоимость
```ts
interface IBasket {
    items: string[];
    totalPrice: number;

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
Данные для окна удачного офорления заказа
```ts
interface ISuccessView {
    totalPrice: number;
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
- `on` – добавлят обработчик события.
- `off` – убирает обработчик события.
- `emit` – вызывает событие.
- `onAll` — добавлят обработчик на все события.
- `ofAll` — снимает обработчик со всех событий.

### Model

#### ProductListModel
**Назначение:** логика работы с товарами.

**Поля:** 
- `items` – хранит массив товаров.

**Методы:**
- `setProducts()` – заполняет массив товаров данными.

#### BasketModel
**Назначение:** логика работы с товарами, добавленными в корзину. 

**Поля:** 
- `items` — хранит массив товаров.
- `totalPrice` – сумма к оплате.

**Методы:**
- `addToBasket()` – позволяет добавить товар в корзину.
- `removeFromBasket()` – позволяет убрать товар из корзины.
- `clearBasket()` – позволяет очистить корзину.

### View

#### ModalView
**Назначение:** реализация модального окна.

**Поля:** DOM-элемент для контента, DOM-элемент кнопки.

**Методы:** 
- `open()`
- `close()`

#### CardView
**Назначение:** реализация отображения карточки товара.

**Поля:** DOM-элементы названия товара, категории, изображения, цены, описания, кнпоки.

**Методы:** 
- `set title()`
- `set category()`
- `set image()`
- `set price()`
- `set description()`

#### BasketView
**Назначение:** отображение корзины.

**Поля:** DOM-элемент списка товаров, DOM-элемент итоговой суммы, DOM-элемент кнопки.

**Методы:** 
- `set total()`
- `set items()`

#### FormView
**Назначение:** отображение форм.

**Поля:** данные пользователя, DOM-элемент кнопки.

**Методы:**
- `set valid()`
- `set error()`