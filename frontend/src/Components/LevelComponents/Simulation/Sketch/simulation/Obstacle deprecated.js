import { Shape } from './Shape';
import { Car } from './Car';
import { $ } from 'jquery';

export class Obstacle extends Shape {
	constructor(s, isGameOver, ...points) {
		super(s, ...points);
		this.class = 'Obstacle';
		this.carInteraction = true;
		this.isGameOver = isGameOver;
	}

	collisionFct() {
		if (!this.s.editMode && this.s.execution && !this.isGameOver) {
			for (let collider of this.colliding)
				if (collider instanceof Car) collider.stop(this);
		}
	}

	setGameOverEvent(event) {
		this.gameOverEvent = {
			gameOverImg: event.gameOverImg,
			message: event.message,
		};
	}

	playGameOverEvent() {
		const img = this.gameOverEvent.gameOverImg;
		const message = this.gameOverEvent.message;

		$('#level-failed-modal').on('show.bs.modal', function () {
			$('#failure-cause').attr('src', img);
			$('#description').text(message);
		});

		// TODO show level fail modal
		//levelFailedModal.modal('show')
	}
}