import { IItem } from '../../types';

export class CardListView {
	constructor(
		private createCardView: (item: IItem, index: number) => HTMLElement
	) {}

	createCard(item: IItem, index: number): HTMLElement {
		return this.createCardView(item, index);
	}
}
