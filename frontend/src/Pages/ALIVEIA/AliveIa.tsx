import { AliveIaProps } from './AliveIaTypes';
import { useTranslation } from 'react-i18next';
import HeaderAI from '../../Components/ALIVEIAComponents/Header/HeaderAI';
import InfoBox from '../../Components/ALIVEIAComponents/InfoBox/InfoBox';

/**
 * Home page of the AI section. It contains all components visible inside this page.
 * @param props no props for this component.
 */
const AliveIa = (props: AliveIaProps) => {
  const {t} = useTranslation();

  return (
    <>
      <HeaderAI/>
      <InfoBox 
        title={t("ai.section.artificial-intelligence.title")} 
        children={
          <div>
            <p>{t("ai.section.artificial-intelligence.paragraph1")}</p>
            <br/>
            <p>{t("ai.section.artificial-intelligence.paragraph2")}</p>
            <ul>
              <li>{t("ai.section.artificial-intelligence.point1")}</li>
              <li>{t("ai.section.artificial-intelligence.point2")}</li>
              <li>{t("ai.section.artificial-intelligence.point3")}</li>
              <li>{t("ai.section.artificial-intelligence.point4")}</li>
            </ul>
            <p>{t("ai.section.artificial-intelligence.paragraph3")}</p>
          </div>
        }
      />

      <InfoBox 
        title={t("ai.section.machine-learning.title")} 
        children={
          <div>
            <p>{t("ai.section.machine-learning.paragraph1")}</p>
            <br/>
            <p>{t("ai.section.machine-learning.paragraph2")}</p>
          </div>
        }
      />

      <InfoBox
        title={t("ai.section.deep-learning.title")} 
        children={
          <div>
            <p>{t("ai.section.deep-learning.paragraph1")}</p>
            <br/>
            <p>{t("ai.section.deep-learning.paragraph2")}</p>
            <br/>
            <p>{t("ai.section.deep-learning.paragraph3")}</p>
            <ol>
              <li>{t("ai.section.deep-learning.point1")}</li>
              <li>{t("ai.section.deep-learning.point2")}</li>
              <li>{t("ai.section.deep-learning.point3")}</li>
            </ol>
            <p>{t("ai.section.deep-learning.paragraph4")}</p>
          </div>
        }
      />
    </>
  );
}

export default AliveIa;