import { ClassroomHeaderProps, StyledClassroomHeader } from './classroomHeaderTypes';
import { Alert, Badge, Col, Row } from 'react-bootstrap';
import Button from '../../UtilsComponents/Button/Button';
import { useContext, useState } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { Professor } from '../../../Models/User/user.entity';
import api from '../../../Models/api';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { useAlert } from 'react-alert';
import Modal from '../../UtilsComponents/Modal/Modal';
import { prettyField } from '../../../Types/formatting';

/**
 * Classroom header that displays the className, the professor and
 * some actions buttons
 *
 * @param {Classroom} classroom classroom object
 *
 * @author MoSk3
 */
const ClassroomHeader = ({ classroom }: ClassroomHeaderProps) => {
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const history = useHistory();
	const alert = useAlert();
	const [codeModalOpen, setCodeModalOpen] = useState(false);

	const leaveClassroom = async () => {
		if (!user) return;
		try {
			await api.db.classrooms.leave({
				classroomId: classroom.id,
				studentId: user.id,
			});
			history.push(routes.auth.dashboard.path);
		} catch {
			return alert.error(t('error.505'));
		}
	};

	return (
		<StyledClassroomHeader>
			<Row>
				<Col lg id="classroom-title">
					<h2>{classroom.name}</h2>
					<h5>
						<Badge>{prettyField(t('msg.professor'))}</Badge>{' '}
						{classroom.creator.getDisplayName()}
					</h5>
				</Col>
				{user instanceof Professor ? (
					<Col lg id="classroom-buttons">
						<div>
							<Button onClick={() => setCodeModalOpen(true)} variant="primary">
								{t('classroom.add_students')}
							</Button>
						</div>
						<div>
							<Button variant="danger">{t('classroom.delete')}</Button>
						</div>
					</Col>
				) : (
					<Col lg id="classroom-buttons">
						<div>
							<Button onClick={leaveClassroom} variant="danger">
								{t('classroom.leave')}
							</Button>
						</div>
					</Col>
				)}
			</Row>

			<Modal
				title={t('classroom.code.title')}
				open={codeModalOpen}
				onClose={() => setCodeModalOpen(false)}
				submitText={t('msg.understood')}
				button
				hideCloseButton
				closeCross
			>
				{t('classroom.code.desc')}
				<Alert
					className="mt-4"
					style={{ fontSize: '3em', textAlign: 'center' }}
					variant="success"
				>
					{classroom.code}
				</Alert>
			</Modal>
		</StyledClassroomHeader>
	);
};

export default ClassroomHeader;