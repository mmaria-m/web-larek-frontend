import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { CardView } from './CardView';
import { IItem } from '../../types';

export class GalleryView extends Component<HTMLElement> {
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._container = container;
    }

    set items(items: IItem[]) {
        this._container.innerHTML = '';
        items.forEach((item) => {
            const cardElement = cloneTemplate('#card-catalog');
            const card = new CardView(cardElement, this.events, {
                onClick: () => this.events.emit('card:select', item),
            });
            card.render(item);
            this._container.append(cardElement);
        });
    }
}