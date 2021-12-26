import { PhysicEngine } from '../physicEngine/physicEngine';
import { Obstacle } from './ts/Obstacle';
import { Road } from './ts/Road';
import { Terrain } from './ts/Terrain';
import { Interactive } from './ts/Interactive';
import { Vector } from './Vector';
import { images } from './assets';

export class Car {
	#speed;
	nbFrameToEquilibrium;
	constructor(s, shape) {
		this.s = s;
		this.shape = shape;
		this.initShape();
		this.shape.shapeType = 'Car';
		this.dir = new Vector(0, 0);

		this.initialSpeed = 0;

		this.#speed = 0;

		this.rotateSpeed = 2; // degrees / second
		this.turning = false;
		this.rotationGoal = null;

		this.initialRotateSpeed = this.rotateSpeed;
		this.initialPos = shape.pos.clone();
		this.initialRotation = shape.rotation.clone();

		this.i = 0;

		// physic constants
		this.MASS = 250; // kg
		this.INITIAL_FORCE_MODULUS = 2700; // N

		this.currentForceModulus = this.INITIAL_FORCE_MODULUS; // N
		this.friction = 0;
	}

	initShape() {
		this.shape.movable = true;
		this.nbFrameToEquilibrium = 45;

		this.shape.onHover(() => {
			if (this.s.editMode) {
				this.s.fullscreenDiv.css('cursor', 'move');
			}
		});

		this.shape.onClick(() => {
			if (this.s.editMode && !this.s.keyIsDown(32)) {
				if (this.shape.children.length === 0) this.shape.editShape(true);
			}
		});

		this.shape.onHoverExit(() => {
			if (this.s.editMode) {
				this.s.fullscreenDiv.css('cursor', 'default');
			}
		});

		this.shape.onCollisionEnter(() => {
			this.interactions(false);
		});

		this.shape.onCollisionExit(() => {
			if (this.shape.colliding.length > 0) this.interactions(true);
		});
	}

	topShapeCollision() {
		let topZIndex = -1;
		let shapeInteraction = null;
		for (let collider of this.shape.colliding)
			if (collider.carInteraction)
				if (collider.zIndex >= topZIndex) {
					topZIndex = collider.zIndex;
					shapeInteraction = collider;
				}

		return shapeInteraction;
	}

	interactions(speedCheck) {
		let shapeInteraction = this.topShapeCollision();

		// Interations avec un terrain
		if (
			shapeInteraction instanceof Terrain ||
			shapeInteraction instanceof Road
		) {
			//this.#speed = this.initialSpeed * shapeInteraction.frictionCoef;
		} else if (!this.s.editMode) {
			// Interactions avec un obstacle
			if (shapeInteraction instanceof Obstacle) {
				//this.s.playSound(shapeInteraction.soundOnCollision, 0.3);

				this.stop(shapeInteraction);

				if (shapeInteraction.isGameOver) {
					shapeInteraction.playGameOverEvent();
					return;
				}

				const backward = this.shape.forward.clone();
				backward.y = -backward.y;
				this.shape.moveInDirection(
					backward,
					this.dir.y * this.speed + this.speed * 1.5,
					true,
				);
			}
			// Interactions avec un interactiveObject
			else if (shapeInteraction instanceof Interactive) {
				// Les coins
				if (shapeInteraction.isCollectable) {
					//this.s.playSound(this.s.newCoinCollectedAudio(), 0.3);

					this.s.coinsToRespawn.push(shapeInteraction);

					// Supprime le dernier shape modifier dans la liste s.movableShapes aussi
					this.s.movableShapes.forEach((shape, index) => {
						if (
							this.s.movableShapes[index].originalShape.id ===
							shapeInteraction.id
						)
							this.s.movableShapes.splice(index, 1);
					});

					this.shape.colliding.forEach((shape, index) => {
						if (this.shape.colliding[index].id === shapeInteraction.id)
							this.shape.colliding.splice(index, 1);
					});
					this.s.deleteShape(shapeInteraction, true);

					let objectifPresent = false;

					// Cherche dans la liste d'objets interactifs si il y a une ligne d'arrivé présent dans le canvas
					this.s.interactiveObjects.forEach((interactiveObject, index) => {
						if (this.s.interactiveObjects[index].isObjectif) {
							objectifPresent = true;
						}
					});

					if (
						this.s.coinsTotal === this.s.coinsToRespawn.length &&
						!objectifPresent
					)
						this.win();
					return;
				}
				// Objectif
				else if (
					shapeInteraction.isObjectif &&
					this.s.coinsTotal === this.s.coinsToRespawn.length
				) {
					this.win();
				}
				// Bouton
				else if (shapeInteraction.isButton) {
					shapeInteraction.setImg(images.green_button_pressed);

					shapeInteraction.linkedId.forEach((idLinked, index) => {
						let shapeLinked = this.s.getShapeById(
							shapeInteraction.linkedId[index],
						);

						if (shapeLinked != null) {
							this.s.objectsToRespawn.push(shapeLinked);

							this.s.deleteShape(shapeLinked);

							// Supprime le dernier shape modifier dans la liste s.movableShapes aussi
							this.s.movableShapes.forEach((shapeInList, index) => {
								if (
									this.s.movableShapes[index].originalShape.id ===
									shapeLinked.id
								) {
									this.s.movableShapes.splice(index, 1);
								}
							});
						}
						/* A remettre quelque part d'autre
                        else
                            shapeInteraction.linkedId.splice(index, 1)
                        */
					});
				}
			}
		}
	}

