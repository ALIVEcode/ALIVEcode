/* eslint-disable no-labels */
import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';
import { images } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/assets';
import { Shape } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Shape';
import { Vector } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Vector';
import { BaseLayoutObj } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/typesSimulation';
import { Serializer } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/Serializer';
import { makeShapeEditable } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/editMode';
import { PlaySocket } from '../PlaySocket';
import { typeAskForUserInput } from '../levelTypes';

// TODO: robotConnected
// const robotConnected = false;

class LevelAliveExecutor extends LevelCodeExecutor {
	public s: any;

	public editorButton: any;
	public robotConnectButton: any;
	public playSocket: PlaySocket | null;

	public d1?: Shape;
	public d2?: Shape;
	public d3?: Shape;

	public sensors: { dA: number; dG: number; dD: number } = {
		dA: 0,
		dG: 0,
		dD: 0,
	};

	constructor(
		levelName: string,
		private editMode: boolean,
		playSocket: PlaySocket | null,
		askForUserInput: typeAskForUserInput,
	) {
		super(levelName, askForUserInput);

		this.doBeforeRun(() => {
			// Set focus
			if (this.s.canvasCamera && this.s.car)
				this.s.canvasCamera.setTarget(this.s.car);
		});

		this.registerActions([
			{
				actionId: 100,
				action: {
					label: 'Stop',
					type: 'NORMAL',
					apply: () => {
						this.s.car.stop();
					},
				},
			},
			{
				actionId: 101,
				action: {
					label: 'Forward',
					type: 'NORMAL',
					apply: params => {
						if (
							params.length > 0 &&
							params[0] !== null &&
							typeof params[0] == 'number'
						) {
							if (params[0] > 0) {
								this.s.car.forward();
								this.wait(() => {
									this.s.car.stop();
									this.perform_next();
								}, params[0] * 1000);
							} else {
								this.perform_next();
							}
						} else {
							this.s.car.forward();
							this.perform_next();
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 102,
				action: {
					label: 'Backward',
					type: 'NORMAL',
					apply: params => {
						if (
							params.length > 0 &&
							params[0] !== null &&
							typeof params[0] == 'number'
						) {
							if (params[0] > 0) {
								this.s.car.backward();
								this.wait(() => {
									this.s.car.stop();
									this.perform_next();
								}, params[0] * 1000);
							} else {
								this.perform_next();
							}
						} else {
							this.s.car.backward();
							this.perform_next();
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 103,
				action: {
					label: 'Turn',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'number') {
							this.s.car.turn(-params[0], () => {
								this.perform_next();
							});
						} else {
							this.perform_next();
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 104,
				action: {
					label: 'Turn Right',
					type: 'NORMAL',
					apply: () => {
						this.s.car.turn(90, () => {
							this.perform_next();
						});
					},
					handleNext: true,
				},
			},
			{
				actionId: 105,
				action: {
					label: 'Turn Left',
					type: 'NORMAL',
					apply: () => {
						this.s.car.turn(-90, () => {
							this.perform_next();
						});
					},
					handleNext: true,
				},
			},
			{
				actionId: 106,
				action: {
					label: 'Rotate Wheels',
					type: 'NORMAL',
					apply: params => {
						if (params.length >= 2) {
							this.s.car.setDirection(
								new Vector(
									params[0] / 255 - params[1] / 255,
									params[0] / 500 + params[1] / 500,
								)
									.normalize()
									.multiplyScalar((params[0] / 2 + params[1] / 2) / 255),
							);
						}
					},
				},
			},
			{
				actionId: 107,
				action: {
					label: 'Go To Angle',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'number') {
							const currentAngle = this.s.car.shape.rotation.x;
							let angle = params[0] % 360;
							angle = angle < 0 ? 360 - angle : angle;
							angle = 360 - angle;

							var rotationAmount: number;
							if (
								360 - currentAngle - angle < 180 &&
								360 - currentAngle - angle >= 0
							)
								rotationAmount = -(360 - currentAngle - angle);
							else rotationAmount = -(360 - angle - currentAngle);

							this.s.car.turn(rotationAmount, () => {
								this.perform_next();
							});
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 601,
				action: {
					label: 'Set Speed',
					type: 'SET',
					apply: params => {
						if (params.length >= 1 && typeof params[0] === 'number')
							this.s.car.speed = params[0];
					},
				},
			},
		]);

		this.doBeforeInterrupt(() => {
			if (!this.s) return;
			const s = this.s;

			this.playSocket && this.playSocket.stopCompile();
			//if(!robotConnected) {
			s.car.reset();
			//}

			// Methode qui respawn tout les collectables collecter par la voiture
			if (s.coinsToRespawn.length > 0) {
				for (let i = s.coinsToRespawn.length - 1; i >= 0; i--) {
					// Fait apparaitre l'objet sur la scène
					s.addObjectToScene(s.coinsToRespawn[i], s.coinsToRespawn[i].zIndex);

					// Pousse le dernier shape modifier dans le tableau s.movableShapes
					s.movableShapes.push(s.storeShapeData(s.coinsToRespawn[i]));
				}

				s.coinsToRespawn.splice(0, s.coinsToRespawn.length);
			}

			// Méthode qui respawn tout les objets qui ont disparu suite au event du bouton rouge
			if (s.objectsToRespawn.length > 0) {
				for (let i = s.objectsToRespawn.length - 1; i >= 0; i--) {
					// Fait apparaitre l'objet sur la scène
					s.addObjectToScene(
						s.objectsToRespawn[i],
						s.objectsToRespawn[i].zIndex,
					);

					// Pousse le dernier shape modifier dans le tableau s.movableShapes
					s.movableShapes.push(s.storeShapeData(s.objectsToRespawn[i]));
				}

				s.objectsToRespawn.splice(0, s.objectsToRespawn.length);
			}

			// Méthode qui remet tout les boutons interactifs à rouge
			for (const interactiveShape of s.interactiveObjects) {
				if (interactiveShape.isButton) {
					// images.red_button
					interactiveShape.setImg(images.red_button_unpressed);
				}
			}

			// Reset focus
			if (s.canvasCamera != null) s.canvasCamera.setTarget(null);
		});

		this.playSocket = playSocket;
	}

	public loadLevelLayout(layout: BaseLayoutObj[] | {}) {
		if (JSON.stringify(layout) === '{}') {
			this.s.car = this.s.spawnCar(0, 0, 75, 110);
		} else {
			const shapes = Serializer.deserialize(this.s, layout as BaseLayoutObj[]);

			for (const [idx, shape] of Object.entries(shapes)) {
				this.s.addObjectToScene(shape, idx);
				makeShapeEditable(shape);
			}

			if (process.env.REACT_APP_DEBUG) console.log(this.s.shapes);
		}
		if (this.editMode) {
			this.spawnEditorButton();
		}
		this.spawnRobotConnectButton();
	}

	public init(s: any) {
		this.s = s;
	}

	// TODO: typing events
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private reset(e: any) {
		if (!this.s) return;
		if (e.collidingWith === this.s.car) {
			//this.playButton.trigger('click');
		}
	}

	// TODO: Add event of zoom to remove s.editorButton and s.robotConnectButton from sketch.js
	//s.editorButton = null
	//s.robotConnectButton = null

	private spawnEditorButton() {
		if (!this.s) return;
		const s = this.s;
		this.editorButton = s.spawnFixedRect(
			s.width / 2 - 35,
			-s.height / 2 + 95,
			50,
			50,
			5000,
		);
		// images.tools
		this.editorButton.setImg(images.tools);
		this.editorButton.color = s.color(0, 0);
		this.editorButton.onHover((e: any) => {
			s.strokeWeight(1);
			this.editorButton.strokeColor = 'red';
		});
		this.editorButton.onClick((e: any) => {
			if (this.execution) {
				//this.playButton.trigger('click');
			}
			this.s.toggleEditMode();
		});
	}

	private spawnRobotConnectButton() {
		if (!this.s) return;
		this.robotConnectButton = this.s.spawnFixedRect(
			this.s.width / 2 - 35,
			-this.s.height / 2 + 35,
			50,
			50,
			1000,
		);
		this.robotConnectButton.setImg(images.animatedCar);
		this.robotConnectButton.color = this.s.color(0, 0);
		this.robotConnectButton.onHover((e: any) => {
			this.s.strokeWeight(1);
			this.robotConnectButton.strokeColor = '#0177bc';
		});

		// TODO: fix connect modal
		this.robotConnectButton.onClick((e: any) => {
			this.s.onConnectCar && this.s.onConnectCar();
		});
	}

	public saveLayout(s: any) {
		const shapes = Object.entries(s.shapes)
			?.sort(([z_idx1], [z_idx2]) => Number(z_idx1) - Number(z_idx2))
			.flatMap(([_, shape]) => shape) as Shape[];

		if (shapes === undefined) return null;

		return Serializer.serialize(shapes);
	}
}

export default LevelAliveExecutor;