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

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton = ensureElement<HTMLElement>('.modal__close', container);
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

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
		this.locked = true;
		this.container.classList.add('modal_active');
		this.events.emit('modal:opened');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.setHidden(this.container);
		this._content.innerHTML = '';
		this.locked = false;
		this.events.emit('modal:closed');
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	render(): HTMLElement {
		return this.container;
	}
}
