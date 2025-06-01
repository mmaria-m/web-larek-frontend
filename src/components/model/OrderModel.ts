import { Model } from '../base/model';
import { IOrder, IForm, PaymentMethod } from '../../types';
import { EventEmitter } from '../base/events';


export class OrderModel extends Model<IOrder> {
    protected _payment: string | undefined;
    protected _address: string | undefined;
    protected _email: string | undefined;
    protected _phone: string | undefined;
    protected _items: string[] = [];
    protected _total: number = 0;

    constructor(data: Partial<IOrder>, events: EventEmitter) {
        super(data, events);
    }

    setOrderData(data: Partial<IForm & { items?: string[]; total?: number }>): void {
        if (data.paymentMethod) this._payment = data.paymentMethod;
        if (data.address) this._address = data.address;
        if (data.email) this._email = data.email;
        if (data.phone) this._phone = data.phone;

        if (data.items) this._items = data.items;
        if (data.total !== undefined) this._total = data.total;
        this.emitChanges('order:changed', this.getOrder());
    }

    getOrder(): IOrder {
        return {
            payment: (this._payment || 'online') as PaymentMethod,
            address: this._address || '',
            email: this._email || '',
            phone: this._phone || '',
            items: this._items,
            total: this._total,
        };
    }

    clearOrder(): void {
        this._payment = undefined;
        this._address = undefined;
        this._email = undefined;
        this._phone = undefined;
        this._items = [];
        this._total = 0;
        this.emitChanges('order:changed', this.getOrder());
    }
}