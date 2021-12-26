import { dist } from "../functions"
import { Shape, ShapeException } from "../Shape"
import { Vector } from '../Vector';
import { Template } from './typesSimulation';
import { SerializableShape } from './typesSimulation';

type TemplateNamesText = 'base';

export class TextObject
	extends Shape
	implements SerializableShape<TemplateNamesText, TextObject>
{
	readonly shapeType = 'TextObject';
	readonly templateName: TemplateNamesText;

	public text!: string;
	public size!: number;

	static readonly scalar: number = 0.8;
	constructor(
		s: any,
		templateName: TemplateNamesText,
		...points: Vector[] //text: string, //size: number, //x: number, //y: number, //color: string = 'black',
	) {
		super(
			s,
			...points,
			/*
			[
				(x - s.textWidth(text) / 2) * (s.canvasCamera.scale / 1000),
				(y + (s.textAscent() * TextObject.scalar) / 2) *
					(s.canvasCamera.scale / 1000),
			],
			[
				(x + s.textWidth(text) / 2) * (s.canvasCamera.scale / 1000),
				(y + (s.textAscent() * TextObject.scalar) / 2) *
					(s.canvasCamera.scale / 1000),
			],
			[
				(x + s.textWidth(text) / 2) * (s.canvasCamera.scale / 1000),
				(y - (s.textAscent() * TextObject.scalar) / 2) *
					(s.canvasCamera.scale / 1000),
			],
			[
				(x - s.textWidth(text) / 2) * (s.canvasCamera.scale / 1000),
				(y - (s.textAscent() * TextObject.scalar) / 2) *
					(s.canvasCamera.scale / 1000),
			],
			*/
		);
		this.templateName = templateName;
		//x /= s.canvasCamera.scale / 1000;
		//y /= s.canvasCamera.scale / 1000;
		let oldTextSize = s.textSize();
		//s.textSize(size * (1000 / s.canvasCamera.scale));
		if (!this.isRect())
			throw new ShapeException(
				'Can only create a text component of a rectangular shape',
			);
		this.class = 'TextObject';
		s.textSize(oldTextSize);
	}

	private get w(): number {
		return this.s.textWidth(this.text);
	}

	private get h(): number {
		return this.ascent + this.descent;
	}

	private get ascent(): number {
		return this.s.textAscent() * TextObject.scalar;
	}

	private get descent(): number {
		return this.s.textDescent() * TextObject.scalar;
	}

	draw() {
		if (this.pos === undefined) return;
		if (!this.hovering && !this.alwaysStroke) this.s.noStroke();
		else this.s.stroke(this.strokeColor);

		let translateX =
			(this.pos.x - this.camera.pos.x) * (1000 / this.camera.scale);
		let translateY =
			(this.camera.pos.y - this.pos.y) * (1000 / this.camera.scale);
		if (this.img != null) {
			this.s.translate(translateX, translateY);
			this.s.rotate(this.rotation.x);
			this.s.image(
				this.img,
				0,
				0,
				dist(this.vertices[0], this.vertices[1]) * (1000 / this.camera.scale),
				dist(this.vertices[1], this.vertices[2]) * (1000 / this.camera.scale),
			);
			this.s.rotate(-this.rotation.x);
			this.s.translate(-translateX, -translateY);
		}
		// else if (this.backgroundColor != null) {

		//     this.s.fill(this.backgroundColor)
		//     this.s.beginShape()
		//     for (let vertex of this.vertices) {
		//         this.s.vertex((vertex.x - this.camera.pos.x) * (1000 / this.camera.scale), (this.camera.pos.y - vertex.y) * (1000 / this.camera.scale))
		//     }
		//     this.s.endShape(this.s.CLOSE)
		// }
		this.s.fill(this.color);
		this.s.translate(translateX, translateY);
		this.s.rotate(this.rotation.x);
		let oldTextSize = this.s.textSize();
		this.s.textSize(this.size * (1000 / this.s.canvasCamera.scale) - 1);
		this.s.text(this.text, 0, 0);
		this.s.textSize(oldTextSize);
		this.s.rotate(-this.rotation.x);
		this.s.translate(-translateX, -translateY);
	}

	scale(scaleFactor: number, point: Vector | null = null) {
		this.size *= scaleFactor;
		if (this.pos === undefined) return;
		if (point == null) point = this.pos;
		for (let vertex of this.vertices) {
			vertex.x = (vertex.x - point.x) * scaleFactor;
			vertex.y = (vertex.y - point.y) * scaleFactor;
			vertex.x += point.x;
			vertex.y += point.y;
		}
		if (point !== this.pos) {
			this.pos.x = (this.pos?.x - point.x) * scaleFactor;
			this.pos.y = (this.pos?.y - point.y) * scaleFactor;
			this.pos.x += point.x;
			this.pos.y += point.y;
		}
		for (let child of this.children) {
			child.scale(scaleFactor, point);
		}
	}
	/* 
        setBackgroundColor(color) {
            this.backgroundColor = color
        }
     */

	get uniqueProperties() {
		return {
			text: this.text,
			color: this.color,
			size: this.size,
		};
	}

	loadFromTemplate() {
		Object.assign(this, this.templates[this.templateName]);
	}

	readonly defaultTemplate: TemplateNamesText = 'base';
	readonly templates: Template<TemplateNamesText, TextObject> = {
		base: {},
	};
}