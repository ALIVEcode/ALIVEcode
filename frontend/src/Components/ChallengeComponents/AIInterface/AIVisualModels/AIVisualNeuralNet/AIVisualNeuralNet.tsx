import {InputNeuron, Neuron, OutputNeuron} from "./AIVisualNeuron";
import {Vector3} from "three";
import {Weight} from "./AIVisualWeight";
import React, {MutableRefObject} from "react";

function layerPositions(size: number, alpha: number, depth: number) {
    let positions = [];
    size++;

    let b = Math.round(alpha*Math.sqrt(size));
    let phi = (Math.sqrt(5)+1)/2;
    for (let k = 1; k < size; k++) {
        let r = radius(k,size,b) * size/2 *5;
        let theta = 2*Math.PI*k/(phi*phi);
        positions.push([r*Math.cos(theta), r*Math.sin(theta), depth]);
    }
    return positions;
}
function radius(k: number, n : number, b : number) {
    if (k>n-b)
        return 1;
    else
        return Math.sqrt(k-1/2)/Math.sqrt(n-(b+1)/2);
}

type NNProps = {
    // containerSize: number
    topology: number[]
    spacing: number
    filter: number
    maxNeuronPerLayer: number
    hasInput:boolean
    hasOutput:boolean

    clickedStates:MutableRefObject<boolean[]>;
    hoveredStates:MutableRefObject<boolean[]>;
    
    forceUpdate:any;
    currentPath:MutableRefObject<string>
    currentHoveredPath:MutableRefObject<string>
    // updatePath:any
}

export const ThreeNeuralNet = (props : NNProps) => {

    let pos = 0


    // Final Size of the Neural Net
    let finalSize = [...props.topology];
    // Base divider
    let divider = 1;

    // Neuron coords in 3D Scene
    let neuronCoords = [];
    // 3D Neuron Representation
    let neurons = []
    // Biggest layer
    let biggestLayer = Math.max(...props.topology)

    let lastVisualNeuronsEqualsTo = []

    // Missing neurons
    let missingNeurons = new Array<number>(props.topology.length).fill(0);

    if (biggestLayer > props.maxNeuronPerLayer) {
        missingNeurons = [...props.topology];
        divider = biggestLayer / props.maxNeuronPerLayer;
        for (let i = 0; i < props.topology.length; i++) {
            // How much each node would be equal to
            finalSize[i] = props.topology[i] / divider;
            // Round down
            divider = Math.floor(divider)
            // Round up
            finalSize[i] = Math.ceil(finalSize[i]);
            // Missing neurons per layer
            missingNeurons[i] -= finalSize[i]
            lastVisualNeuronsEqualsTo.push(props.topology[i] % divider)
        }
    } else {
        for (let i = 0; i < props.topology.length; i++) {
            lastVisualNeuronsEqualsTo.push(0)
        }
    }

    for (let i = 0; i < finalSize.length; i++) {
        let layerPos: any[] = layerPositions(finalSize[i], 1, i * props.spacing);
        // How many neurons are left to be represented as this single neuron
        for (let j = 0; j < layerPos.length; j++) {

            // Passe le path dans l'array des positions
            layerPos[j].push((i + 1) + ":" + (j + 1))
            layerPos[j].push(!(j + 1 === layerPos.length && lastVisualNeuronsEqualsTo[i] !== 0))
            layerPos[j].push(layerPos[j][4] === false ? lastVisualNeuronsEqualsTo[i] / divider : 0)

            // Passe la coordonnée dans la liste des coordonnées des neurones
            // pour plus tard faire les liens
            neuronCoords.push(layerPos[j]);
            // console.log(indexArray)

            // eslint-disable-next-line react-hooks/rules-of-hooks

            if(props.hasInput && i === 0) {
                neurons.push(<InputNeuron clickedStates={props.clickedStates}
                                          hoveredStates={props.hoveredStates}

                                          currentHoveredPath={props.currentHoveredPath}
                                          currentPath={props.currentPath}
                                          forceUpdate={props.forceUpdate}

                                          index={pos++}
                                          filledLevel={layerPos[j][5]} full={layerPos[j][4]} position={new Vector3(...layerPos[j])}
                                          path={(i + 1) + ":" + (j + 1)} radius={3}/>)
            } else if(props.hasOutput && i === finalSize.length-1) {
                neurons.push(<OutputNeuron clickedStates={props.clickedStates}
                                           hoveredStates={props.hoveredStates}

                                           currentHoveredPath={props.currentHoveredPath}
                                           currentPath={props.currentPath}
                                           forceUpdate={props.forceUpdate}

                                           index={pos++}
                                           filledLevel={layerPos[j][5]} full={layerPos[j][4]} position={new Vector3(...layerPos[j])}
                                           path={(i + 1) + ":" + (j + 1)} radius={3}/>)
            } else
            neurons.push(<Neuron clickedStates={props.clickedStates}
                                 hoveredStates={props.hoveredStates}

                                 currentHoveredPath={props.currentHoveredPath}
                                 currentPath={props.currentPath}
                                 forceUpdate={props.forceUpdate}
                
                                 index={pos++}
                                 filledLevel={layerPos[j][5]} full={layerPos[j][4]} position={new Vector3(...layerPos[j])}
                                 path={(i + 1) + ":" + (j + 1)} radius={3}/>)

        }
    }


    // Array contenant les poids 3d
    let weights = [];

    // Pourcentage qui restera approximativement
    let probabilities = 1 - props.filter / 100;

    // Connecte les neurones avec les poids
    let t = 0
    let previous = finalSize[0];
    for (let j = 0; j < neuronCoords.length; j++) {
        if (j >= previous) {
            t++;
            previous += finalSize[t]
        }
        for (let k = previous; k < finalSize[t + 1] + previous; k++)
            if (Math.random() < probabilities) {
                // @ts-ignore
                weights.push(<Weight clickedStates={props.clickedStates}
                                     hoveredStates={props.hoveredStates}

                                     forceUpdate={props.forceUpdate}
                                     currentPath={props.currentPath}
                                     currentHoveredPath={props.currentHoveredPath}

                                     index={pos++} start={neuronCoords[j]} end={neuronCoords[k]}
                                     path={neuronCoords[j][3] + ":" + String(neuronCoords[k][3]).split(":")[1]}/>)
            }
    }

    return <>
        {neurons}
        {weights}
    </>;
}