import { Model } from '../base/model';
import { IItem } from '../../types';
import { WebLarekApi } from '../WebLarekApi';
import { EventEmitter } from '../base/events';

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

	getProduct(id: string): IItem | undefined {
		return this._items.find((item) => item.id === id);
	}
}
