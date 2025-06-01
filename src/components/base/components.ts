import { IEvents } from './events';
import { ensureElement } from '../../utils/utils';

export abstract class Component<T> {
	public container: HTMLElement;
	protected constructor(container: HTMLElement) {
		this.container = container;
	}

	toggleClass(element: HTMLElement, classname: string, force?: boolean) {
		element.classList.toggle(classname, force);
	}

	protected setText(element: HTMLElement, value: unknown) {
		element.textContent = String(value);
	}

	setDisabled(element: HTMLElement, state: boolean) {
		element.toggleAttribute('disabled', state); //???????
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.display = ''; ///???????
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		element.src = src;
		element.alt = alt;
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this as object, data ?? {});
		}
		return this.container;
	}
}
