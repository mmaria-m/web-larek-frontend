import { Model } from '../base/model';
import { IBasket, IItem } from '../../types';
import { WebLarekApi } from '../WebLarekApi';
import { EventEmitter } from '../base/events';
import { ProductListModel } from './ProductListModel';

export class BasketModel extends Model<IBasket> {
	protected _items: string[] = [];
	protected _productListModel: ProductListModel;

	constructor(
		data: Partial<IBasket>,
		events: EventEmitter,
		productListModel: ProductListModel
	) {
		super(data, events);
		this._productListModel = productListModel;
	}

	addToBasket(item: IItem) {
		if (!this._items.includes(item.id)) {
			this._items.push(item.id);
			this.emitChanges('basket:changed', this.getBasket());
		}
	}

	removeFromBasket(item: IItem) {
		this._items = this._items.filter((id) => id !== item.id);
		this.emitChanges('basket:changed', this.getBasket());
	}

	clearBasket() {
		this._items = [];
		this.emitChanges('basket:changed', this.getBasket());
	}

	getBasket(): IBasket {
		return {
			items: this._items,
			total: this.calculateTotal(),
		};
	}

	calculateTotal(): number {
		return this._items.reduce((total, id) => {
			const item = this._productListModel.items.find((p) => p.id === id);
			return total + (item?.price ?? 0);
		}, 0);
	}
}
