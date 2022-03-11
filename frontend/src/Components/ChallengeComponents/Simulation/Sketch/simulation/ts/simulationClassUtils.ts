import { SerializableShape } from './typesSimulation';

export class UnknowTemplateError extends Error {}

export function loadFromTemplate<T extends SerializableShape<any, any>>(
	shape: T,
	templates: any,
	templateName: string,
	defaultTemplate?: string,
) {
	let template = templates[templateName];
	if (template === undefined)
		if (defaultTemplate !== undefined) template = templates[defaultTemplate];
		else
			throw new UnknowTemplateError(
				`Template ${templateName} does not exist on type ${shape.shapeType}`,
			);

	Object.entries(templates[templateName]).forEach(([name, value]) => {
		if (name in shape) (shape as any)[name] = value;
	});
}