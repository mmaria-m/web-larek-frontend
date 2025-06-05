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
	protected _index?: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._category = this.container.querySelector('.card__category');
		this._image = this.container.querySelector('.card__image');
		this._description = this.container.querySelector('.card__text');
		this._button = this.container.querySelector('.card__button');
		this._index = this.container.querySelector('.basket__item-index');

		if (this.actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', this.actions.onClick);
			} else {
				this.container.addEventListener('click', this.actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
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

	set index(value: string) {
		this._index.textContent = value;
	}
}
