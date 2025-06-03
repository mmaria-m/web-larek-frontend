import { Model } from '../base/model';
import { IBasket, IItem } from '../../types';
import { WebLarekApi } from '../WebLarekApi';
import { EventEmitter } from '../base/events';

export class BasketModel extends Model<IBasket> {
	protected items: IItem[] = [];

	constructor(data: IBasket, events: EventEmitter) {
		super(data, events);
	}

	addToBasket(item: IItem) {
		if (!this.items.find((i) => i.id === item.id)) {
			this.items.push(item);
			this.emitChanges('basket:changed', this.getBasket());
		}
	}

	removeFromBasket(item: IItem) {
		this.items = this.items.filter((i) => i.id !== item.id);
		this.emitChanges('basket:changed', this.getBasket());
	}

	clearBasket() {
		this.items = [];
		this.emitChanges('basket:changed', this.getBasket());
	}

	getBasket(): IBasket {
		return {
			items: this.items.map((item) => item.id),
			total: this.calculateTotal(),
		};
	}

	getItems(): IItem[] {
		return this.items;
	}

	calculateTotal(): number {
		return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
	}
}
