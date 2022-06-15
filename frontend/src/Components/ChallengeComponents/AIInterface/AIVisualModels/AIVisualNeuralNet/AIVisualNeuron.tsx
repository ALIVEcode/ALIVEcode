import React, {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {Vector3} from "three";
import {Color, MeshProps} from "@react-three/fiber";
import {useForceUpdate} from "../../../../../state/hooks/useForceUpdate";


type NeuronData = {
    clickedStates: MutableRefObject<boolean[]>
    updateClickedStates: any
    hoveredStates: MutableRefObject<boolean[]>
    updateHoveredStates: any

    index: number
    // updatePath:any
    currentPath:any

    position:Vector3;
    path: string;
    radius: number;
    full: boolean;
    filledLevel: number;

    forceUpdate:any;
}
type CustomSphereProps = MeshProps & NeuronData & {
    colors: Color[];
}

const Sphere = (props : CustomSphereProps) => {

    const ref = useRef()

    const [clicked, click] = useState(false)
    const [hovered, hover] = useState(false)

    // let fakeStates = new Array(props.clickedStates.length)
    // fakeStates.fill(false)
    // fakeStates[props.identifier] = true;

    useEffect(()=>{
        console.log(props.clickedStates.current)
        console.log(props.hoveredStates.current)
    })
    return (
        <>
            <mesh position={props.position}
                  ref={ref}
                  onClick={(event) => {
                      event.stopPropagation()

                      props.clickedStates.current[props.index] = !props.clickedStates.current[props.index]
                      props.currentPath.current = props.path

                      props.forceUpdate()
                      // click(!clicked)

                      // if(props.clickedStates.current[props.index])


                  }}
                  onPointerMissed={(event) => {
                      event.stopPropagation()
                      props.clickedStates.current.fill(false)

                      props.forceUpdate()
                      // click(false)
                  }}
                  onPointerOver={(event) => {
                      event.stopPropagation()
                      props.hoveredStates.current[props.index] = true
                      // hover(true)
                      props.forceUpdate()
                  }}
                  onPointerOut={(event) => {
                      event.stopPropagation()
                      props.hoveredStates.current[props.index] = false
                      // if(props.clickedStates.current.indexOf(true) === -1) {
                      //     props.hoveredStates.current.fill(false)
                      //     //props.hoveredStates.current[props.index] = true
                      // }
                      // else {
                      //     props.hoveredStates.current.fill(false)
                      //
                      // }
                      // hover(false)
                      props.forceUpdate()
                  }}>
                <sphereGeometry attach="geometry" args={[3, 16, 16]} />
                <meshStandardMaterial
                    transparent
                    opacity={ props.full ? 1 : 0.5 }
                    color={(props.clickedStates.current[props.index] ?
                            (props.hoveredStates.current[props.index] ? props.colors[2] : "red") :
                            props.hoveredStates.current[props.index] ? props.colors[1] : props.colors[0])}
                />
            </mesh>
            { props.full ? <> </> :
                <mesh
                    {...props}>
                    <sphereGeometry
                        // Taille de la sphère
                        attach={"geometry"} args={[props.filledLevel * 2.9 + 0.1,16,16 ]} />
                    <meshStandardMaterial
                        // Ce à quoi la sphère ressemble
                        color={props.clickedStates.current[props.index] ? (props.clickedStates.current[props.index] ? props.colors[2] : props.colors[1]) :
                            (props.hoveredStates.current[props.index] ? props.colors[1] : props.colors[0])}
                    />
                </mesh> }
        </>

    );
}
export const Neuron = (props: NeuronData) => {
    return (
        <Sphere
            forceUpdate={props.forceUpdate}
            clickedStates={props.clickedStates}
            updateClickedStates={props.updateClickedStates}
            hoveredStates={props.hoveredStates}
            updateHoveredStates={props.updateHoveredStates}

            // updatePath={props.updatePath}
            currentPath={props.currentPath}
            index={props.index}

            filledLevel={props.filledLevel}
            full={props.full}
            radius={props.radius}
            colors={['#4a5f70','#337ef5', '#2ba3f8']}
            position={props.position}
            type={"Neuron"}
            path={props.path}
         />
    )
}