import React, {useContext, useState} from "react";

import {OrbitControls} from "@react-three/drei";

import * as THREE from 'three';

import {
    Canvas, Color, extend, MeshProps, ReactThreeFiber
} from "@react-three/fiber";
import {Vector3} from "three";
import {ChallengeContext} from "../../../../state/contexts/ChallengeContext";
import {Neuron} from "./AIVisualNeuralNet/AIVisualNeuron";

extend({Line_: THREE.Line})

declare global {
    namespace JSX {
        interface IntrinsicElements {
            line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
        }
    }
}
let selected = false;

//      Fonctions pour les neurones
namespace NNNeuron {
    // Custom props pour les sphères
    type NeuronData = {
        position:Vector3;
        path: String
    }
    type CustomSphereProps = MeshProps & NeuronData & {
        colors: Color[];
        type:String
    }
    // Pour créer une sphère
    function NeuronSphere(props: CustomSphereProps) {

        // const ref = useRef()
        const [hovered, hover] = useState(false)
        const [clicked, click] = useState(false)

        return (
            <mesh
                {...props}

                onClick={(e) => {
                    e.stopPropagation()
                    click(true)
                    selected = true
                }}
                onPointerMissed={(e)=>{
                    e.stopPropagation()
                    click(false);
                    selected = false;
                }}
                onPointerOver={(e) => {
                    hover(true);
                    e.stopPropagation()
                    if(!selected) {}
                }}
                onPointerOut={(e) => {
                    hover(false);
                    e.stopPropagation()
                }}>
                <sphereGeometry attach={"geometry"} args={[3,16,16]}/>
                <meshStandardMaterial color={clicked ? (hovered ? props.colors[2] : props.colors[1]) : (hovered ? props.colors[1] : props.colors[0])} />
            </mesh>
        )
    }

