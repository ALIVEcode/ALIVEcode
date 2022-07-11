// noinspection JSSuspiciousNameCombination

import {GradientDescentSchemeProps} from "./GradientDescentSchemeProps"
import "./GradientDescentScheme.css"
import React from "react";

const GOlDEN_RATIO = 1.6180339887498948482045868343656;

const ARROW_MARKER_WIDTH = 10;
const ARROW_MARKER_HEIGHT = 7;
const ARROW_SPACING = 3;

namespace COLOR {
  export const BLACK = "#000000";
  export const BLUE = "#4472C4";
  export const GREEN = "#70AD47";
  export const YELLOW = "#FFC000";
  export const ORANGE = "#ED7D31";
}

enum DrawPosition {
  TOP_LEFT,
  TOP_CENTER,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_CENTER,
  BOTTOM_RIGHT,
  CENTER_LEFT,
  CENTER_RIGHT,
  CENTER_CENTER
}

function alignDrawPosition(width: number, height: number, drawPos: DrawPosition): [number, number] {
  // TODO: Implement all possible cases
  let xAdjust: number = 0;
  let yAdjust: number = 0;
  if (drawPos === DrawPosition.TOP_CENTER || drawPos === DrawPosition.CENTER_CENTER || drawPos === DrawPosition.BOTTOM_CENTER) {
    xAdjust = width / 2;
  }
  if (drawPos === DrawPosition.TOP_RIGHT || drawPos === DrawPosition.CENTER_RIGHT || drawPos === DrawPosition.BOTTOM_RIGHT) {
    xAdjust = width;
  }

  if (drawPos === DrawPosition.CENTER_LEFT || drawPos === DrawPosition.CENTER_CENTER || drawPos === DrawPosition.CENTER_RIGHT) {
    yAdjust = height / 2;
  }
  if (drawPos === DrawPosition.BOTTOM_LEFT || drawPos === DrawPosition.BOTTOM_CENTER || drawPos === DrawPosition.BOTTOM_RIGHT) {
    yAdjust = height;
  }

  // @ts-ignore
  return [xAdjust, yAdjust];
}

const makeRect = (x: number, y: number, color: string, msg: string, width:number=65, widthToHeightRatio:number=GOlDEN_RATIO, drawPos:DrawPosition=DrawPosition.CENTER_CENTER, rx:number=5): JSX.Element => {
  let height = width / widthToHeightRatio;

  const [xAdjust, yAdjust] = alignDrawPosition(width, height, drawPos)
  x -= xAdjust;
  y -= yAdjust;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={rx} style={{ fill: color }}></rect>
      <foreignObject x={x} y={y} width={width} height={height}>
        <p className="rectText" style={{ width: width, height: height }}>{msg}</p>
      </foreignObject>
    </g>
  )
}

const makeArrow = (x1: number, y1: number, x2: number, y2: number): React.SVGProps<SVGLineElement> => {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1} stroke="#000" markerEnd="url(#arrowHead)" />
  )
}

const getRectProps = (rect: JSX.Element) => {
  return rect.props.children[0].props;
}

const makeArrowTieRects = (rect1: any, endPointPos1: DrawPosition, rect2: any,  endPointPos2: DrawPosition): React.SVGProps<SVGLineElement> => {
  const rect1Props = getRectProps(rect1);
  const rect2Props = getRectProps(rect2);

  const [x1Adjust, y1Adjust] = alignDrawPosition(rect1Props.width, rect1Props.height, endPointPos1);
  const [x2Adjust, y2Adjust] = alignDrawPosition(rect2Props.width, rect2Props.height, endPointPos2);

  const x1 = rect1Props.x + x1Adjust;
  const y1 = rect1Props.y + y1Adjust;
  const x2 = rect2Props.x + x2Adjust;
  const y2 = rect2Props.y + y2Adjust;

  let xCorrection;
  let yCorrection;
  const deltaX = x2 - x1;
  if (deltaX === 0) {
    xCorrection = 0;
    yCorrection = ARROW_MARKER_WIDTH;
    if (y2 > y1) yCorrection *= -1;
  } else {
    const slope = (y2 - y1) / deltaX;
    xCorrection = ARROW_MARKER_WIDTH / Math.sqrt(1 + slope**2);  // = cos(arctan(slope))
    yCorrection = slope * xCorrection;  // = sin(arctan(slope))
  }

  return makeArrow(x1, y1, x2 + xCorrection, y2 + yCorrection);
}

