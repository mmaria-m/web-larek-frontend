import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<HTMLElement> {
	private _total: HTMLElement;
	private _closeButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		pageWrapper?: HTMLElement
	) {
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this._closeButton.addEventListener('click', () => this.close());

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	close(): void {
		this.setHidden(this.container);

		this.events.emit('success:closed');
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
