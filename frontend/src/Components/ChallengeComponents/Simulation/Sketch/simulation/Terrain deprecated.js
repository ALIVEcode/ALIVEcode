import { Shape } from "./Shape";

export class Terrain extends Shape {
	// Classe Terrain concerne tout les "shapes" comme le gazon par exemple.
	constructor(s, frictionCoef, ...points) {
		super(s, ...points);
		this.class = 'Terrain';
		this.frictionCoef = frictionCoef;
		this.carInteraction = true;
	}
}