	// TODO add level complete modal
	win() {
		//levelCompleteModal.modal("show")
		this.s.onWin();
		//if (typeof this.s.winTrigger === 'function') this.s.winTrigger();
		//this.s.playSound(this.s.level_complete_audio, 0.3);
		//this.s.confetti();
		//this.s.playButton.click();
	}

	update() {
		if (this.dir.y !== 0) {
			// #region PHYSIC
			// TODO méthode permettant de changer la vitesse de la voiture selon le terrain

			if (PhysicEngine.enabled) {
				let collisionWith = this.topShapeCollision();
				let coef = 1;
				if (collisionWith instanceof Terrain || collisionWith instanceof Road) {
					coef = collisionWith.frictionCoef;
					coef = 1;
				}

				const orientationVec = this.shape.forward.normalize();
				this.friction = PhysicEngine.rollingFrictionForce(
					coef,
					this.MASS,
					orientationVec.clone(),
				);

				this.currentForceModulus +=
					(this.friction.length - this.currentForceModulus) /
					this.nbFrameToEquilibrium;

				const angle = (360 - this.shape.rotation.x + 90) % 360;
				const angleRad = (angle * Math.PI) / 180;
				//console.log({angle});
				const baseForce = new Vector(
					Math.cos(angleRad) * this.currentForceModulus,
					Math.sin(angleRad) * this.currentForceModulus,
				);
				const resultingForce = baseForce.clone().add(this.friction);
				const accelerationVec = PhysicEngine.acceleration(
					resultingForce,
					this.MASS,
				);
				const speedVec = PhysicEngine.speed(
					orientationVec.clone().multiplyScalar(this.speed),
					accelerationVec,
				);
				this.speed = speedVec.length;

				const timeFactor = PhysicEngine.s.maxFPS / PhysicEngine.s.frameRate();
				this.shape.move(
					speedVec
						.clone()
						.multiplyScalar(this.dir.y)
						.multiplyScalar(timeFactor),
				);
			} else {
				this.speed = 10;
				this.shape.moveInDirection(
					this.shape.forward,
					this.dir.y * this.speed,
					true,
				);
			}
		}

		if (this.dir.x !== 0) {
			this.shape.rotate(this.dir.x * this.rotateSpeed);
			if (this.dir.x < 0) {
				this.shape.setImg(images.carTopG);
			} else {
				this.shape.setImg(images.carTopD);
			}
		}
		//if (this.turning) {
		//const step =
		//	this.rotateSpeed *
		//	this.rotationDir *
		//	(this.s.maxFPS / this.s.frameRate());
		//
		//this.shape.setRotation(this.rotationBeforeTurn + step);

		if (this.rotationGoal) {
			const goal = this.rotationGoal;
			const rotationStep =
				this.rotateSpeed *
				this.rotationDir *
				(this.s.maxFPS / this.s.frameRate());
			let res = 0;
			if (Math.abs(goal - this.rotationAmount) <= Math.abs(rotationStep / 2))
				res = goal;
			else {
				this.rotationAmount += rotationStep;
				res =
					Math.abs(goal - this.rotationAmount) <= Math.abs(rotationStep / 2)
						? goal
						: this.rotationAmount;
			}
			//let res = .translateTo(this.shape.rotationGoal, Date.now() - this.s.pdt, )
			this.shape.setRotation(res + this.rotationBeforeTurn);
			if (res === goal) {
				this.rotationGoal = null;
				this.shape.setImg(images.carTop);
				if (this.callback != null) {
					let tempCallback = this.callback;
					this.callback = null;
					tempCallback();
				}
			}
			//}
		}

		if (this.i % this.updateInterval === 0) {
			this.updateFct();
			this.i = 1;
		}
		this.i++;
	}

