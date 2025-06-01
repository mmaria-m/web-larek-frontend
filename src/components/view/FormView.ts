import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IForm } from '../../types';
import { PaymentMethod } from '../../types';

export class FormView extends Component<IForm> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _isContactsForm: boolean;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		isContactsForm: boolean = false
	) {
		super(container);

		// Инициализация полей в зависимости от типа формы

		this._paymentButtons = isContactsForm
			? []
			: (Array.from(
					container.querySelectorAll('.button_alt')
			  ) as HTMLButtonElement[]);

		this._address = isContactsForm
			? null
			: container.querySelector('.form__input[name="address"]');

		this._email = isContactsForm
			? container.querySelector('.form__input[name="email"]')
			: null;

		this._phone = isContactsForm
			? container.querySelector('.form__input[name="phone"]')
			: null;

		this._submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			container
		);

		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		this._isContactsForm = isContactsForm;

		// Обработчики только для формы заказа
		if (!isContactsForm) {
			this._paymentButtons.forEach((button) => {
				button.addEventListener('click', () => {
					this._paymentButtons.forEach((btn) =>
						btn.classList.remove('button_alt-active')
					);
					button.classList.add('button_alt-active');
					this.events.emit('order:change', this.getFormData());
				});
			});

			if (this._address) {
				this._address.addEventListener('input', () => {
					this.events.emit('order:change', this.getFormData());
				});
			}
		}

		// Обработчики только для формы контактов
		if (isContactsForm) {
			if (this._email) {
				this._email.addEventListener('input', () => {
					this.events.emit('contacts:change', this.getFormData());
				});
			}
			if (this._phone) {
				this._phone.addEventListener('input', () => {
					this.events.emit('contacts:change', this.getFormData());
				});
			}
		}

		this._submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			const eventName = this._isContactsForm
				? 'contacts:submit'
				: 'order:submit';
			this.events.emit(eventName, this.getFormData());
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submitButton, !value);
	}

	set error(value: string) {
		this.setText(this._errors, value);
	}

	private getFormData(): Partial<IForm> {
		const data: Partial<IForm> = {};
		if (!this._isContactsForm) {
			if (this._paymentButtons.length) {
				data.paymentMethod = this._paymentButtons.find((btn) =>
					btn.classList.contains('button_alt-active')
				)?.name as PaymentMethod;
			}
			if (this._address?.value) data.address = this._address.value;
		} else {
			if (this._email?.value) data.email = this._email.value;
			if (this._phone?.value) data.phone = this._phone.value;
		}
		return data;
	}
}
