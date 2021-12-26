import { Col, Row } from 'react-bootstrap';
import CardContainer from '../../UtilsComponents/CardContainer/CardContainer';
import Card from '../../UtilsComponents/Cards/Card/Card';
import { useTranslation } from 'react-i18next';
const NewActivityContentModal = () => {
	const { t } = useTranslation();

	return (
		<Row lg={5}>
			<Col style={{ margin: '0px' }}>
				<Card
					style={{ fontSize: 'small' }}
					title={t('activity.content.editor')}
				/>
			</Col>
			<Col>
				<Card style={{}} />
			</Col>
		</Row>
	);
};

export default NewActivityContentModal;
