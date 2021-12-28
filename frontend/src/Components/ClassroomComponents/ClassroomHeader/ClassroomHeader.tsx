import { ClassroomHeaderProps, StyledClassroomHeader } from './classroomHeaderTypes';
import { Alert, Badge, Col, Row } from 'react-bootstrap';
import Button from '../../UtilsComponents/Button/Button';
import { useContext, useState } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { Professor } from '../../../Models/User/user.entity';
import api from '../../../Models/api';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { useAlert } from 'react-alert';
import Modal from '../../UtilsComponents/Modal/Modal';
import { prettyField } from '../../../Types/formatting';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

/**
 * Classroom header that displays the className, the professor and
 * some actions buttons
 *
 * @param {Classroom} classroom classroom object
 *
 * @author MoSk3
 */
const ClassroomHeader = ({ className, classroom }: ClassroomHeaderProps) => {
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const alert = useAlert();
	const [codeModalOpen, setCodeModalOpen] = useState(false);
	const navigate = useNavigate();

	const leaveClassroom = async () => {
		if (!user) return;
		try {
			await api.db.classrooms.leave({
				classroomId: classroom.id,
				studentId: user.id,
			});
			navigate(routes.auth.dashboard.path);
		} catch {
			return alert.error(t('error.505'));
		}
	};

	return (
		<StyledClassroomHeader className={className} fluid>
			<Row className="header-row no-gutters">
				<Col md={6} className="classroom-title">
					<label className="classroom-title-name">{classroom.name}</label>
					<label className="classroom-title-desc">
						<Badge bg="primary">{prettyField(t('msg.professor'))}</Badge>{' '}
						{classroom.creator.getDisplayName()}
					</label>
				</Col>

				<Col md={6} className="classroom-buttons">
					{user instanceof Professor ? (
						<>
							<div>
								<Button
									onClick={() => setCodeModalOpen(true)}
									variant="primary"
								>
									{t('classroom.add_students')}
								</Button>
							</div>
							<div>
								<Button variant="danger">{t('classroom.delete')}</Button>
							</div>
						</>
					) : (
						<div>
							<Button onClick={leaveClassroom} variant="danger">
								{t('classroom.leave')}
							</Button>
						</div>
					)}{' '}
				</Col>
			</Row>
			<svg
				id="visual"
				viewBox="0 0 960 200"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
			>
				<rect
					x="0"
					y="0"
					width="960"
					height="200"
					fill={theme.color.background}
				></rect>
				<path
					d="M0 172L40 165.2C80 158.3 160 144.7 240 138.2C320 131.7 400 132.3 480 143.7C560 155 640 177 720 186.7C800 196.3 880 193.7 920 192.3L960 191L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z"
					fill={theme.color.primary}
					stroke-linecap="round"
					stroke-linejoin="miter"
				></path>
			</svg>
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