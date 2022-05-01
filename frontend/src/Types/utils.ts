export const classNames = (...classes: any[]) => {
	return classes.filter(Boolean).join(' ');
};

export const hexToRGB = (hex: string, alpha?: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	if (alpha) return `${r},${g},${b},${alpha}`;

	return `${r},${g},${b}`;
};

export type OneOf<T, V> =
	| ({ [key in keyof Omit<T, keyof V>]?: never } & V)
	| ({ [key in keyof Omit<V, keyof T>]?: never } & T);

export type MakeCompatible<T extends any[]> = T extends [
	first: infer F,
	...rest: infer R
]
	? R extends []
		? F
		: OneOf<F, MakeCompatible<R>>
	: OneOf<T, {}>;



const a: MakeCompatible<[{ a: true }, { b: false }, { c: 12 }]> = {
	c: 12,
};
