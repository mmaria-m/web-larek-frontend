import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IItem, IBasket } from '../../types';
import { CardView } from './CardView';

export class BasketView extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

    this._button.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

    set items(items: IItem[]) {
        this._list.innerHTML = '';
        items.forEach((item) => {
            const cardElement = cloneTemplate('#card-basket');
            const cardView = new CardView(cardElement, this.events, {
                onClick: () => this.events.emit('basket:remove', item),
            });
            cardView.render({
                ...item,
                title: item.title,
                price: item.price,
            });
            this._list.append(cardElement);
        });

        // Отключение кнопки, если корзина пуста
        this.setDisabled(this._button, !items.length);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}
