import { Car } from "./Car";
import { Shape } from "../Shape";
import { Template } from './typesSimulation';
import { SerializableShape } from './typesSimulation';
import { Vector } from '../Vector';
import { loadFromTemplate } from './simulationClassUtils';
import { imagesPath } from '../assets';

type TemplateNamesObstacle = 'stop' | 'fall' | 'water' | 'lava';

export class Obstacle
	extends Shape
	implements SerializableShape<TemplateNamesObstacle, Obstacle>
{
	readonly shapeType = 'Obstacle';

	readonly templateName: TemplateNamesObstacle;
	isGameOver: boolean;
	gameOverEvent?: {
		gameOverImg: string;
		message: string;
	};

	constructor(
		s: any,
		templateName: TemplateNamesObstacle,
		...points: Vector[]
	) {
		super(s, ...points);
		this.class = 'Obstacle';
		this.templateName = templateName;
		this.carInteraction = true;
		this.loadFromTemplate();
	}

	override collisionFct() {
		if (!this.s.editMode && this.s.execution && !this.isGameOver) {
			this.colliding.find(collider => collider instanceof Car)?.stop(this);
		}
	}

	playGameOverEvent?() {
		if (!this.gameOverEvent?.gameOverImg || !this.gameOverEvent?.message)
			return;
		const img = this.gameOverEvent.gameOverImg;
		const message = this.gameOverEvent.message;

		this.s.onLose(img, message);

		//levelFailedModal.modal('show');
	}

	get uniqueProperties() {
		return {};
	}

	loadFromTemplate() {
		loadFromTemplate(this, this.templates, this.templateName);
	}

	readonly defaultTemplate: TemplateNamesObstacle = 'stop';
	readonly templates: Template<TemplateNamesObstacle, Obstacle> = {
		stop: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: imagesPath.rocheMars1,
				message: 'simulation.modal.wall',
			},
		},

		fall: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: imagesPath.hole,
				message: 'simulation.modal.hole',
			},
		},

		lava: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: imagesPath.lava,
				message: 'simulation.modal.lava',
			},
		},

		water: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: imagesPath.water_splash,
				message: 'simulation.modal.water',
			},
		},
	};
}