const GradientDescentScheme = (props: GradientDescentSchemeProps) => {
  const J = makeRect(350, 30, COLOR.BLUE, "Fonction de coût")
  const dJdZ = makeRect(350, 100, COLOR.BLUE, "Évaluer la dérivée de la fonction de coût par rapport aux sorties brutes de la couche actuelle",80, 2);
  const dJdW = makeRect(250, 30, COLOR.GREEN, "Évaluer la dérivée de la fonction de coût par rapport aux poids");
  const dJdB = makeRect(250, 170, COLOR.ORANGE, "Évaluer la dérivée de la fonction de coût par rapport aux poids");
  const adjustW = makeRect(150, 30, COLOR.GREEN, "Ajustement des poids");
  const adjustB = makeRect(150, 170, COLOR.ORANGE, "Ajustement des biais");
  const dJdZMinus1 = makeRect(50, 100, COLOR.YELLOW, "Évaluer la dérivée de la fonction de coût par rapport aux sorties brutes de la couche précédente",80, 2);

  const alpha = makeRect(150, 100, COLOR.BLACK, "Taux d'apprentissage", 50);
  const aMinus1 = makeRect(250, 100, COLOR.BLACK, "Activations de la couche précédente", 50);

  return (
    <div className="scheme">
      <svg className="scheme" viewBox="0 0 400 200">
        {/* For designing purposes */}
        <rect width="400" height="200" style={{ fill:"none", strokeWidth:1, stroke:"black" }} />

        <defs>
          <marker id="arrowHead" markerWidth={ARROW_MARKER_WIDTH} markerHeight={ARROW_MARKER_HEIGHT} refX="0" refY="3.5" orient="auto">
            <polygon points={`0 0, ${ARROW_MARKER_WIDTH} ${ARROW_MARKER_HEIGHT / 2}, 0 ${ARROW_MARKER_HEIGHT}`} />
          </marker>
        </defs>

        {J}
        {dJdZ}
        {dJdW}
        {dJdB}
        {adjustW}
        {adjustB}
        {dJdZMinus1}

        {alpha}
        {aMinus1}

        {makeArrowTieRects(J, DrawPosition.BOTTOM_CENTER, dJdZ, DrawPosition.TOP_CENTER)}
        {makeArrowTieRects(dJdZ, DrawPosition.TOP_LEFT, dJdW, DrawPosition.BOTTOM_RIGHT)}
        {makeArrowTieRects(dJdZ, DrawPosition.BOTTOM_LEFT, dJdB, DrawPosition.TOP_RIGHT)}
        {makeArrowTieRects(dJdW, DrawPosition.CENTER_LEFT, adjustW, DrawPosition.CENTER_RIGHT)}
        {makeArrowTieRects(dJdB, DrawPosition.CENTER_LEFT, adjustB, DrawPosition.CENTER_RIGHT)}
        {makeArrowTieRects(adjustW, DrawPosition.BOTTOM_LEFT, dJdZMinus1, DrawPosition.TOP_RIGHT)}
        {makeArrowTieRects(adjustB, DrawPosition.TOP_LEFT, dJdZMinus1, DrawPosition.BOTTOM_RIGHT)}

        {makeArrowTieRects(alpha, DrawPosition.TOP_CENTER, adjustW, DrawPosition.BOTTOM_CENTER)}
        {makeArrowTieRects(alpha, DrawPosition.BOTTOM_CENTER, adjustB, DrawPosition.TOP_CENTER)}
        {makeArrowTieRects(aMinus1, DrawPosition.TOP_CENTER, dJdW, DrawPosition.BOTTOM_CENTER)}
      </svg>
    </div>
  );
}

export default GradientDescentScheme;