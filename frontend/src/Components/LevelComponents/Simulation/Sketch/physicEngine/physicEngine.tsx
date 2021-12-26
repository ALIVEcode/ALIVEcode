import { Vector } from "../simulation/Vector";

var EPSILON = 1e-10
var GRAVITATIONAL_FORCE = 9.8

function handleErrors(message: string) {
	throw new Error(message);
}

/**
 * @author Félix Jobin
 * @translator Mathis Laroche
 * @Role
 * This class contains all needed methods to calculate forces implicated in the car simulation.
 * Most of the methods work with <b>Vector2D</b> objects, which represent vectors with 2 components.
 *
 * @static
 * All methods in this class are static, and since it's an abstract class, it cannot be instantiated.
 *
 */

export const PhysicEngine: any = {
	s: null,
	enabled: false,

	acceleration: (sumForces: Vector, mass: number): Vector | null => {
		if (mass < EPSILON) {
			handleErrors('La masse entrée est égale ou presque égale à zéro');
			return null;
		}
		return sumForces.clone().multiplyScalar(1 / mass);
	},

	speed: (prevSpeed: Vector, acceleration: Vector): Vector => {
		const timeFactor = PhysicEngine.s?.maxFPS / PhysicEngine.s.frameRate();
		const deltaSpeed = acceleration.multiplyScalar(timeFactor);
		return prevSpeed.clone().add(deltaSpeed);
	},

	rollingFrictionForce: (
		rollFricCoef: number,
		mass: number,
		carSpeed: Vector,
	): Vector => {
		const roleFricForceModulus = rollFricCoef * mass * GRAVITATIONAL_FORCE;
		const forceOrientation: Vector = carSpeed.clone().multiplyScalar(-1);
		return forceOrientation.clone().multiplyScalar(roleFricForceModulus);
	},
};