    // Pour créer une neurone
    // Bleu = 1 neurone
    export function Neuron(props: NeuronData) {
        return (
            <React.Fragment>
                <NeuronSphere
                    colors={['#4a5f70','#337ef5', '#2ba3f8']}
                    position={props.position}
                    type={"Neuron"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 5 neurones en une
    // Rouge = 5 neurones
    export function Neuron5(props: NeuronData) {
        return (
            <React.Fragment>
                <NeuronSphere
                    colors={['#704a4a','#f53333', '#ff7b7b']}
                    position={props.position}
                    type={"Neuron"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 10 neurones en une
    // Vert = 10 neurones
    export function Neuron10(props: NeuronData) {
        return (
            <React.Fragment>
                <NeuronSphere
                    colors={['#4e704a','#4df533', '#84ff7b']}
                    position={props.position}
                    type={"Neuron"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 50 neurones en une
    // Orange = 50 neurones
    export function Neuron50(props: NeuronData) {
        return (
            <React.Fragment>
                <NeuronSphere
                    colors={['#70604a','#f59a33', '#ffca7b']}
                    position={props.position}
                    type={"Neuron"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }
}

//      Fonctions pour créer des poids
namespace NNWeights  {
    // Custom props pour les lignes
    type WeightData = {
        start: Array<number>
        end: Array<number>
        path: String
    }
    type customLineProps = WeightData & {
        colors: Color[];
        type: String
    }

    // Pour créer une ligne entre deux points
    function Line( props: customLineProps ) {
        const [hovered, hover] = useState(false)
        const [clicked, click] = useState(false)

        const points = []
        points.push(new THREE.Vector3( ...props.start))
        points.push(new THREE.Vector3(...props.end))

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

        return (
            // Parce que line est déjà utilisé par React
            <line_ geometry={lineGeometry}
                   onClick={(e) => {
                       e.stopPropagation()
                       click(true)

                   }}
                   onPointerMissed={(e)=>{
                       e.stopPropagation()
                       click(false);
                   }}
                   onPointerOver={(e) => {
                       hover(true);
                       e.stopPropagation()
                       if(!selected) {}
                   }}
                   onPointerOut={(e) => {hover(false); e.stopPropagation() }}>
                <lineBasicMaterial
                    opacity={hovered || clicked ? 0.7 : 0.3}
                    transparent
                    attach="material"
                    linewidth={4}
                    linecap={'round'}
                    linejoin={'round'}
                    color={clicked ? (hovered ? props.colors[2] : props.colors[1]) : (hovered ? props.colors[1] : props.colors[0])}
                />
            </line_>
        )
    }

    // Pour créer un poid
    // Bleu = 1 poid
    export function Weight(props: WeightData) {
        return (
            <React.Fragment>
                <Line
                    end={props.start}
                    start={props.end}
                    colors={['#4a5f70','#337ef5', '#2ba3f8']}
                    type={"Weight"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 5 poids en un
    // Rouge = 5 poids
    export function Weight5(props: WeightData) {
        return (
            <React.Fragment>
                <Line
                    end={props.start}
                    start={props.end}
                    colors={['#704a4a','#f53333', '#ff7b7b']}
                    type={"Weight"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 10 poids en un
    // Vert = 10 poids
    export function Weight10(props: WeightData) {
        return (
            <React.Fragment>
                <Line
                    end={props.start}
                    start={props.end}
                    colors={['#4e704a','#4df533', '#84ff7b']}
                    type={"Weight"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }

    // Pour créer 50 poids en un
    // Orange = 50 poids
    export function Weight50(props: WeightData) {
        return (
            <React.Fragment>
                <Line
                    end={props.start}
                    start={props.end}
                    colors={['#70604a','#f59a33', '#ffca7b']}
                    type={"Weight"}
                    path={props.path}
                />
            </React.Fragment>
        )
    }
}

//      Neural Network
function layerPositions(size: number, alpha: number, depth: number, number: number) {
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
    topology: Array<number>
    spacing: number
    filter: number
    maxNeuronPerLayer: number
}

// function compactLayer(size : number, targetCompaction : number) {
//     let required50 : number = 0;
//     let required10 : number = 0;
//     let required5 : number = 0;
//     let required1;
//     while(size > targetCompaction && size - 50 >= 0) {
//         size -= 50;
//         required50++;
//     }
//     while(size > targetCompaction && size - 10 >= 0) {
//         size -= 10;
//         required10++;
//     }
//     while(size > targetCompaction && size - 5 >= 0) {
//         size -= 5;
//         required5++;
//     }
//     required1 = size;
//     let compactSize : number = required1 + required5 + required10 + required50;
//     //alert(compactSize + ":" + required1 + "," + required5 + "," +
//     //required10 + "," +required50 + "," )
//
//     return [required1, required5, required10, required50, compactSize]
//
// }

function ThreeNN (props : NNProps) {
    let neuronCoords = [];

    let neurons = []

    let biggestLayer = Math.max(...props.topology)

    let divider = 1;

    if(biggestLayer > props.maxNeuronPerLayer) {
        let oldTopology = [...props.topology];
        divider = biggestLayer / props.maxNeuronPerLayer;
        //alert("Each neuron/weight = " + divider)
        for (let i = 0; i < props.topology.length; i++) {
            props.topology[i] /= divider;
            props.topology[i] = Math.ceil(props.topology[i]);
            oldTopology[i] -= props.topology[i]
        }
    }


    let finalSize = [...props.topology];

    for (let i = 0; i < props.topology.length; i++) {
        let layerPos = layerPositions(props.topology[i], 1, i * props.spacing, props.spacing / 2);
        for (let j = 0; j < layerPos.length; j++) {
            //@ts-ignore
            layerPos[j].push((i+1)+":"+(j+1))
            neuronCoords.push(layerPos[j]);
            neurons.push(<NNNeuron.Neuron
                position={new Vector3(...layerPos[j])} path={(i+1)+":"+(j+1) }/>)
        }
    }

    /*
            if we were to use color codes to determine the size of
            the neurons

    for(let i = 0; i < props.topology.length; i++) {
        if(props.targetNeuronAmount > props.topology[i]) {
            let layerPos = layerPositions(props.topology[i], 2, i*props.spacing, props.spacing/2);
            for(let j = 0; j < layerPos.length; j++) {
                neuronCoords.push(layerPos[j]);
                neurons.push(<NNNeuron.Neuron position={new Vector3(...layerPos[j])} path={}/>)
            }
        }
        else {
            let tempArray = compactLayer(props.topology[i], props.targetNeuronAmount);
            let layerPos = layerPositions(tempArray[4], 2, i*props.spacing, props.spacing/2)
            finalSize.push(tempArray[4])
            let k = 0;
            console.log(layerPos.length)
            for(let j = 0; j < layerPos.length; j++) {

                while(tempArray[k] <= 0) {
                    k++;
                }
                switch(k) {
                    case 0:
                        layerPos[j].push(1)
                        neurons.push(<NNNeuron.Neuron bias={Math.random()} position={new Vector3(...layerPos[j])} path={Math.random()}/>)
                        break;
                    case 1:
                        layerPos[j].push(5)
                        neurons.push(<NNNeuron.Neuron5 bias={Math.random()} position={new Vector3(...layerPos[j])} path={Math.random()}/>)
                        break;
                    case 2:
                        layerPos[j].push(10)
                        neurons.push(<NNNeuron.Neuron10 bias={Math.random()} position={new Vector3(...layerPos[j])} path={Math.random()}/>)
                        break;
                    case 3:
                        layerPos[j].push(50)
                        neurons.push(<NNNeuron.Neuron50 bias={Math.random()} position={new Vector3(...layerPos[j])} path={Math.random()}/>)
                }

                neuronCoords.push(layerPos[j])
                tempArray[k]--;
            }


        }

    } */
    let weights = [];
    //for (let i = 0; i < props.topology.length; i++) {
        let probabilities = 1 - props.filter / 100;
        let t = 0
        let previous = finalSize[0];

        for (let j = 0; j < neuronCoords.length; j++) {
            if (j >= previous) {
                t++;
                previous += finalSize[t]
                //alert(previous)
            }
            for (let k = previous; k < finalSize[t + 1] + previous; k++) {
                if (Math.random() < probabilities) {
                    weights.push(<NNWeights.Weight start={neuronCoords[j]} end={neuronCoords[k]} path={neuronCoords[j][3]+":" + String(neuronCoords[k][3]).split(":")[1]}/>)
                } /*
                switch(neuronCoords[i][3]) {
                    case 50:
                        weights.push(<NNWeights.Weight50 start={neuronCoords[i]} end={neuronCoords[k]} path={Math.random()}/>)
                        break;
                    case 10:
                        weights.push(<NNWeights.Weight10 start={neuronCoords[i]} end={neuronCoords[k]} path={Math.random()}/>)
                        break;
                    case 5:
                        weights.push(<NNWeights.Weight5 start={neuronCoords[i]} end={neuronCoords[k]} path={Math.random()}/>)
                        break;
                    default:
                        weights.push(<NNWeights.Weight start={neuronCoords[i]} end={neuronCoords[k]} path={Math.random()}/>)
                }
            }*/
            }
     //   }
    }
        return <React.Fragment>
            {neurons}
            {weights}
        </React.Fragment>;
}

//      Three Canvas
    export function ThreeScene() {

        const raycaster = new THREE.Raycaster();
        // @ts-ignore
        raycaster.params.Line.threshold = 0.2;


        // const [mouse] = useState([0, 0]);;
        const {} = useContext(ChallengeContext);

        const topology = [20, 30, 10, 5, 100]
        const spacing = 20

        return (
            <Canvas raycaster={raycaster} camera={{fov: 75, position: [spacing * -4, 0, 20 * topology.length / 2]}}>
                <pointLight position={[64, 64, 64]}/>
                <ambientLight intensity={1} color={'#bcd9ff'}/>
                <OrbitControls target={[0, 0, spacing * topology.length/2 - 5]}/>
                <ThreeNN topology={topology} spacing={spacing} filter={0} maxNeuronPerLayer={10}/>
            </Canvas>
        );
    }
