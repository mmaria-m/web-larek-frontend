import { IEvents } from '../base/events';
import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';

interface IModal {
	open(content: HTMLElement): void;
	close(): void;
	render(): HTMLElement;
}

export class ModalView extends Component<IModal> {
	private _closeButton: HTMLElement;
	private _content: HTMLElement;
	private _pageWrapper: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		pageWrapper?: HTMLElement
	) {
		super(container);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this._closeButton = ensureElement<HTMLElement>(
			'.modal__close',
			this.container
		);
		this._pageWrapper = pageWrapper;

		// Закрытие по клику на кнопку
		this._closeButton.addEventListener('click', () => this.close());

		// Закрытие по клику вне контента
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	open(content: HTMLElement): void {
		this._content.innerHTML = '';
		this._content.append(content);
		this.setVisible(this.container);
		this.container.classList.add('modal_active');
		if (this._pageWrapper) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		}
		this.events.emit('modal:opened');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.setHidden(this.container);
		if (this._pageWrapper) {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
		this._content.innerHTML = '';
		this.events.emit('modal:closed');
	}

	render(): HTMLElement {
		return this.container;
	}
}
