import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IItem, IBasket } from '../../types';
import { CardView } from './CardView';
import { CardListView } from './CardListView';

export class BasketView extends Component<HTMLElement> {
	protected list: HTMLElement;
	protected totalPrice: HTMLElement;
	protected button: HTMLButtonElement;
	protected cardListView: CardListView;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.cardListView = new CardListView(events);
		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.button.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
	}

	set items(items: IItem[]) {
		this.list.innerHTML = '';
		const cardElements = items.map((item, index) =>
			this.cardListView.createCard(item, index)
		);
		cardElements.forEach((element) => this.list.append(element));
		this.setDisabled(this.button, !items.length);
	}

	set total(value: number) {
		this.setText(this.totalPrice, `${value} синапсов`);
	}
}
