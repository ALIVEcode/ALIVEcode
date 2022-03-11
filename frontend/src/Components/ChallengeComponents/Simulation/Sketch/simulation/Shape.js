import { Vector } from './Vector';
import { dist } from './functions';


export class Shape {
	constructor(s, ...points) {
		this.s = s;
		this.id = s.id;
		s.id++;
		this.imgName = '';
		this.class = 'Shape';
		this.rotation = new Vector(0, 0);
		this.zIndex = 0;
		this.camera = s.canvasCamera;
		this.vertices = [];
		this.strokeColor = 'white';
		this.alwaysStroke = false;
		this.color = 'red';
		this.soundOnCollision = null;
		this.hovering = false;
		this.minimumSize = 20;
		if (this.s.isMobile) this.minimumSize = 40;
		this.movable = false;
		this.pinned = false;
		this.isHelp = false;
		this.isEditBox = false;
		this.isRotateBox = false;
		this.scaleWithCamera = false;
		this.hasTexture = false;
		this.carInteraction = false;
		this.colliding = [];
		this.children = [];
		this.bounds = [];
		this.res = null;
		for (const point of points) {
			this.vertices.push(new Vector(point[0], point[1]));
		}
		this.calculateCenterPos();
		this.calculateForward();
		this.setBounds();
		this.rememberBounds();
	}

	setBounds() {
		this.middle = new Vector(
			(this.calcLeftX() + this.calcRightX()) / 2,
			(this.calcTopY() + this.calcBottomY()) / 2,
		);
		this.left = new Vector(this.calcLeftX(), this.middle.y);
		this.top = new Vector(this.middle.x, this.calcTopY());
		this.right = new Vector(this.calcRightX(), this.middle.y);
		this.bottom = new Vector(this.middle.x, this.calcBottomY());

		this.bounds.push(this.left);
		this.bounds.push(this.top);
		this.bounds.push(this.right);
		this.bounds.push(this.bottom);
		this.bounds.push(this.middle);
	}

	calculateForward() {
		if (this.forward == null) this.forward = new Vector(0, 0);
		if (this.vertices.length <= 1) return;
		this.forward.x =
			this.vertices[0].x + (this.vertices[1].x - this.vertices[0].x) / 2;
		this.forward.y =
			this.vertices[0].y + (this.vertices[1].y - this.vertices[0].y) / 2;
		this.forward.substract(this.pos);
	}

	setImg([imgName, img]) {
		//if (!this.isRect()) throw new ShapeException('Cannot apply an image to a shape that is not a rectangle')
		this.img = img;
		this.imgName = imgName;
		//console.log(img);
		// TODO: images saving
		/*for (const [imgName, img] of Object.entries(this.s.dictImages)) {
			if (img === this.img) {
				this.imgName = imgName
				break
			}
		}*/
	}

	setTexture([imgName, img], res = 1) {
		//if (!this.isRect()) throw new ShapeException('Cannot apply an image to a shape that is not a rectangle')
		this.img = img;
		this.imgName = imgName;

		// TODO : redo image saving
		/*for (const [imgName, img] of Object.entries(this.s.dictImages)) {
			if (img === this.img) {
				this.imgName = imgName;
				break;
			}
		}*/

		this.res = res;
		this.hasTexture = true;
	}

	setSoundOnCollision(sound) {
		this.soundOnCollision = sound;

		// TODO : redo sound saving
		/*
		for (const [soundName, sound] of Object.entries(this.s.dictAudios)) {
			if (sound === this.soundOnCollision) {
				this.soundOnCollisionName = soundName;
				break;
			}
		}*/
	}

