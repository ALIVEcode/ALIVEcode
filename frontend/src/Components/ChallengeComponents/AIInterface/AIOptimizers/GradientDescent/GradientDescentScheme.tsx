// noinspection JSSuspiciousNameCombination

import {GradientDescentSchemeProps} from "./GradientDescentSchemeProps"
import "./GradientDescentScheme.css"
import React from "react";

import "katex/dist/katex.css"
let Latex = require("react-latex");

const GOlDEN_RATIO = 1.6180339887498948482045868343656;

const ARROW_MARKER_WIDTH = 10;
const ARROW_MARKER_HEIGHT = 7;
const ARROW_SPACING = 2;

// TODO: Implement this better.
const BUTTON_HEIGHT = 15; // Same as in CSS.

let currentLayer: number;
let maxLayer: number;

function dZdJCommonText(currentLayer: number, msg:string): string {
  return "Évaluer la dérivée de la fonction de coût par rapport aux sorties brutes de la couche " + msg + " (" + currentLayer + ")";
}

const COLOR_BLACK = "#000000";
const COLOR_BLUE = "#4472C4";
const COLOR_GREEN = "#70AD47";
const COLOR_YELLOW = "#FFC000";
const COLOR_ORANGE = "#ED7D31";

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

const makeRectP = (text: string): JSX.Element => {
  return (
    <p className="gradient-descent-scheme-p gradient-descent-scheme-text">{text}</p>
  );
}

const makeRectEquation = (eqLatex: string): JSX.Element => {
  return (
    <div className="gradient-descent-scheme-eq" style={{display: "none" }}>
      <Latex>
        {eqLatex}
      </Latex>
    </div>
  );
}

