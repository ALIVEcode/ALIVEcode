import * as THREE from "three";
import React, { useRef } from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {ThreeNeuralNet} from "./AIVisualNeuralNet";
import {useForceUpdate} from "../../../../../state/hooks/useForceUpdate";
import {
    NNHyperparameters,
    NNModelParams
} from "../../../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces";


type NNProps = {
    hyperparameters: NNHyperparameters
    spacing: number
    filter: number
    maxNeuronPerLayer: number
    layerParams : NNModelParams
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

        const typeClicked = currentPath.current.split(':').length === 3 ? "Poid" : "Neurone";
        let layerClicked: string;
        let fromClicked: string
        let toClicked: string = ""
        layerClicked = ((+currentPath.current.split(':')[0]) - 1).toString();

        const layerNum = parseInt(layerClicked) - 1;

        let selections = []
        if (divider !== 1) {
            for (let i = 0; i < divider; i++) {
                selections.push(<option value={i}>Neurone #{i+1}</option>)
            }
        }

        const index = parseInt(currentPath.current.split(':')[1]) - 1

        layerClicked += (layerClicked === "1" ? "re" : "e");
        //console.log(layerClicked)
        if (layerClicked === "0e") {
            layerClicked = "Couche d'entr\u00E9e"
        } else if (layerClicked === topology.length - 1 + "e") {
            layerClicked = "Couche de sortie"
        }

        fromClicked = currentPath.current.split(':')[1]
        if (typeClicked === "Poid") {
            toClicked = currentPath.current.split(':')[2]
        }

        const typeHovered = currentHoveredPath.current.split(':').length === 3 ? "Poid" : "Neurone";
        let layerHovered: string;
        layerHovered = ((+currentHoveredPath.current.split(':')[0]) - 1).toString();

        // console.log(props.layerParams.layerParams)

        // @ts-ignore
        return (<>
            {
                divider > 1 ?
                    <div className={"bg-gray-600 absolute top-[7%] left-[50.5%] p-2"}>
                        {(typeClicked === "Neurone" ? "La neurone" : "Le poid")
                            + " sélectionné" + (typeClicked === "Neurone" ? "e " : "")
                            + " équivaut à " + divider + " " + typeClicked.toLocaleLowerCase() + "s"}
                        <br/>
                        <div>
                            <select className={"p-2 p{r}-4"} name={"Neurone choisi"} onChange={(e) => {

                            }}>
                                {
                                    selections
                                }
                            </select>
                        </div>
                    </div> : null
            }

            {
                (currentHoveredPath.current === "" && currentPath.current === "") ? null :
                    <> {
                        currentPath.current === "" ? null :
                            <div className={"absolute top-[7%] bg-gray-500 right-[0.6%] p-2"}>
                                {
                                    <>
                                        Neurone de la {
                                            layerClicked === "couche d'entr\u00E9e" ? layerClicked :
                                                layerClicked === "couche de sortie" ?
                                                    layerClicked : layerClicked + " couche"
                                        }
                                    </>
                                }
                                <br/>

                                {
                                    (currentPath.current.split(':').length === 3 ?
                                        <>
                                            Poid entre la
                                            couche {layerNum + 1 === 0 ? "d'entr\u00E9e " : "cach\u00E9e #" + (layerNum + 1)}
                                            et la
                                            couche {layerNum + 3 === topology.length ? "de sortie " : "cach\u00E9e #" + (layerNum + 2)}
                                            <br/>

                                            {/*{layerNum+1 } | {parseInt(toClicked)-1} : {index}*/}
                                            Valeur
                                            : {props.layerParams.layerParams[layerNum + 1].weights[parseInt(toClicked) - 1][index]}
                                        </> :

                                        <>
                                            Neurone #{index + 1}
                                            <br/>
                                            {
                                                layerNum === -1 ? <> Entrée </> :
                                                    <> Biais
                                                        : {props.layerParams.layerParams[layerNum].biases[index]} </>
                                            }
                                        </>)
                                }


                                {/*{*/}
                                {/*    currentHoveredPath.current === "" ? null :*/}
                                {/*        <div className={"bg-gray-400 p-2 absolute text-right right-2 "}>*/}
                                {/*            {*/}
                                {/*                (currentHoveredPath.current.split(':').length === 3 ? "Poid " : "Neurone ")*/}
                                {/*                + currentHoveredPath.current*/}
                                {/*            }*/}
                                {/*        </div>*/}
                                {/*}*/}

                            </div>
                        }
                        {

                        }
                        </>

            }
        </>)
    }

    return (
        <>
            <Canvas raycaster={raycaster} camera={{fov: 75, position: [spacing * -2, 0, spacing * ((topology.length-1) / 2)]}}>
                <pointLight position={[64, 64, 64]}/>
                <ambientLight intensity={1} color={'#bcd9ff'}/>
                <OrbitControls target={[0, 0, spacing * ((topology.length-1) / 2)]} />
                <ThreeNeuralNet topology={topology} spacing={spacing} filter={0} maxNeuronPerLayer={10}
                                clickedStates={clickedStates} hoveredStates={hoveredStates}
                                hasInput={hasInput} hasOutput={hasOutput}
                                forceUpdate={forceUpdate}
                                currentHoveredPath={currentHoveredPath}
                                currentPath={currentPath}
                />
                {/*<Neuron*/}

                {/* clickedStates={clickedStates} currentHoveredPath={currentHoveredPath}*/}
                {/* currentPath={currentPath} filledLevel={2}*/}
                {/* forceUpdate={forceUpdate}*/}
                {/* full={true}*/}
                {/* hoveredStates={hoveredStates} index={0} path={""}*/}
                {/* position={new Vector3(0, 0, spacing * ((topology.length-1) / 2))} radius={2}/>*/}
            </Canvas>

            {
                AAAMenu()
            }

        </>

    )
}