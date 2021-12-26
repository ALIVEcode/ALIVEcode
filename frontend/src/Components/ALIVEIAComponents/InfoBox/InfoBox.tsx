import { useState } from 'react';
import { InfoBoxProps } from './infoBoxTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'react-bootstrap';
import styled from 'styled-components';

/**
 * Ce composant définit une boîte d'information contenant un titre et une description.
 * La description peut se rétracter à l'aide d'un bouton. Plus tard, la possibilité de
 * rajouter des images sera ajoutée.
 */

const StyledDiv = styled.div`
.container {
  width: auto;
  margin: 7vh 100px;
  border-style: solid;
  border-radius: 20px;
  border-width: 4px;
  border-color: var(--foreground-color);
  background-color: var(--background-color);
  padding: 0;
}

.section-head {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-left: 3vw;
  padding-right: 3vw;
  padding-bottom: var(--padding-top-bottom-titles);
  padding-top: var(--padding-top-bottom-titles);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  color: white;
  
  border-width: 4px;
  background: rgb(255,255,255);
  background: var(--headerAIBack-color);
}

.section-open {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-style: solid;
}

.section-close {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px; 
  border-bottom-style: none;
}

.section-title {
  font-size: 5vh;
}

.section-description {
  font-size: 20px;
  text-align: justify;
  padding-left: 3vw;
  padding-right: 3vw;
  padding-top: 25px;
  padding-bottom: 25px;
}

.collapse-button {
  font-size: 100px;
  cursor: pointer;
  transition: 0.1s;
}

.collapse-button:hover {
  color: var(--contrast-color);
}
`

/**
 * Méthode retournant l'InfoBox défini par la méthode ci-dessous ainsi que ses propriétés CSS.
 * @param props les propriétés de l'InfoBox :
 *  - title: le titre de l'InfoBox.
 *  - children: les éléments contenus dans l'InfoBox.
 * @returns un Infobox.
 */
const InfoBox = (props: InfoBoxProps) => {
  const [open, setOpen] = useState(true);

  return (
    <StyledDiv>
      <div className="container ">
        <div className={"section-head section-open " + (open ? "section-open" : "section-close")}>
          <h2 className="section-title">{props.title}</h2>
          <FontAwesomeIcon 
            scale="10px"
            className="collapse-button" 
            icon={faCaretUp}
            rotation={open ? undefined : 180}
            onClick={() => setOpen(!open)}
            aria-controls="section-description"
            aria-expanded={open}
          />
        </div>
        <Collapse in={open}>
          <div className="section-description">{props.children}</div>
        </Collapse>
      </div>
    </StyledDiv>

  );
}

export default InfoBox