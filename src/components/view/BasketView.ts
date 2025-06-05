import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';

export class BasketView extends Component<IBasket> {
	protected list: HTMLElement;
	protected totalPrice: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
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

	set items(elements: HTMLElement[]) {
		this.list.innerHTML = '';
		elements.forEach((element) => this.list.append(element));
		this.setDisabled(this.button, !elements.length);
	}

	set total(value: number) {
		this.setText(this.totalPrice, `${value} синапсов`);
	}
}
