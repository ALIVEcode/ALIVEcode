import React, { MutableRefObject } from 'react';
import { Color, extend, MeshProps, ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

extend({ Line_: THREE.Line });

declare global {
	namespace JSX {
		interface IntrinsicElements {
			line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>;
		}
	}
}

type WeightData = {
	clickedStates: MutableRefObject<boolean[]>;
	hoveredStates: MutableRefObject<boolean[]>;

	index: number;
	currentPath: MutableRefObject<string>;
	currentHoveredPath: MutableRefObject<string>;

	start: number[];
	end: number[];
	path: string;
	forceUpdate: any;
};
type customLineProps = MeshProps &
	WeightData & {
		colors: Color[];
		width: number;
	};
function Line(props: customLineProps) {
	const points = [];
	points.push(new THREE.Vector3(...props.start));
	points.push(new THREE.Vector3(...props.end));
	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

	return (
		// Parce que line est déjà utilisé par React
		<line_
			geometry={lineGeometry}
			onClick={event => {
				event.stopPropagation();

				if (!props.clickedStates.current[props.index])
					props.clickedStates.current[
						props.clickedStates.current.indexOf(true)
					] = false;
				props.clickedStates.current[props.index] =
					!props.clickedStates.current[props.index];

				if (!props.clickedStates.current[props.index])
					props.currentPath.current = '';
				else props.currentPath.current = props.path;

				props.forceUpdate();
			}}
			onPointerMissed={event => {
				event.stopPropagation();

				//props.clickedStates.current[props.clickedStates.current.indexOf(true)] = false;
				props.clickedStates.current[props.index] = false;
				props.currentPath.current = '';
				props.forceUpdate();
			}}
			onPointerOver={event => {
				event.stopPropagation();

				props.hoveredStates.current[props.hoveredStates.current.indexOf(true)] =
					false;
				props.hoveredStates.current[props.index] = true;
				props.currentHoveredPath.current = props.path;

				props.forceUpdate();
			}}
			onPointerOut={event => {
				event.stopPropagation();

				if (props.clickedStates.current.indexOf(true) !== -1) {
					props.hoveredStates.current[
						props.hoveredStates.current.indexOf(true)
					] = false;
					props.currentHoveredPath.current = '';
				}

				props.forceUpdate();
			}}
		>
			<lineBasicMaterial
				opacity={
					props.hoveredStates.current[props.index] ||
					props.clickedStates.current[props.index]
						? 0.6
						: 0.3
				}
				transparent
				attach="material"
				linewidth={props.width}
				color={
					props.clickedStates.current[props.index]
						? props.hoveredStates.current[props.index]
							? props.colors[2]
							: 'red'
						: props.hoveredStates.current[props.index]
						? props.colors[1]
						: props.colors[0]
				}
			/>
		</line_>
	);
}

// Pour créer un poid
// Bleu = 1 poid
export function Weight(props: WeightData) {
	return (
		<React.Fragment>
			<Line
				forceUpdate={props.forceUpdate}
				width={4}
				end={props.start}
				start={props.end}
				colors={['#4a5f70', '#337ef5', '#2ba3f8']}
				type={'Weight'}
				path={props.path}
				clickedStates={props.clickedStates}
				hoveredStates={props.hoveredStates}
				index={props.index}
				currentPath={props.currentPath}
				currentHoveredPath={props.currentHoveredPath}
			/>
		</React.Fragment>
	);
}