	updateFct() {}

	onUpdate(fct, interval = 1) {
		if (interval <= 0) interval = 1;
		this.updateInterval = interval;
		this.updateFct = fct;
	}

	set speed(sp) {
		this.#speed = sp;
	}

	get speed() {
		return this.#speed;
	}

	/**
	 *
	 * @returns la vitesse de la voiture dans la vraie vie (IRL)
	 */
	get speedIRL() {
		return (this.speed * 3) / 110;
	}

	/**
	 *
	 * @returns la vitesse en pixels par frames
	 */
	get speed_pixel_frame() {
		const speed_pixel_per_second = this.s.convertMetersToPixels(this.speed);
		return speed_pixel_per_second / this.s.maxFPS;
	}

	setDirection(newDir) {
		this.dir = newDir.clone();
		console.log(this.dir);
	}

	forward() {
		this.dir.y = 1;
	}

	backward() {
		this.dir.y = -1;
	}

	/**
	 *
	 * @param {number} angle
	 * @returns
	 */
	getTimeToRotate(angle) {
		return Math.abs(angle / this.rotateSpeed);
	}

	turn(angle, callback) {
		this.shape.setImg(angle > 0 ? images.carTopD : images.carTopG);
		this.rotationBeforeTurn = this.shape.rotation.x;
		this.rotationAmount = 0;
		this.rotationDir = angle < 0 ? -1 : 1;
		this.turning = true;
		this.rotationGoal = angle;
		this.callback = callback;
	}

	stopRotate() {
		this.turning = false;
		this.rotationGoal = null;
		this.shape.setImg(images.carTop);
	}

	stop(decollisionShape = null) {
		this.dir.multiplyScalar(0);
		if (decollisionShape != null) {
			let dir = decollisionShape.pos.direction(this.shape.pos);
			dir *= this.s.PI / 180;
			let newPos = this.shape.pos.clone();
			newPos.translate(1, dir);
			this.shape.setPos(newPos);
		}
		this.currentForceModulus = this.INITIAL_FORCE_MODULUS;
	}

	setInitialPlacement() {
		this.initialPos = this.shape.pos.clone();
		this.initialRotation = this.shape.rotation.clone();
	}

	reset() {
		this.stop();
		this.speed = this.initialSpeed;
		this.rotateSpeed = this.initialRotateSpeed;
		this.shape.setPos(this.initialPos);
		this.shape.setRotation(this.initialRotation.x);
		this.shape.setImg(images.carTop);
		this.rotationGoal = null;
		this.turning = false;
		this.rotationDir = 0;
		this.rotationAmount = 0;
		if (this.s.canvasCamera != null)
			this.s.canvasCamera.setPos(this.shape.pos.clone()); //Ceci est bon pour 1 voiture
	}
}
