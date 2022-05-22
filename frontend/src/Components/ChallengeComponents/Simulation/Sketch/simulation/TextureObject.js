import { Shape } from "./Shape";

export class TextureObject extends Shape {
	constructor(s, img, res = 1, ...points) {
		super(s, ...points);
		this.class = 'TextureObject';
		this.img = img;
		this.res = res;
	}

	draw() {
		// Maintenant ceci fait partie de shape
		if (!this.hovering && !this.alwaysStroke) this.s.noStroke();
		else this.s.stroke(this.strokeColor);

		this.s.imageMode(this.s.CORNERS);
		let nbX = Math.ceil(this.getWidth() / (this.img.width * this.res));
		let nbY = Math.ceil(this.getHeight() / (this.img.height * this.res));
		for (let i = 0; i < nbX; i++) {
			let translateX =
				(this.pos.x + i * this.img.width * this.res - this.camera.pos.x) *
					(1000 / this.camera.scale) -
				(this.getWidth() * (1000 / this.camera.scale)) / 2;
			let w =
				(i === nbX - 1
					? this.getWidth() - this.img.width * this.res * i
					: this.img.width * this.res) *
				(1000 / this.camera.scale);
			let wOfImage =
				i === nbX - 1
					? this.getWidth() - this.img.width * this.res * i
					: this.img.width * this.res;
			for (let j = 0; j < nbY; j++) {
				let translateY =
					(this.camera.pos.y - this.pos.y + j * this.img.height * this.res) *
						(1000 / this.camera.scale) -
					(this.getHeight() * (1000 / this.camera.scale)) / 2;
				this.s.translate(translateX, translateY);
				this.s.rotate(this.rotation.x);
				let h =
					(j === nbY - 1
						? this.getHeight() - this.img.height * this.res * j
						: this.img.height * this.res) *
					(1000 / this.camera.scale);
				let hOfImage =
					j === nbY - 1
						? this.getHeight() - this.img.height * this.res * j
						: this.img.height * this.res;
				this.s.image(
					this.img,
					0,
					0,
					w,
					h,
					0,
					0,
					wOfImage / this.res,
					hOfImage / this.res,
				);
				this.s.rotate(-this.rotation.x);
				this.s.translate(-translateX, -translateY);
			}
		}
		this.s.imageMode(this.s.CENTER);
		/*
            this.s.beginShape()
            for(let vertex of this.vertices) {
                this.s.vertex((vertex.x - this.camera.pos.x) * (1000 / this.camera.scale), (this.camera.pos.y - vertex.y) * (1000 / this.camera.scale))
            }
            this.s.endShape(this.s.CLOSE)*/
	}

	scale(scaleFactor, point = null) {
		if (point == null) point = this.pos;
		for (let vertex of this.vertices) {
			vertex.x = (vertex.x - point.x) * scaleFactor;
			vertex.y = (vertex.y - point.y) * scaleFactor;
			vertex.x += point.x;
			vertex.y += point.y;
		}
		if (point !== this.pos) {
			this.pos.x = (this.pos.x - point.x) * scaleFactor;
			this.pos.y = (this.pos.y - point.y) * scaleFactor;
			this.pos.x += point.x;
			this.pos.y += point.y;
		}
		for (let child of this.children) {
			child.scale(scaleFactor, point);
		}
	}
}