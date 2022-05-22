import { Shape } from "../Shape"
import { Template } from "./typesSimulation";
import { SerializableShape } from './typesSimulation';
import { Vector } from '../Vector';

type TemplateNamesRoad = 'base' | 'path';

export class Road
	extends Shape
	implements SerializableShape<TemplateNamesRoad, Road>
{
	readonly shapeType = 'Road';
	readonly templateName: TemplateNamesRoad;

	minimumSize: number;
	frictionCoef: number;

	// Classe Route concerne tout les "shapes" comme les rues par exemple.
	constructor(s: any, templateName: TemplateNamesRoad, ...points: Vector[]) {
		super(s, ...points);
		this.class = 'Road';
		this.templateName = templateName;
		this.carInteraction = true;
		this.minimumSize = 150;
	}

	override editShape() {
		//Rectangle avec juste le contours
		let image = this.spawnImageBox();

		this.spawnRotateBox(image);
		this.spawnMiddleEditBoxes(image);

		for (let child of image.children) child.setupEditBox();

		image.rotate(this.rotation.x, image.parent.middle);
	}

	override spawnMiddleEditBoxes(image: any) {
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

	get uniqueProperties() {
		return {};
	}

	loadFromTemplate() {
		Object.assign(this, this.templates[this.templateName]);
	}

	readonly defaultTemplate: TemplateNamesRoad = 'base';
	readonly templates: Template<TemplateNamesRoad, Road> = {
		base: {
			frictionCoef: 0.935,
			minimumSize: 150,
		},
		path: {
			frictionCoef: 0.935,
			minimumSize: 75,
		},
	};
}