const makeRect = (x: number, y: number, color: string, text: string, eqLatex: string, width:number=65, widthToHeightRatio:number=GOlDEN_RATIO, className:string|undefined=undefined, drawPos:DrawPosition=DrawPosition.CENTER_CENTER, rx:number=5): JSX.Element => {
  let height = width / widthToHeightRatio;

  const [xAdjust, yAdjust] = alignDrawPosition(width, height, drawPos)
  x -= xAdjust;
  y -= yAdjust;

  return (
    <g>
      <rect className={className} x={x} y={y} width={width} height={height} rx={rx} style={{ fill: color }}></rect>
      <foreignObject className={className} x={x} y={y} width={width} height={height}>
        {makeRectP(text)}
        {makeRectEquation(eqLatex)}
      </foreignObject>
    </g>
  );
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

const makeButton = (x: number, y: number, text: string, onClick:React.MouseEventHandler<HTMLButtonElement>|undefined=undefined, drawPos: DrawPosition = DrawPosition.TOP_LEFT) => {
  // TODO: Implement other cases.
  switch (drawPos) {
  case DrawPosition.TOP_LEFT: {
    y++;
    break
  } case DrawPosition.BOTTOM_LEFT: {
    y -= BUTTON_HEIGHT;
    break;
  }}

  return (
    <foreignObject x={x} y={y} width="100" height="50">
      <button type="button" className="gradient-descent-scheme-text gradient-descent-scheme-button" onClick={onClick}>{text}</button>
    </foreignObject>
  )
}

function updatedJdZCommonText() {
  document.getElementsByClassName("gradient-descent-scheme-dJdZ")[1].getElementsByTagName("p")[0].innerHTML = dZdJCommonText(currentLayer, "actuelle");
  document.getElementsByClassName("gradient-descent-scheme-dJdZMinus1")[1].getElementsByTagName("p")[0].innerHTML = dZdJCommonText(currentLayer - 1,"précédente");
}

let textModeOn = true;
function toggleMathMode() {
  textModeOn = !textModeOn;

  let ps = document.getElementsByClassName("gradient-descent-scheme-p") as HTMLCollectionOf<HTMLElement>;
  let eqs = document.getElementsByClassName("gradient-descent-scheme-eq") as HTMLCollectionOf<HTMLElement>;

  let pDisplay: string;
  let eqDisplay: string;
  if (textModeOn) {
    pDisplay = "table-cell";
    eqDisplay = "none";
  } else {
    pDisplay = "none";
    eqDisplay = "inline";
  }

  for (let i = 0; i < ps.length; i++) { // ps.length === eqs.length
    ps[i].style.display = pDisplay;
    eqs[i].style.display = eqDisplay;
  }
}

function transitionToNextLayer() {
  if (currentLayer === maxLayer) return;

  currentLayer++;

  //let dJdZMinus1Children = document.getElementsByClassName("gradient-descent-scheme-dJdZminus1");
  updatedJdZCommonText();
}

function transitionToPreviousLayer() {
  if (currentLayer === 0) return;

  currentLayer--;

  //let dJdZMinus1Children = document.getElementsByClassName("gradient-descent-scheme-dJdZminus1");
  updatedJdZCommonText();
}

const GradientDescentScheme = (props: GradientDescentSchemeProps) => {
  maxLayer = props.layerCount - 1;
  currentLayer = maxLayer;

  const J = makeRect(350, 30, COLOR_BLUE, "Fonction de coût", "$$J(W, B)$$")
  const dJdZ = makeRect(350, 100, COLOR_BLUE, dZdJCommonText(currentLayer, "actuelle"), `$$\\frac{\\partial J}{\\partial W_${currentLayer}} = \\hat{Y} - Y$$`, 86, 2, "gradient-descent-scheme-dJdZ");
  const dJdW = makeRect(250, 30, COLOR_GREEN, "Évaluer la dérivée de la fonction de coût par rapport aux poids", `$$J(W, B)$$`);
  const dJdB = makeRect(250, 170, COLOR_ORANGE, "Évaluer la dérivée de la fonction de coût par rapport aux biais", `$$J(W, B)$$`);
  const adjustW = makeRect(150, 30, COLOR_GREEN, "Ajustement des poids", `$$J(W, B)$$`);
  const adjustB = makeRect(150, 170, COLOR_ORANGE, "Ajustement des biais", `$$J(W, B)$$`);
  const dJdZMinus1 = makeRect(50, 100, COLOR_YELLOW, dZdJCommonText(currentLayer - 1, "précédente"), `$$J(W, B)$$`, 86, 2, "gradient-descent-scheme-dJdZMinus1");

  const alpha = makeRect(150, 100, COLOR_BLACK, "Taux d'apprentissage",`$$J(W, B)$$`, 50);
  const aMinus1 = makeRect(250, 100, COLOR_BLACK, "Activations de la couche précédente",`$$J(W, B)$$`, 50);
  const activationF = makeRect(50, 50, COLOR_BLACK, "Fonction d'activation",`$$J(W, B)$$`, 40);

  const dJdZMinus1X = getRectProps(dJdZMinus1).x;
  const lowerButtonProps = getRectProps(adjustB)
  const lowerButtonsY = lowerButtonProps.y + lowerButtonProps.height;
  const dJdZProps = getRectProps(dJdZ);

  return (
    <div className="gradient-descent-scheme">
      <svg className="gradient-descent-scheme" viewBox="0 0 400 200">
        <>
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
          {activationF}

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
          {makeArrowTieRects(activationF, DrawPosition.BOTTOM_CENTER, dJdZMinus1, DrawPosition.TOP_CENTER)}

          {makeButton(dJdZMinus1X, getRectProps(adjustW).y, "Mode mathématique", toggleMathMode)}
          {makeButton(dJdZMinus1X, lowerButtonsY, "< Couche précédente", transitionToPreviousLayer, DrawPosition.BOTTOM_LEFT)}
          {/* TODO: Find a way to get the width of the button other than hard coding it. */}
          {makeButton(dJdZProps.x + dJdZProps.width - 57.9224, lowerButtonsY, "Couche suivante >", transitionToNextLayer, DrawPosition.BOTTOM_LEFT)}
        </>
      </svg>
    </div>
  );
}

export default GradientDescentScheme;