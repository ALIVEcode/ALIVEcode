import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import brainImage from "../../../assets/images/ai/IA.png";
/**
 * Ce composant correspond à l'en-tête de la page d'accueil de la section IA du site web. 
 * Elle comprend donc le titre de la page, sa description et l'image de fond.
 */

//CSS de HeaderAI
const StyledHeader = styled.div`
    width: 100%;
    height: 70vh;
    background: rgb(255,255,255);
    background: var(--headerAIBack-color);
    display: flex;
    flex-direction: row;

  .header-text {
    display: flex;
    flex-direction: column;

    padding: 8vh 5vw;
    color: #ffffffbe;
  }

  .title {
    font-size: 8vh;
  }

  .presentation-paragraph {
    font-size: 14px;
    color: #ffffffbe;
  }

  .brain-img {
    height: 70vh;
    padding-right: 5vw;
  }

  @media screen and (max-width: 1300px) {
    & {
      height: 90vh;
    }
    .presentation-paragraph {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 800px) {
    & {
      height: 110vh;
    }
    .presentation-paragraph {
      font-size: 9px;
    }
  }
`
/**
 * Méthode retournant le HeaderAI défini par cette méthode même et ses propriétés CSS.
 * @param props aucune propriété pour ce composant.
 * @returns un HeaderAI.
 */
const HeaderAI = (props:any) => {
  const {t} = useTranslation();

  return (
    <StyledHeader>
      <div className="header-text">
        <h1 className="title">
          {t('ai.header.title')}
        </h1>
        <p className="presentation-paragraph">
          {t('ai.header.description')}
        </p>
      </div>
      <img className="brain-img" alt="Electrical and mechanical brain" src={brainImage}></img>
    </StyledHeader>
  );
}

export default HeaderAI