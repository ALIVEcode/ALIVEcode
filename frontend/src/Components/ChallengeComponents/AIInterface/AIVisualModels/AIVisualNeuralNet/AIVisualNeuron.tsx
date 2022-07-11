import React, { MutableRefObject, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { Color, MeshProps } from '@react-three/fiber';

type NeuronData = {
	clickedStates: MutableRefObject<boolean[]>;
	hoveredStates: MutableRefObject<boolean[]>;

	index: number;
	// updatePath:any
	currentPath: MutableRefObject<string>;
	currentHoveredPath: MutableRefObject<string>;

	position: Vector3;
	path: string;
	radius: number;
	full: boolean;
	filledLevel: number;

	forceUpdate: any;
};
type CustomSphereProps = MeshProps &
	NeuronData & {
		colors: Color[];
	};

const Sphere = (props: CustomSphereProps) => {
	const ref = useRef();

	let clicked = false;
	// let fakeStates = new Array(props.clickedStates.length)
	// fakeStates.fill(false)
	// fakeStates[props.identifier] = true;

	return (
		<>
			<mesh
				position={props.position}
				ref={ref}
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

					props.clickedStates.current[props.index] = false;
					//props.clickedStates.current[props.clickedStates.current.indexOf(true)] = false;
					props.currentPath.current = '';
					props.forceUpdate();
				}}
				onPointerOver={event => {
					event.stopPropagation();

					props.hoveredStates.current[
						props.hoveredStates.current.indexOf(true)
					] = false;
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
				<sphereGeometry attach="geometry" args={[3, 16, 16]} />
				<meshStandardMaterial
					transparent
					opacity={props.full ? 1 : 0.5}
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
			</mesh>
			{props.full ? (
				<> </>
			) : (
				<mesh {...props}>
					<sphereGeometry
						// Taille de la sphère
						attach={'geometry'}
						args={[props.filledLevel * 2.9 + 0.1, 16, 16]}
					/>
					<meshStandardMaterial
						// Ce à quoi la sphère ressemble
						color={
							props.clickedStates.current[props.index]
								? props.clickedStates.current[props.index]
									? props.colors[2]
									: 'red'
								: props.hoveredStates.current[props.index]
								? props.colors[1]
								: props.colors[0]
						}
					/>
				</mesh>
			)}
		</>
	);
};
export const Neuron = (props: NeuronData) => {
	return (
		<Sphere
			forceUpdate={props.forceUpdate}
			clickedStates={props.clickedStates}
			hoveredStates={props.hoveredStates}
			currentHoveredPath={props.currentHoveredPath}
			currentPath={props.currentPath}
			index={props.index}
			filledLevel={props.filledLevel}
			full={props.full}
			radius={props.radius}
			colors={['#4a5f70', '#337ef5', '#2ba3f8']}
			position={props.position}
			type={'Neuron'}
			path={props.path}
		/>
	);
};

// TODO Select good colors
export const InputNeuron = (props: NeuronData) => {
	return (
		<Sphere
			forceUpdate={props.forceUpdate}
			clickedStates={props.clickedStates}
			hoveredStates={props.hoveredStates}
			// updatePath={props.updatePath}
			currentPath={props.currentPath}
			currentHoveredPath={props.currentHoveredPath}
			index={props.index}
			filledLevel={props.filledLevel}
			full={props.full}
			radius={props.radius}
			colors={['#51704a', '#60e14c', '#39f82b']}
			position={props.position}
			type={'Neuron'}
			path={props.path}
		/>
	);
};

// TODO Select good colors
export const OutputNeuron = (props: NeuronData) => {
	return (
		<Sphere
			forceUpdate={props.forceUpdate}
			clickedStates={props.clickedStates}
			hoveredStates={props.hoveredStates}
			// updatePath={props.updatePath}
			currentPath={props.currentPath}
			currentHoveredPath={props.currentHoveredPath}
			index={props.index}
			filledLevel={props.filledLevel}
			full={props.full}
			radius={props.radius}
			colors={['#8d1b2c', '#a12b2b', '#ff796c']}
			position={props.position}
			type={'Neuron'}
			path={props.path}
		/>
	);
};
