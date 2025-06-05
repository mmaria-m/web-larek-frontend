import { Component } from '../base/components';
import { IEvents } from '../base/events';

export class GalleryView extends Component<HTMLElement> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    } 

    set items(elements: HTMLElement[]) { 
        this.container.innerHTML = ''; 
        elements.forEach((element) => this.container.appendChild(element)); 
    } 
}