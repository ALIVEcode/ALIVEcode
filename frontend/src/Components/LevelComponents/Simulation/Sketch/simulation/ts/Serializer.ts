import { images, loadImages, imageNameType } from '../assets';
import { Shape } from '../Shape';
import { Vector } from '../Vector';
import { classes } from './SimulationClasses';

import { BaseLayoutObj, ShapeInfo, SerializableShape } from './typesSimulation';

export class Serializer {
	static readonly version = '1.0';
	static serialize(shapes: Shape[]): BaseLayoutObj[] {
		const layout: BaseLayoutObj[] = [];

		for (const shape of shapes) {
			// test if the shape is a serializable shape
			if ('shapeType' in shape) {
				layout.push({
					id: shape.id,
					shapeType: (shape as unknown as SerializableShape<string, any>)
						.shapeType,
					templateName: (shape as unknown as SerializableShape<string, any>)
						.templateName,
					shapeInfo: {
						position: { x: shape.pos!.x, y: shape.pos!.y },
						vertices: shape.vertices.map(v => {
							return { x: v.x, y: v.y };
						}),
						rotation: {
							x: shape.rotation.x,
							y: shape.rotation.y,
						},
					},
					imageName: shape.imgName,
					imageRes: shape.res ?? null,
					properties: (shape as unknown as SerializableShape<string, any>)
						.uniqueProperties,
				});
			}
		}

		//const serializedLevel: SerializedLevel = {
		//	version: this.version,
		//	layout: layout,
		//};

		return layout;
	}

	static vectorToCoord(shapeInfo: ShapeInfo): number[][] {
		const { position, vertices, rotation } = shapeInfo;

		const points = vertices.map(vertex => {
			const point: Vector = new Vector(vertex.x, vertex.y);
			point.rotate(
				(rotation.x * Math.PI) / 180,
				new Vector(position.x, position.y),
			);
			return [point.x, point.y];
		});
		if (process.env.REACT_APP_DEBUG) console.log(points);

		return points;
	}

	static deserialize(s: any, layout: BaseLayoutObj[] | undefined): Shape[] {
		if (layout) {
			const shapes: Shape[] = [];

			for (const serializedShape of layout) {
				const points = this.vectorToCoord(serializedShape.shapeInfo);

				let shape: Shape & SerializableShape<string, any> = new classes[
					serializedShape.shapeType
				](s, serializedShape.templateName, ...points);

				shape.loadFromTemplate();

				if (serializedShape.properties)
					Object.entries(serializedShape.properties).forEach(
						([name, value]) => {
							if (name in shape) (shape as any)[name] = value;
						},
					);

				if (serializedShape.shapeType === 'Car') {
					s.car = s.spawnCar(0, 0, 75, 110);
					if (process.env.REACT_APP_DEBUG) console.log(s.car);
					continue;
				}

				if (serializedShape.imageName) {
					loadImages(serializedShape.imageName);
					if (serializedShape.imageRes !== null)
						shape.setTexture(
							images[serializedShape.imageName as imageNameType],
							serializedShape.imageRes,
						);
					else shape.setImg(images[serializedShape.imageName as imageNameType]);
				}

				shape.rotate(serializedShape.shapeInfo.rotation.x, shape.pos);
				shapes.push(shape);
			}
			return shapes;
		}
		return [];
	}
}

