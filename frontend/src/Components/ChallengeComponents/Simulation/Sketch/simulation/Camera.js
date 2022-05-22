import { Shape } from './Shape';
import { Vector } from "./Vector";

export class CanvasCamera {
	constructor(x = 0, y = 0) {
		this.pos = new Vector(x, y);
		this.scale = 1000;
		this.w = this.scale;
		this.h = this.scale;
		this.following = false;
		this.wheelScaling = true;
	}

	update() {
		if (this.following && this.target != null) {
			this.setPos(this.target.pos.clone());
		}
	}

	move(pos) {
		pos.add(this.pos);
		this.setPos(pos);
	}

	setPos(pos) {
		if (this.pos_max != null && this.pos_min != null) {
			if (pos.x > this.pos_max.x) {
				pos.x = this.pos_max.x;
			}
			if (pos.y > this.pos_max.y) {
				pos.y = this.pos_max.y;
			}
			if (pos.x < this.pos_min.x) {
				pos.x = this.pos_min.x;
			}
			if (pos.y < this.pos_min.y) {
				pos.y = this.pos_min.y;
			}
		}
		this.pos = pos;
	}

	addScale(scalingFactor) {
		this.setScale(this.scale + scalingFactor);
	}

	setScale(scalingFactor) {
		if (this.scale_min != null && this.scale_max != null) {
			if (scalingFactor > this.scale_max) scalingFactor = this.scale_max;
			if (scalingFactor < this.scale_min) scalingFactor = this.scale_min;
		}
		//limite de la camera
		if (scalingFactor > 6000)
			// 600%
			scalingFactor = 6000;
		if (scalingFactor < 150)
			// 15%
			scalingFactor = 150;
		this.scale = scalingFactor;
		this.w = this.scale;
		this.h = this.scale;
	}

	setTarget(target) {
		if (target == null) {
			this.target = null;
			this.following = false;
			return;
		} else if (target instanceof Shape) this.target = target;
		else if (target.shape != null) this.target = target.shape;
		else return;
		this.following = true;
	}

	stopFollowing() {
		this.following = false;
		if (this.target != null) this.pos.clone();
	}

	removeBound() {
		this.pos_min = null;
		this.pos_max = null;
	}

	setBound(pos_min, pos_max) {
		this.pos_min = pos_min;
		this.pos_max = pos_max;
	}

	enableWheelScaling(bool) {
		this.wheelScaling = bool;
	}

	removeScaleBound() {
		this.scale_min = null;
		this.scale_max = null;
	}

	setScaleBound(scale_min, scale_max) {
		this.scale_min = scale_min;
		this.scale_max = scale_max;
	}
}
