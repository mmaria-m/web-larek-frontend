import { Component } from '../base/components';
import { IItem, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

const categoryMapping: Record<string, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
};

export class CardView extends Component<IItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		if (this.actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', this.actions.onClick);
			} else {
				container.addEventListener('click', this.actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this.setDisabled(this._button, value === null);
		}
	}

	set category(value: string) {
		if (this._category) {
			this.setText(this._category, value);
			this._category.className = `card__category card__category_${categoryMapping[value]}`;
		}
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set buttonText(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	render(data?: Partial<IItem>): HTMLElement {
		if (data) {
			if (data.id) this.id = data.id;
			if (data.title) this.title = data.title;
			if (data.price !== undefined) this.price = data.price;
			if (data.category) this.category = data.category;
			if (data.image) this.image = data.image;
			if (data.description) this.description = data.description;
		}
		return this.container;
	}
}
