import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IForm, PaymentMethod } from '../../types';

export abstract class FormView extends Component<IForm> {
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	set error(value: string) {
		this.setText(this._errors, value);
	}

	protected getFormData(): Partial<IForm> {
		return {};
	}
}

export class OrderFormView extends FormView {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._paymentButtons = Array.from(
			this.container.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];
		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name="address"]',
			this.container
		);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.events.emit('order.payment:change', {
					payment: button.name as PaymentMethod,
				});
			});
		});

		this._address.addEventListener('input', () => {
			this.events.emit('order.address:change', this.getFormData());
		});

		this._submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.events.emit('order:submit', this.getFormData());
		});
	}

	set paymentMethod(value: PaymentMethod) {
		this._paymentButtons.forEach((btn) => {
			btn.classList.toggle('button_alt-active', btn.name === value);
		});
	}

	set address(value: string) {
		this._address.value = value;
	}

	getFormData(): Partial<IForm> {
		return {
			paymentMethod: this._paymentButtons.find((btn) =>
				btn.classList.contains('button_alt-active')
			)?.name as PaymentMethod,
			address: this._address.value.trim(),
		};
	}
}

export class ContactsFormView extends FormView {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name="email"]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name="phone"]',
			this.container
		);

		this._email.addEventListener('input', () => {
			this.events.emit('contacts.email:change', this.getFormData());
		});

		this._phone.addEventListener('input', () => {
			this.events.emit('contacts.phone:change', this.getFormData());
		});
        
		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	getFormData(): Partial<IForm> {
		return {
			email: this._email.value.trim(),
			phone: this._phone.value.trim(),
		};
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}
}
