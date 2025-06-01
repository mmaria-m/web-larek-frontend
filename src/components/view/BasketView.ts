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
    items.forEach((item, index) => {
      const cardElement = cloneTemplate('#card-basket');
      const card = new CardView(cardElement, this.events, {
        onClick: () => {
          this.events.emit('basket:remove', item);
        },
      });
      card.render({
        title: item.title,
        price: item.price,
      });
      const indexElement = ensureElement<HTMLElement>('.basket__item-index', cardElement);
      this.setText(indexElement, index + 1);
      this._list.append(cardElement);
    });
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
    this.setDisabled(this._button, value === 0);
  }
}