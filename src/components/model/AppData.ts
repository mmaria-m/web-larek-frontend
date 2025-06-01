import { Model } from '../base/model';
import { IBasket, IItem } from '../../types';
import { WebLarekApi } from '../WebLarekApi';
import { EventEmitter } from '../base/events';

export class BasketModel extends Model<IBasket> {
	protected _items: string[] = [];
	protected _total: number = 0;

	constructor(data: Partial<IBasket>, events: EventEmitter) {
		super(data, events);
	}

	addToBasket(item: IItem) {
		if (!this._items.includes(item.id)) {
			this._items.push(item.id);
			this._total += item.price ?? 0;
			this.emitChanges('basket:changed', {
				items: this._items,
				_total: this._total,
			});
		}
	}

	removeFromBasket(item: IItem) {
		this._items = this._items.filter((id) => id != item.id);
		this._total -= item.price ?? 0;
		this.emitChanges('basket:changed', {
			items: this._items,
			_total: this._total,
		});
	}

	clearBasket() {
		this._items = [];
		this._total = 0;
		this.events.emit('basket:change');
	}

	getBasket(): IBasket {
		return {
			items: this._items,
			total: this._total,
		};
	}
}

export class ProductListModel extends Model<IItem> {
	protected _items: IItem[] = [];

	constructor(data: Partial<IItem>, events: EventEmitter) {
		super(data, events);
	}

	set productCards(data: IItem[]) {
		this._items = data;
		this.events.emit('items:receive', { items: this._items });
	}

	get items(): IItem[] {
		return this._items;
	}

	setProducts(items: IItem[]): void {
		this._items = items;
		this.emitChanges('catalog:changed', { items });
	}
}
