import { Model } from '../base/model';
import { IOrder, IForm, PaymentMethod } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderModel extends Model<IOrder> {
	protected payment: string | undefined;
	protected address: string | undefined;
	protected email: string | undefined;
	protected phone: string | undefined;

	constructor(data: Partial<IOrder>, events: EventEmitter) {
		super(data, events);
		this.payment = data.payment;
		this.address = data.address;
		this.email = data.email;
		this.phone = data.phone;
	}

	setPayment(value: PaymentMethod) {
		this.payment = value;
		this.emitChanges('order:changed');
	}

	setAddress(value: string) {
		this.address = value.trim();
		this.emitChanges('order:changed');
	}

	setEmail(value: string) {
		this.email = value.trim();
		this.emitChanges('contacts:changed');
	}

	setPhone(value: string) {
		this.phone = value.trim();
		this.emitChanges('contacts:changed');
	}

	getOrder(): Partial<IOrder> {
		return {
			payment: this.payment as PaymentMethod,
			address: this.address || '',
			email: this.email || '',
			phone: this.phone || '',
		};
	}

	clearOrder(): void {
		this.payment = undefined;
		this.address = undefined;
		this.email = undefined;
		this.phone = undefined;
		this.emitChanges('order:changed', this.getOrder());
	}

	isOrderValid(): boolean {
		return !!this.payment && !!this.address;
	}

	isContactsValid(): boolean {
		return !!this.email && !!this.phone;
	}

	isValid(): boolean {
		return !!this.payment && !!this.address && !!this.email && !!this.phone;
	}
}
