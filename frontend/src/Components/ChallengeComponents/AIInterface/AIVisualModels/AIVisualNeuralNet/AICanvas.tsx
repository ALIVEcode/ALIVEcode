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

    const divider = biggestLayer>props.maxNeuronPerLayer ? Math.floor(biggestLayer / props.maxNeuronPerLayer): 1;


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



    const currentPath = useRef("");
    const currentHoveredPath = useRef("");
    const forceUpdate = useForceUpdate();

    function AAAMenu() {

        const typeClicked = currentPath.current.split(':').length === 3 ? "Poid": "Neurone";
        let layerClicked: string;
        let fromClicked : string
        let toClicked : string = ""
        layerClicked = ((+currentPath.current.split(':')[0])-1).toString();
        layerClicked += (layerClicked === "1" ? "re" : "e");
        fromClicked = currentPath.current.split(':')[1]
        if(typeClicked==="Poid") {
            toClicked = currentPath.current.split(':')[2]
        }

        const typeHovered = currentHoveredPath.current.split(':').length === 3 ? "Poid": "Neurone";
        let layerHovered: string;
        let fromHovered : string
        let toHovered : string = ""
        layerHovered = ((+currentHoveredPath.current.split(':')[0])-1).toString();
        layerHovered += (layerHovered === "1" ? "re" : "e");
        fromHovered = currentHoveredPath.current.split(':')[1]
        if(typeHovered==="Poid") {
            toHovered = currentHoveredPath.current.split(':')[2]
        }


        return <div className={"absolute right-10 bg-black" + ((currentHoveredPath.current === "" && currentPath.current === "") ? "hidden": "visible" )}>

            {currentPath.current === "" ? null :
                <div className={"bg-black p-2"}>
                    {
                        divider > 1 ? <div>
                            {(typeClicked === "Neurone" ? "La neurone": "Le poid")
                            + " sélectionné"+ (typeClicked === "Neurone" ? "e ": "")
                            + " équivaut à " + divider + " " + typeClicked.toLocaleLowerCase() + "s"}
                        </div> : null
                    }

                    {
                        layerClicked + " couche"
                    }
                    <br />
                    {
                        (currentPath.current.split(':').length === 3 ? "Poid ": "Neurone ")
                        + currentPath.current
                    }
                </div>
            }

            {currentHoveredPath.current === "" ? null :
                <div className={"bg-black p-5"}>
                    {
                        layerHovered + " couche"
                    }
                    <br />
                    {
                        (currentHoveredPath.current.split(':').length === 3 ? "Poid ": "Neurone ")
                        + currentHoveredPath.current
                    }
                </div>}
        </div>
    }

    return (
        <>
            {AAAMenu()}
            <Canvas raycaster={raycaster} camera={{fov: 75, position: [spacing * -4, 0, 20 * topology.length / 2]}}>
                <pointLight position={[64, 64, 64]}/>
                <ambientLight intensity={1} color={'#bcd9ff'}/>
                <OrbitControls target={[0, 0, spacing * topology.length/2 - 5]}/>
                <ThreeNeuralNet topology={topology} spacing={spacing} filter={0} maxNeuronPerLayer={10}
                                clickedStates={clickedStates} hoveredStates={hoveredStates}
                                hasInput={hasInput} hasOutput={hasOutput}
                                forceUpdate={forceUpdate}
                                currentHoveredPath={currentHoveredPath}
                                currentPath={currentPath}
                />
            </Canvas>

        </>

    );
}