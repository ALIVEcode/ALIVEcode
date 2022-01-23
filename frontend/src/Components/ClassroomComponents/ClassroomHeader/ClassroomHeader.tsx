import { ClassroomHeaderProps } from './classroomHeaderTypes';
import Button from '../../UtilsComponents/Buttons/Button';
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
import Badge from '../../UtilsComponents/Badge/Badge';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import ClassroomSettings from '../ClassroomSettings/ClassroomSettings';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

/**
 * Classroom header that displays the className, the professor and
 * some actions buttons
 *
 * @param {Classroom} classroom classroom object
 *
 * @author MoSk3
 */
const ClassroomHeader: React.FC<
	ClassroomHeaderProps &
		React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLDivElement>,
			HTMLDivElement
		>
> = ({ classroom, ...other }) => {
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const alert = useAlert();
	const [codeModalOpen, setCodeModalOpen] = useState(false);
	const [openClassroomDelete, setOpenClassroomDelete] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const forceUpdate = useForceUpdate();
	const navigate = useNavigate();

	const leaveClassroom = async () => {
		if (!user) return;
		try {
			await api.db.classrooms.leave({
				classroomId: classroom.id,
				studentId: user.id,
			});
		} catch (err) {
			return alert.error(t('error.505'));
		}
	};

	return (
		<div
			className="bg-[color:var(--primary-color)] text-white text-center tablet:text-left"
			{...other}
		>
			<div className="h-full relative z-10 flex flex-col tablet:flex-row justify-between p-10 pb-0 gap-6">
				<div className="mt-10">
					<div className="text-4xl tablet:text-3xl laptop:text-4xl desktop:text-5xl mb-4">
						{classroom.name}
					</div>
					<label className="flex justify-center tablet:justify-start text-base tablet:text-lg laptop:text-xl desktop:text-2xl">
						<Badge className="text-lg mr-2" variant="secondary">
							{prettyField(t('msg.professor'))}
						</Badge>{' '}
						{classroom.creator.getDisplayName()}
					</label>
				</div>

				<div className="flex flex-row tablet:flex-col justify-center gap-2 tablet:gap-4 mt-10">
					{user instanceof Professor ? (
						<>
							<Button
								className="!text-xs tablet:!text-sm laptop:!text-base"
								onClick={() => setCodeModalOpen(true)}
								variant="third"
							>
								{t('classroom.add_students')}
							</Button>
							<Button
								className="!text-xs tablet:!text-sm laptop:!text-base"
								variant="danger"
								onClick={() => setOpenClassroomDelete(true)}
							>
								{t('classroom.delete')}
							</Button>
							<div className="flex justify-end">
								<Button
									className="!text-xs tablet:!text-sm laptop:!text-base"
									variant="secondary"
									onClick={() => setOpenSettings(true)}
								>
									<FontAwesomeIcon size="lg" icon={faCog}></FontAwesomeIcon>
								</Button>
							</div>
						</>
					) : (
						<div>
							<Button
								onClick={() => setOpenClassroomDelete(true)}
								variant="danger"
							>
								{t('classroom.leave')}
							</Button>
						</div>
					)}{' '}
				</div>
			</div>
			<svg
				id="visual"
				viewBox="0 0 960 200"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
				className="relative z-0 mt-0 tablet:mt-[-1rem] laptop:mt-[-3rem] desktop:mt-[-5rem]"
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
					strokeLinecap="round"
					strokeLinejoin="miter"
				></path>
			</svg>
			<Modal
				title={t('classroom.code.title')}
				open={codeModalOpen}
				setOpen={setCodeModalOpen}
				submitText={t('msg.understood')}
				hideCloseButton
				centeredText
				centered
				closeCross
				submitButtonVariant="primary"
			>
				{t('classroom.code.desc')}
				<Badge
					variant="third"
					className="!mt-4 !bg-green-500 !text-4xl !px-6 !py-6"
					style={{ fontSize: '3em', textAlign: 'center' }}
				>
					{classroom.code}
				</Badge>
			</Modal>
			<AlertConfirm
				title={
					user?.isProfessor() ? t('classroom.delete') : t('classroom.leave')
				}
				setOpen={setOpenClassroomDelete}
				open={openClassroomDelete}
				onConfirm={async () => {
					user?.isProfessor()
						? await api.db.classrooms.delete({ id: classroom.id })
						: leaveClassroom();
					await user?.removeClassroom(classroom);
					navigate(routes.auth.dashboard.path + '/recents');
				}}
			/>
			<FormModal
				onSubmit={res => {
					classroom.name = res.data.name;
					classroom.description = res.data.description;
					classroom.subject = res.data.subject;
					classroom.access = res.data.access;
					forceUpdate();
				}}
				setOpen={setOpenSettings}
				title={t('form.title.update_classroom')}
				open={openSettings}
			>
				<ClassroomSettings classroom={classroom} />
			</FormModal>
		</div>
	);
};

export default ClassroomHeader;
