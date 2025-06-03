import { Model } from '../base/model';
import { IItem } from '../../types';
import { WebLarekApi } from '../WebLarekApi';
import { EventEmitter } from '../base/events';

export class ProductListModel extends Model<IItem> {
	protected _productCards: IItem[] = [];

	constructor(data: Partial<IItem>, events: EventEmitter) {
		super(data, events);
	}

	set productCards(data: IItem[]) {
		this._productCards = data;
		this.events.emit('items:receive', { items: this._productCards });
	}

	get productCards(): IItem[] {
		return this._productCards;
	}

	getProduct(id: string): IItem | undefined {
		return this._productCards.find((item) => item.id === id);
	}
}
