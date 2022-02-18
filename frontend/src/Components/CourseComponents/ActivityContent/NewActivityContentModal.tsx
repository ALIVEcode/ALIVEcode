import Card from '../../UtilsComponents/Cards/Card/Card';
import { useTranslation } from 'react-i18next';
const NewActivityContentModal = () => {
	const { t } = useTranslation();

	return (
		<div>
			<div style={{ margin: '0px' }}>
				<div
					style={{ fontSize: 'small' }}
					title={t('activity.content.editor')}
				/>
			</div>
			<div>
				<Card style={{}} />
			</div>
		</div>
	);
};

export default NewActivityContentModal;
