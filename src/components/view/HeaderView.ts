import { Component } from "../base/components";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class HeaderView extends Component<HTMLElement> {
    protected basketButton: HTMLButtonElement;
    protected counter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        
        this.basketButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counterValue(value: number) {
        this.counter.textContent = value.toString();
    }
}