	calculateCenterPos() {
		if (this.vertices.length === 0) return;
		let totalX = 0;
		let totalY = 0;
		for (let i = 0; i < this.vertices.length; i++) {
			let edge1 = this.vertices[i];
			let edge2 = this.vertices[(i + 1) % this.vertices.length];

			let maxX = Math.max(edge1.x, edge2.x);
			let minX = Math.min(edge1.x, edge2.x);

			let maxY = Math.max(edge1.y, edge2.y);
			let minY = Math.min(edge1.y, edge2.y);

			let edgeX = minX + (maxX - minX) / 2;
			let edgeY = minY + (maxY - minY) / 2;
			totalX += edgeX;
			totalY += edgeY;
		}
		this.pos = new Vector(
			totalX / this.vertices.length,
			totalY / this.vertices.length,
		);
	}

	cloneShape() {
		let points = [];
		for (let vector of this.vertices) {
			let point = vector.clone();
			let angle = (this.rotation.x * this.s.PI) / 180;
			point.rotate(angle, this.pos);
			points.push([point.x, point.y]);
		}

		let cloned;

		if (this instanceof Obstacle)
			cloned = new Obstacle(this.s, this.templateName, ...points);
		else if (this instanceof Road)
			cloned = new Road(this.s, this.templateName, ...points);
		else if (this instanceof Terrain)
			cloned = new Terrain(this.s, this.templateName, ...points);
		else if (this instanceof Interactive)
			cloned = new Interactive(
				this.s,
				this.isCollectable
					? 'collectable'
					: this.isObjectif
					? 'objective'
					: this.isButton
					? 'button'
					: 'spring',
				...points,
			);
		else cloned = new Shape(this.s, ...points);

		cloned.zIndex = this.zIndex;

		cloned.rotate(this.rotation.x);
		return cloned;
	}

