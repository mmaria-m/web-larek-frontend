import { IEvents } from "../base/events";
import { CardView } from "./CardView";
import { cloneTemplate } from "../../utils/utils";
import { IItem } from "../../types";

export class CardListView {
    constructor(private events: IEvents) {}

    createCard(item: IItem, index: number): HTMLElement {
        const cardElement = cloneTemplate('#card-basket');
        const cardView = new CardView(cardElement, this.events, {
            onClick: () => this.events.emit('basket:remove', item),
        });

        cardView.render({
            ...item,
            title: item.title,
            price: item.price,
            index: index + 1,
        });

        return cardElement;
    }
}