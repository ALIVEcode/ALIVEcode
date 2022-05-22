import { dist } from "./functions";

export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.calculateLength();
	}

	static translateTo(current, goal, dt, speed = 2) {
		speed *= dt / (1000 / 60);
		if (dist(current, goal) <= speed / 2) return current;
		let vec = current.clone();
		vec.add(goal.clone().substract(current).normalize().multiplyScalar(speed));
		return dist(vec, goal) <= speed / 2 ? goal.clone() : vec;
	}

	translateTo(goal, dt, speed = 2) {
		speed *= dt / (1000 / 60);
		if (dist(this, goal) <= speed / 2) return this;
		let vec = this.clone();
		vec.add(goal.clone().substract(this).normalize().multiplyScalar(speed));
		return dist(vec, goal) <= speed / 2 ? goal.clone() : vec;
	}

	translate(distance, dir) {
		let vect0 = new Vector(distance, 0);
		vect0.rotate(dir, new Vector(0, 0));
		this.add(vect0);
	}

	calculateLength() {
		this.length = Math.sqrt(this.x * this.x + this.y * this.y);
	}

	dist(vector) {
		return Math.sqrt((vector.x - this.x) ** 2 + (vector.y - this.y) ** 2);
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.calculateLength();
		return this;
	}

	substract(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.calculateLength();
		return this;
	}

	multiplyScalar(scalor) {
		this.x *= scalor;
		this.y *= scalor;
		this.calculateLength();
		return this;
	}

	normalize() {
		let variation = 1 / this.length;
		this.length = 1;
		this.x *= variation;
		this.y *= variation;
		return this;
	}

	isNormalized() {
		return this.length === 1;
	}

	isSimilar(vec) {
		return this.x === vec.x && this.y === vec.y;
	}

	clone() {
		return new Vector(this.x, this.y);
	}

	rotate(angle, point) {
		let x = this.x - point.x;
		let y = this.y - point.y;
		this.x = x * Math.cos(angle) - y * Math.sin(angle);
		this.y = y * Math.cos(angle) + x * Math.sin(angle);
		this.x += point.x;
		this.y += point.y;
		this.roundVector(0.001);
	}

	direction(vector) {
		var dy = vector.y - this.y;
		var dx = vector.x - this.x;
		var theta = Math.atan2(dy, dx);
		theta *= 180 / Math.PI;
		if (theta < 0) theta = 360 + theta;
		return theta;
	}

	roundVector(difference = 1) {
		this.x = Math.round(this.x / difference) * difference;
		this.y = Math.round(this.y / difference) * difference;
		return this;
	}
}