	draw() {
		if (!this.hovering && !this.alwaysStroke) this.s.noStroke();
		else this.s.stroke(this.strokeColor);
		this.s.fill(this.color);

		if (this.hasTexture) {
			this.s.imageMode(this.s.CORNERS);
			let nbX = Math.ceil(this.getWidth() / (this.img.width * this.res)); //Nomble de colonnes
			let nbY = Math.ceil(this.getHeight() / (this.img.height * this.res)); //Nombre de lignes
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

					let translation = new Vector(translateX, -translateY);
					let angle = (-this.rotation.x * this.s.PI) / 180;
					translation.rotate(
						angle,
						new Vector(
							(this.pos.x - this.camera.pos.x) * (1000 / this.camera.scale),
							(this.pos.y - this.camera.pos.y) * (1000 / this.camera.scale),
						),
					);

					this.s.translate(translation.x, -translation.y);
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
						w + 0.5,
						h + 0.5,
						0,
						0,
						wOfImage / this.res,
						hOfImage / this.res,
					);
					this.s.rotate(-this.rotation.x);
					this.s.translate(-translation.x, translation.y);
				}
			}
			this.s.imageMode(this.s.CENTER);
		} else if (this.img != null) {
			let translateX =
				(this.pos.x - this.camera.pos.x) * (1000 / this.camera.scale);
			let translateY =
				(this.camera.pos.y - this.pos.y) * (1000 / this.camera.scale);
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
		} else {
			this.s.beginShape();
			if (this.scaleWithCamera) {
				if (
					(this.oldWidth / (1000 / this.camera.scale)).toFixed(3) !==
					this.getWidth().toFixed(3)
				) {
					this.scale(
						this.oldWidth / this.getWidth() / (1000 / this.camera.scale),
					);
					if (this.isRotateBox) this.setRotateBoxPos(this.parent);
				}
			}
			for (let vertex of this.vertices) {
				this.s.vertex(
					(vertex.x - this.camera.pos.x) * (1000 / this.camera.scale),
					(this.camera.pos.y - vertex.y) * (1000 / this.camera.scale),
				);
			}
			this.s.endShape(this.s.CLOSE);
		}
	}

	addChild(obj, setRelativePos = false) {
		if (!(obj in this.children)) {
			this.children.push(obj);
			obj.parent = this;
			if (setRelativePos) {
				obj.move(this.middle, false);
			}
		}
	}

	removeChild(obj) {
		if (obj in this.children) {
			this.children = this.children.filter(el => el !== obj);
			obj.parent = null;
		}
	}

	hasParent() {
		return this.parent != null;
	}

	removeAllChildren() {
		for (let child of this.children) this.s.deleteShape(child, true);
		this.children = [];
	}

	rotate(angle, point) {
		if (point === undefined) point = this.pos;
		this.rotation.x = (this.rotation.x + angle) % 360;
		if (this.rotation.x < 0) this.rotation.x += 360;
		let newAngle = 360 - angle;
		newAngle *= this.s.PI / 180;
		for (let vertex of this.vertices) {
			vertex.rotate(newAngle, point);
		}
		for (let bound of this.bounds) {
			bound.rotate(newAngle, point);
		}
		if (point !== this.pos) {
			this.pos.rotate(newAngle, point);
		}
		if (this.forward != null) {
			this.calculateForward();
		}
		for (let child of this.children) {
			child.rotate(angle, point);
		}
	}

	setRotation(angle, point = null) {
		if (point == null) point = this.pos;
		let increase = angle - this.rotation.x;
		if (increase !== 0) {
			this.rotate(increase, point);
		}
	}

	getOrientationVector() {
		const angle =
			this.rotation.x > 270
				? this.rotation.x - 90
				: (360 - (this.rotation.x - 90)) % 360;
		const angleRad = (Math.PI * angle) / 180;
		const x = Math.cos(angleRad);
		const y = Math.sin(angleRad);
		return new Vector(x, y);
	}

	move(dir, deltaTime = false) {
		let newDir = dir.clone();
		if (deltaTime && this.s.pdt !== 0) {
			//const timeScaleFactor = (Date.now() - this.s.pdt) / (1000 / this.s.maxFPS)
			const timeScaleFactor = this.s.maxFPS / this.s.frameRate();
			newDir.multiplyScalar(timeScaleFactor);
			/*if(timeScaleFactor > 1) {
                newDir.multiplyScalar(0.8) // Sinon la vitesse est toujours un peu trop haute avec fps plus bas
            }*/
		}
		this.pos.add(newDir);
		for (const vertex of this.vertices) {
			vertex.add(newDir);
		}
		for (const bound of this.bounds) {
			bound.add(newDir);
		}
		for (const child of this.children) {
			child.move(dir, deltaTime);
		}
	}

	moveInDirection(dir, dist = 1, deltaTime = false) {
		if (dir == null) return;
		dir = dir.clone();
		if (!dir.isNormalized()) dir.normalize();
		this.move(dir.multiplyScalar(dist), deltaTime);
	}

	moveTowards(vertex, dist = 1) {
		vertex.substract(this.pos);
		if (!vertex.isNormalized()) vertex.normalize();
		this.move(new Vector(vertex.x * dist, vertex.y * dist));
	}

	setPos(pos, deltaTime = false) {
		let newPos = pos.clone();
		newPos.substract(this.pos);
		if (deltaTime && this.s.pdt !== 0)
			newPos.multiplyScalar(
				1 / ((Date.now() - this.s.pdt) / (1000 / this.s.maxFPS) || 1),
			);
		this.move(newPos, deltaTime);
	}

	scale(scaleFactor, point = null) {
		if (point == null) point = this.pos;
		for (let vertex of this.vertices) {
			vertex.x = (vertex.x - point.x) * scaleFactor;
			vertex.y = (vertex.y - point.y) * scaleFactor;
			vertex.x += point.x;
			vertex.y += point.y;
		}
		for (let bound of this.bounds) {
			bound.x = (bound.x - point.x) * scaleFactor;
			bound.y = (bound.y - point.y) * scaleFactor;
			bound.x += point.x;
			bound.y += point.y;
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

	setZIndex(newZIndex) {
		// Retrait de l'élément
		let shapesByZIndex = this.s.shapes[this.zIndex];
		shapesByZIndex = shapesByZIndex.filter(el => el !== this);
		this.s.shapes[this.zIndex] = shapesByZIndex;

		// Ajout de l'élément
		if (newZIndex in this.s.shapes) {
			this.s.shapes[newZIndex].push(this);
		} else {
			this.s.shapes[newZIndex] = [this];
		}
		this.zIndex = newZIndex;
	}

	// ATTENTION PLEINS DE FONCTIONS CHIANTES POUR LES SYSTÈME D'EVENT

	hasEventListener(eventFct) {
		return typeof eventFct == 'function';
	}

	hoverExit() {
		this.hovering = false;
		this.hoverExitFct();
	}

	hoverExitFct() {}

	onHoverExit(fct) {
		this.hoverExitFct = fct;
	}

	hover(e) {
		this.hovering = true;
		this.hoverFct();
	}

	hoverFct() {}

	onHover(fct) {
		this.hoverFct = fct;
	}

	scroll(e) {
		if (this.hasEventListener(this.scrollFct)) {
			this.scrollFct(e);
		}
	}

	onScroll(fct) {
		this.scrollFct = fct;
	}

	clickDownFct() {}

	clickDown() {
		this.clickDownFct();
	}

	onClickDown(fct) {
		this.clickDownFct = fct;
	}

	pressedFct() {}

	pressed() {
		this.pressedFct();
	}

	onPressed(fct) {
		this.pressedFct = fct;
	}

	clickFct() {}

	click() {
		this.clickFct();
	}

	onClick(fct) {
		this.clickFct = fct;
	}

	rightClick() {}

	collisionEnter(e) {
		this.colliding.push(e.collidingWith);
		this.collisionEnterFct(e);
	}

	collisionEnterFct(e) {}

	onCollisionEnter(fct) {
		this.collisionEnterFct = fct;
	}

	collisionExit(e) {
		this.colliding = this.colliding.filter(el => el !== e.collidingWith);
		this.collisionExitFct(e);
	}

	collisionExitFct(e) {}

	onCollisionExit(fct) {
		this.collisionExitFct = fct;
	}

	collision(e) {
		if (!this.colliding.includes(e.collidingWith)) this.collisionEnter(e);
		this.collisionFct(e);
	}

	collisionFct(e) {}

	onCollision(fct) {
		this.collisionFct = fct;
	}

	isRect() {
		if (this.vertices.length !== 4) return false;
		let p1 = this.vertices[0];
		let p2 = this.vertices[1];
		let p3 = this.vertices[2];
		let p4 = this.vertices[3];

		let d1 = dist(p1, this.pos);
		let d2 = dist(p2, this.pos);
		let d3 = dist(p3, this.pos);
		let d4 = dist(p4, this.pos);

		return (
			d1.toFixed(1) === d2.toFixed(1) &&
			d2.toFixed(1) === d3.toFixed(1) &&
			d3.toFixed(1) === d4.toFixed(1)
		);
	}

	isParallelogram() {
		if (this.vertices.length !== 4) return false;
		let p1 = this.vertices[0];
		let p2 = this.vertices[1];
		let p3 = this.vertices[2];
		let p4 = this.vertices[3];

		let m1 = (p2.y - p1.y) / (p2.x - p1.x === 0 ? 0.0000001 : p2.x - p1.x);
		let m2 = (p3.y - p2.y) / (p3.x - p2.x === 0 ? 0.0000001 : p3.x - p2.x);
		let m3 = -(p4.y - p3.y) / (p4.x - p3.x === 0 ? 0.0000001 : p4.x - p3.x);
		let m4 = -(p1.y - p4.y) / (p1.x - p4.x === 0 ? 0.0000001 : p1.x - p4.x);

		return m1 === m3 && m2 === m4;
	}

	calcTopY() {
		let topY = this.vertices[0].y;
		for (let vertex of this.vertices) {
			if (vertex.y > topY) topY = vertex.y;
		}
		return topY;
	}

	calcBottomY() {
		let bottomY = this.vertices[0].y;
		for (let vertex of this.vertices) {
			if (vertex.y < bottomY) bottomY = vertex.y;
		}
		return bottomY;
	}

	calcLeftX() {
		let leftX = this.vertices[0].x;
		for (let vertex of this.vertices) {
			if (vertex.x < leftX) leftX = vertex.x;
		}
		return leftX;
	}

	calcRightX() {
		let rightX = this.vertices[0].x;
		for (let vertex of this.vertices) {
			if (vertex.x > rightX) rightX = vertex.x;
		}
		return rightX;
	}

	getWidth() {
		return this.right.dist(this.left);
	}

	getHeight() {
		return this.top.dist(this.bottom);
	}

	getWidthInMeters() {
		return this.s.convertPixelsToMeters(this.getWidth());
	}

	getHeightInMeters() {
		return this.s.convertPixelsToMeters(this.getHeight());
	}

	// L'image qui apparait sur une forme (afin de edit)
	editShape(onlyRotation = false) {
		let image = this.spawnImageBox();

		this.spawnRotateBox(image);

		if (!onlyRotation) {
			// Spawn des 8 carrés (pour la direction)
			this.spawnMiddleEditBoxes(image);
			this.spawnCornerEditBoxes(image);
		}

		for (let child of image.children) child.setupEditBox(onlyRotation);

		image.rotate(this.rotation.x, image.parent.middle);
	}

	spawnImageBox() {
		//Rectangle avec juste le contours
		let image = this.s.spawnRect(
			0,
			0,
			this.getWidth(),
			this.getHeight(),
			this.zIndex,
		);
		this.addChild(image, true);

		image.alwaysStroke = true;
		image.isHelp = true;
		image.strokeColor = this.s.color(0, 150, 255);
		image.color = this.s.color(0, 0);

		image.onClickDown(() => {
			if (this.hovering) {
				this.s.pressedObject = this;
			}
		});

		return image;
	}

	spawnRotateBox(image) {
		// Carre pour la rotation
		let rotation = this.s.spawnRect(
			-image.getWidth() / 2 - this.s.editBoxSize / (1000 / this.camera.scale),
			image.getHeight() / 2 + this.s.editBoxSize / (1000 / this.camera.scale),
			this.s.editBoxSize,
			this.s.editBoxSize,
			350,
		);
		rotation.cursor = 'ne-resize';
		rotation.isRotateBox = true;
		image.addChild(rotation, true);
	}

	spawnMiddleEditBoxes(image) {
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

	spawnCornerEditBoxes(image) {
		// Top left
		let editTopLeft = this.s.spawnRect(
			-image.getWidth() / 2,
			image.getHeight() / 2,
			this.s.editBoxSize,
			this.s.editBoxSize,
			350,
		);
		editTopLeft.cursor = 'nw-resize';
		image.addChild(editTopLeft, true);

		// Top right
		let editTopRight = this.s.spawnRect(
			image.getWidth() / 2,
			image.getHeight() / 2,
			this.s.editBoxSize,
			this.s.editBoxSize,
			350,
		);
		editTopRight.cursor = 'ne-resize';
		image.addChild(editTopRight, true);

		// Bottom right
		let editBottomRight = this.s.spawnRect(
			image.getWidth() / 2,
			-image.getHeight() / 2,
			this.s.editBoxSize,
			this.s.editBoxSize,
			350,
		);
		editBottomRight.cursor = 'se-resize';
		image.addChild(editBottomRight, true);

		// Bottom left
		let editBottomLeft = this.s.spawnRect(
			-image.getWidth() / 2,
			-image.getHeight() / 2,
			this.s.editBoxSize,
			this.s.editBoxSize,
			350,
		);
		editBottomLeft.cursor = 'sw-resize';
		image.addChild(editBottomLeft, true);
	}

	setupEditBox(onlyRotation = false) {
		this.alwaysStroke = true;
		this.isHelp = true;
		this.isEditBox = true;
		this.scaleWithCamera = true;
		this.strokeColor = this.s.color(0, 150, 255);
		this.color = 'white';
		this.leftEdgeClickDown = false;
		this.upEdgeClickDown = false;
		this.rightEdgeClickDown = false;
		this.bottomEdgeClickDown = false;

		let shapeModifier = this.parent.parent;
		let image = this.parent;

		if (!this.isRotateBox) {
			if (this.left.x < image.left.x) this.leftEdgeClickDown = true;
			if (this.right.x > image.right.x) this.rightEdgeClickDown = true;
			if (this.top.y > image.top.y) this.upEdgeClickDown = true;
			if (this.bottom.y < image.bottom.y) this.bottomEdgeClickDown = true;
		}

		this.onHover(() => {
			this.s.fullscreenDiv.css('cursor', this.cursor);
		});

		this.onClick(() => {
			shapeModifier.removeAllChildren();
			shapeModifier.editShape(onlyRotation);
		});

		this.onHoverExit(() => {
			this.s.fullscreenDiv.css('cursor', 'default');
		});
	}

	rotateFromRotateBox() {
		let shapeModifier = this.parent.parent;
		let startingAngle = shapeModifier.pos.direction(this.pos);
		let newAngle = shapeModifier.pos.direction(this.s.mouse);
		let angleDifference = Math.round(startingAngle - newAngle);
		shapeModifier.rotate(angleDifference);
		return angleDifference;
	}

	rememberBounds() {
		this.oldLeft = this.left.clone();
		this.oldTop = this.top.clone();
		this.oldRight = this.right.clone();
		this.oldBottom = this.bottom.clone();
		this.oldMiddle = this.middle.clone();
		this.oldWidth = this.getWidth();
		this.oldHeight = this.getHeight();
	}

	adjacentDist(angle, hypothenuse) {
		angle *= this.s.PI / 180;
		return hypothenuse * Math.sin(angle);
	}

	adjacentDistImage(angle, hypothenuse) {
		if (angle < 0) angle = 360 + angle;
		let part = Math.floor(angle / 90);
		if (part % 2 === 0) angle = angle % 90;
		else angle = 90 - (angle % 90);
		let dist = this.adjacentDist(angle, hypothenuse);
		if (part > 1) dist = 0 - dist;

		return dist;
	}

	modifySize() {
		let shapeModifier = this.parent.parent;
		let imageShape = this.parent;

		imageShape.rememberBounds();

		this.s.mouse.roundVector(10);

		// Resize le carre image
		if (this.leftEdgeClickDown) {
			let distMouse = imageShape.left.dist(this.s.mouse.clone());
			let angle =
				imageShape.left.direction(this.s.mouse) -
				imageShape.right.direction(imageShape.vertices[1]);
			let dist = this.adjacentDistImage(angle, distMouse);

			if (imageShape.getWidth() + dist < shapeModifier.minimumSize)
				dist = 0 - (imageShape.getWidth() - shapeModifier.minimumSize);

			let dir = imageShape.right.direction(imageShape.left);
			dir *= this.s.PI / 180;

			imageShape.vertices[0].translate(dist, dir);
			imageShape.vertices[3].translate(dist, dir);
			imageShape.left.translate(dist, dir);

			imageShape.middle.translate(dist / 2, dir);
			imageShape.top.translate(dist / 2, dir);
			imageShape.bottom.translate(dist / 2, dir);
		}
		if (this.upEdgeClickDown) {
			let distMouse = imageShape.top.dist(this.s.mouse.clone());
			let angle =
				imageShape.top.direction(this.s.mouse) -
				imageShape.bottom.direction(imageShape.vertices[2]);
			let dist = this.adjacentDistImage(angle, distMouse);

			if (imageShape.getHeight() + dist < shapeModifier.minimumSize)
				dist = 0 - (imageShape.getHeight() - shapeModifier.minimumSize);

			let dir = imageShape.bottom.direction(imageShape.top);
			dir *= this.s.PI / 180;

			imageShape.vertices[0].translate(dist, dir);
			imageShape.vertices[1].translate(dist, dir);
			imageShape.top.translate(dist, dir);

			imageShape.middle.translate(dist / 2, dir);
			imageShape.left.translate(dist / 2, dir);
			imageShape.right.translate(dist / 2, dir);
		}
		if (this.rightEdgeClickDown) {
			let distMouse = imageShape.right.dist(this.s.mouse.clone());
			let angle =
				imageShape.right.direction(this.s.mouse) -
				imageShape.left.direction(imageShape.vertices[3]);
			let dist = this.adjacentDistImage(angle, distMouse);

			if (imageShape.getWidth() + dist < shapeModifier.minimumSize)
				dist = 0 - (imageShape.getWidth() - shapeModifier.minimumSize);

			let dir = imageShape.left.direction(imageShape.right);
			dir *= this.s.PI / 180;

			imageShape.vertices[1].translate(dist, dir);
			imageShape.vertices[2].translate(dist, dir);
			imageShape.right.translate(dist, dir);

			imageShape.middle.translate(dist / 2, dir);
			imageShape.top.translate(dist / 2, dir);
			imageShape.bottom.translate(dist / 2, dir);
		}
		if (this.bottomEdgeClickDown) {
			let distMouse = imageShape.bottom.dist(this.s.mouse.clone());
			let angle =
				imageShape.bottom.direction(this.s.mouse) -
				imageShape.top.direction(imageShape.vertices[0]);
			let dist = this.adjacentDistImage(angle, distMouse);

			if (imageShape.getHeight() + dist < shapeModifier.minimumSize)
				dist = 0 - (imageShape.getHeight() - shapeModifier.minimumSize);

			let dir = imageShape.top.direction(imageShape.bottom);
			dir *= this.s.PI / 180;

			imageShape.vertices[2].translate(dist, dir);
			imageShape.vertices[3].translate(dist, dir);
			imageShape.bottom.translate(dist, dir);

			imageShape.middle.translate(dist / 2, dir);
			imageShape.right.translate(dist / 2, dir);
			imageShape.left.translate(dist / 2, dir);
		}

		for (let child of imageShape.children) {
			if (child.isRotateBox) child.setRotateBoxPos(imageShape);
			else {
				// Mettre chaque editBox(petit carre blanc) a la bonne place
				let newPos = child.pos.clone();
				imageShape.resizeVectorToImage(newPos, imageShape);

				child.setPos(newPos, false);
			}
		}

		//Finalement resize la forme
		shapeModifier.resizeShape(imageShape);

		/*let ratio = imageShape.getWidth() / shapeModifier.oldWidth

        let rad = shapeModifier.rotation.x * Math.PI / 180
        let ratioX = Math.cos(rad) * ratio
        let ratioY = Math.sin(rad) * ratio

        let topLeft = shapeModifier.vertices[0]
        for(let vertex of shapeModifier.vertices) {
            vertex.x += (vertex.x - topLeft.x) * ratioX - (vertex.x - topLeft.x)
            //vertex.y = -(vertex.y - topLeft.y) * ratioY + (vertex.y - topLeft.y)
        }
        for(let vertex of shapeModifier.bounds) {
            vertex.x += (vertex.x - topLeft.x) * ratioX - (vertex.x - topLeft.x)
            //vertex.y = -(vertex.y - topLeft.y) * ratioY + (vertex.y - topLeft.y)
        }*/
	}

	setRotateBoxPos(image) {
		let newPos = new Vector(
			image.vertices[0].x - this.s.editBoxSize / (1000 / this.camera.scale),
			image.vertices[0].y + this.s.editBoxSize / (800 / this.camera.scale),
		);
		let dist = image.vertices[0].dist(newPos);
		let dir = 135 - this.rotation.x;
		dir *= this.s.PI / 180;
		let clone = image.vertices[0].clone();
		clone.translate(dist, dir);
		this.setPos(clone, false);
	}

	// Methode pour resize une shape selon son image
	resizeShape(image) {
		this.rememberBounds();

		for (let vertex of this.vertices) this.resizeVectorToImage(vertex, image);

		for (let bound of this.bounds) this.resizeVectorToImage(bound, image);

		this.calculateCenterPos();
	}

	resizeVectorToImage(vector, image) {
		/******************** Savoir la direction du resize ********************/
		let ratioW = image.getWidth() / this.oldWidth;
		let ratioH = image.getHeight() / this.oldHeight;

		let leftDist = Math.round(image.middle.dist(this.oldLeft));
		let rightDist = Math.round(image.middle.dist(this.oldRight));
		let topDist = Math.round(image.middle.dist(this.oldTop));
		let bottomDist = Math.round(image.middle.dist(this.oldBottom));

		let horizontalDirection;
		let verticalDirection;

		if (
			(ratioW > 1 && leftDist < rightDist) ||
			(ratioW < 1 && leftDist > rightDist)
		)
			horizontalDirection = 'left';
		else if (
			(ratioW > 1 && leftDist > rightDist) ||
			(ratioW < 1 && leftDist < rightDist)
		)
			horizontalDirection = 'right';

		if (
			(ratioH > 1 && topDist < bottomDist) ||
			(ratioH < 1 && topDist > bottomDist)
		)
			verticalDirection = 'top';
		else if (
			(ratioH > 1 && topDist > bottomDist) ||
			(ratioH < 1 && topDist < bottomDist)
		)
			verticalDirection = 'bottom';
		/************************************************************************/

		if (horizontalDirection === 'right') {
			let hypo = this.oldLeft.dist(vector);
			let angle = vector.direction(this.oldLeft) + this.rotation.x;
			let part = Math.floor(angle / 90);
			if (part % 2 === 0) angle = 90 - (angle % 90);
			else angle = angle % 90;
			let dist = this.adjacentDist(angle, hypo);
			dist = dist * ratioW - dist;
			let dir = 360 - this.rotation.x;
			dir *= this.s.PI / 180;
			vector.translate(dist, dir);
		}
		if (horizontalDirection === 'left') {
			let hypo = this.oldRight.dist(vector);
			let angle = vector.direction(this.oldRight) + this.rotation.x;
			let part = Math.floor(angle / 90);
			if (part % 2 === 0) angle = 90 - (angle % 90);
			else angle = angle % 90;
			let dist = this.adjacentDist(angle, hypo);
			dist = dist * ratioW - dist;
			let dir = 360 - this.rotation.x;
			dir *= this.s.PI / 180;
			vector.translate(-dist, dir);
		}
		if (verticalDirection === 'bottom') {
			let hypo = this.oldTop.dist(vector);
			let angle = vector.direction(this.oldTop) + this.rotation.x;
			let part = Math.floor(angle / 90);
			if (part % 2 === 0) angle = angle % 90;
			else angle = 90 - (angle % 90);
			let dist = this.adjacentDist(angle, hypo);
			dist = dist * ratioH - dist;
			let dir = (90 - this.rotation.x) % 360;
			dir *= this.s.PI / 180;
			vector.translate(-dist, dir);
		}
		if (verticalDirection === 'top') {
			let hypo = this.oldBottom.dist(vector);
			let angle = vector.direction(this.oldBottom) + this.rotation.x;
			let part = Math.floor(angle / 90);
			if (part % 2 === 0) angle = angle % 90;
			else angle = 90 - (angle % 90);
			let dist = this.adjacentDist(angle, hypo);
			dist = dist * ratioH - dist;
			let dir = (90 - this.rotation.x) % 360;
			dir *= this.s.PI / 180;
			vector.translate(dist, dir);
		}
	}
}

export class ShapeException extends Error {}

const { Obstacle } = require('./ts/Obstacle');
const { Road } = require('./ts/Road');
const { Terrain } = require('./ts/Terrain');
const { Interactive } = require('./ts/Interactive');
