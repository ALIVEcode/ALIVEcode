import * as THREE from "three";
import React, { useRef } from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {ThreeNeuralNet} from "./AIVisualNeuralNet";
import {useForceUpdate} from "../../../../../state/hooks/useForceUpdate";
import {NNHyperparameters} from "../../../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces";

type NNProps = {
    hyperparameters: NNHyperparameters
    spacing: number
    filter: number
    maxNeuronPerLayer: number
}

export function AICanvas(props:NNProps) {

    const raycaster = new THREE.Raycaster();
    // @ts-ignore
    raycaster.params.Line.threshold = 0.8;


    // const [mouse] = useState([0, 0]);;
    //const {} = useContext(ChallengeContext);

    const topology = [props.hyperparameters.nbInputs, ...props.hyperparameters.neuronsByLayer, props.hyperparameters.nbOutputs]
    const biggestLayer = Math.max(...topology)

    if(props.hyperparameters.nbInputs !== 0) {

    }

    const hasInput = props.hyperparameters.nbInputs !== 0
    const hasOutput = props.hyperparameters.nbOutputs !== 0

    const divider = biggestLayer>props.maxNeuronPerLayer ? biggestLayer / props.maxNeuronPerLayer: 1;


    const spacing = props.spacing

    let actualTopology = [...topology]
    let oldTopology = [...topology]

    for(let i = 0; i < actualTopology.length; i++) {
        actualTopology[i] /= divider;
        actualTopology[i] = Math.ceil(actualTopology[i]);
        oldTopology[i] -= actualTopology[i]
    }
    let containerSize = 0;

    for(let i = 0; i < actualTopology.length-1; i++) {
        containerSize+=actualTopology[i];
        containerSize+= actualTopology[i]*actualTopology[i+1]
    }
    containerSize += actualTopology[actualTopology.length-1]

    // console.log(actualTopology);
    // console.log(containerSize)


    //const clickedStates:boolean[] | ((value: any, index: number) => void) = test[0]

    const clickedStates = useRef(new Array(containerSize).fill(false))
    const hoveredStates = useRef(new Array(containerSize).fill(false))



    const currentPath = useRef("default val");
    const forceUpdate = useForceUpdate();

    // const setCurrentPath = (newPath:string) => {
    //     currentPath.current = newPath;
    //     forceUpdate();
    // }

    function Test() {
        return <div className={"absolute right-10"
             // + (currentPath.current === "default val" ? "hidden" : "visible")
            }
        >

            {currentPath.current}
            <br />
            {divider === 1 ? "" : "Chaque neurone visible représente " + divider }
        </div>
    }

    return (
        <>
            {Test()}
            <Canvas raycaster={raycaster} camera={{fov: 75, position: [spacing * -4, 0, 20 * topology.length / 2]}}>
                <pointLight position={[64, 64, 64]}/>
                <ambientLight intensity={1} color={'#bcd9ff'}/>
                <OrbitControls target={[0, 0, spacing * topology.length/2 - 5]}/>
                <ThreeNeuralNet topology={topology} spacing={spacing} filter={0} maxNeuronPerLayer={10}
                                clickedStates={clickedStates} hoveredStates={hoveredStates}
                                hasInput={hasInput}
                                hasOutput={hasOutput}
                                forceUpdate={forceUpdate}
                                currentPath={currentPath}
                />
            </Canvas>

        </>

    );
}