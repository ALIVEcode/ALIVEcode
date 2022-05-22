import { ClassConstructor } from "class-transformer";
import { Figure } from "./Figure";
import { Obstacle } from './Obstacle';
import { Road } from './Road';
import { Terrain } from './Terrain';
import { TextObject } from './TextObject';
import { Decoration } from './Decoration';
import { Interactive } from './Interactive';
import { Shape } from '../Shape';
import { SerializableShape } from './typesSimulation';
import { Car } from './Car';

export const classes: {
	[key: string]: ClassConstructor<Shape & SerializableShape<any, any>>;
} = {
	Car: Car,
	Decoration: Decoration,
	Figure: Figure,
	Obstacle: Obstacle,
	Interactive: Interactive,
	Terrain: Terrain,
	Road: Road,
	TextObject: TextObject,
};

