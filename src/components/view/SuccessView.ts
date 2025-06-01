import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<HTMLElement> {
	private _total: HTMLElement;
	private _closeButton: HTMLButtonElement;
	private _pageWrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._closeButton.addEventListener('click', () => this.close());

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.setHidden(this.container);
		this.locked = false;
		this.events.emit('success:closed');
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
