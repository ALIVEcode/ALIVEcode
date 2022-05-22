import { Shape } from './Shape';
import { Vector } from "./Vector";
import { dist } from './functions';

export class FixedObject extends Shape {
	constructor(s, ...points) {
		super(s, ...points);
		this.class = 'FixedObject';
		this.isRestricted = false;
		this.isUndo = false;
		this.isRedo = false;
	}

	resize(oldWidth, oldHeight) {
		this.setPos(
			new Vector(
				this.pos.x * (this.s.width / oldWidth),
				this.pos.y * (this.s.height / oldHeight),
			),
			false,
		);
		if (this.s.height < this.s.width) {
			this.scale(this.s.height / oldHeight);
		} else if (this.s.height > this.s.width) {
			this.scale(this.s.width / oldWidth);
		} else {
			if (oldHeight < oldWidth) {
				this.scale(this.s.height / oldHeight);
			} else {
				this.scale(this.s.width / oldWidth);
			}
		}
	}

	draw() {
		if (!this.hovering && !this.alwaysStroke) this.s.noStroke();
		else this.s.stroke(this.strokeColor);
		this.s.fill(this.color);
		this.s.beginShape();
		for (let vertex of this.vertices) {
			this.s.vertex(vertex.x, -vertex.y);
		}

		this.s.endShape(this.s.CLOSE);
		if (this.img != null) {
			let translateX = this.pos.x;
			let translateY = -this.pos.y;
			this.s.translate(translateX, translateY);
			this.s.rotate(this.rotation.x);
			this.s.image(
				this.img,
				0,
				0,
				dist(this.vertices[0], this.vertices[1]),
				dist(this.vertices[1], this.vertices[2]),
			);
			this.s.rotate(-this.rotation.x);
			this.s.translate(-translateX, -translateY);
		}
	}
}