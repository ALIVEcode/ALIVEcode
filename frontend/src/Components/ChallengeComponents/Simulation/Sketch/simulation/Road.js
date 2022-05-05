import { Shape } from './Shape';

export class Road extends Shape {
	// Classe Route concerne tout les "shapes" comme les rues par exemple.
	constructor(s, minimumSize, ...points) {
		super(s, ...points);
		this.class = 'Road';
		this.frictionCoef = 0.935;
		this.minimumSize = minimumSize;
		this.carInteraction = true;
	}

	editShape() {
		//Rectangle avec juste le contours
		let image = this.spawnImageBox();

		this.spawnRotateBox(image);
		this.spawnMiddleEditBoxes(image);

		for (let child of image.children) child.setupEditBox();

		image.rotate(this.rotation.x, image.parent.middle);
	}

	spawnMiddleEditBoxes(image) {
		if (!(Math.round(this.getHeight()) > this.minimumSize)) {
			// Middle left
			let editMiddleLeft = this.s.spawnRect(
				-image.getWidth() / 2,
				0,
				this.s.editBoxSize,
				this.s.editBoxSize,
				350,
			);
			editMiddleLeft.cursor = 'w-resize';
			image.addChild(editMiddleLeft, true);

			// Middle right
			let editMiddleRight = this.s.spawnRect(
				image.getWidth() / 2,
				0,
				this.s.editBoxSize,
				this.s.editBoxSize,
				350,
			);
			editMiddleRight.cursor = 'e-resize';
			image.addChild(editMiddleRight, true);
		}
		if (!(Math.round(this.getWidth()) > this.minimumSize)) {
			// Middle Top
			let editMiddleTop = this.s.spawnRect(
				0,
				image.getHeight() / 2,
				this.s.editBoxSize,
				this.s.editBoxSize,
				350,
			);
			editMiddleTop.cursor = 'n-resize';
			image.addChild(editMiddleTop, true);

			// Middle Bottom
			let editMiddleBottom = this.s.spawnRect(
				0,
				-image.getHeight() / 2,
				this.s.editBoxSize,
				this.s.editBoxSize,
				350,
			);
			editMiddleBottom.cursor = 's-resize';
			image.addChild(editMiddleBottom, true);
		}
	}
}
