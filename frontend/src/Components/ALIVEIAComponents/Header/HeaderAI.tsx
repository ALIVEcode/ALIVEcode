import { useTranslation } from 'react-i18next';
import brainImage from '../../../assets/images/ai/IA.png';
/**
 * Ce composant correspond à l'en-tête de la page d'accueil de la section IA du site web.
 * Elle comprend donc le titre de la page, sa description et l'image de fond.
 */

/**
 * Méthode retournant le HeaderAI défini par cette méthode même et ses propriétés CSS.
 * @param props aucune propriété pour ce composant.
 * @returns un HeaderAI.
 */
const HeaderAI = (props: any) => {
	const { t } = useTranslation();

	return (
		<div
			className="flex w-full flex-col laptop:flex-row py-10 px-10 tablet:px-12 laptop:px-16 desktop:px-20  text-white"
			style={{ background: 'var(--headerAIBack-color)' }}
		>
			<div className="w-full laptop:w-7/12 py-5">
				<label className="text-4xl tablet:text-6xl laptop:text-7xl mb-5">
					{t('ai.header.title')}
				</label>
				<p className="text-sm tablet:text-base desktop:text-lg">
					{t('ai.header.description')}
				</p>
			</div>
			<div className="w-full laptop:w-5/12 flex items-center justify-center">
				<img
					className="w-3/4 tablet:w-1/3 laptop:w-full h-auto"
					alt="Electrical and mechanical brain"
					src={brainImage}
				></img>
			</div>
		</div>
	);
};

export default HeaderAI;
