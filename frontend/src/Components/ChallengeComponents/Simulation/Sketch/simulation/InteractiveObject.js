import { Shape } from './Shape';

export class InteractiveObject extends Shape {
	// Classe Collectable concerne tout les "shapes" comme les objets à collecter afin de compléter un niveau par exemple.
	constructor(s, isCoin, isObjectif, isButton, ...points) {
		super(s, ...points);
		this.class = 'InteractiveObject';
		this.isCoin = isCoin;
		this.isObjectif = isObjectif;
		this.isButton = isButton;
		this.linkedId = [];
		this.carInteraction = true;
	}
}