import {
	ActivityContentProps,
	StyledActivityContent,
} from './activityContentTypes';
import { useContext, useState, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Level from '../../../Pages/Level/Level';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import {
	faAngleRight,
	faCheckCircle,
	faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import MDEditor from '../MDEditor/MDEditor';
import { Form } from 'react-bootstrap';
import Button from '../../UtilsComponents/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import Modal from '../../UtilsComponents/Modal/Modal';
import NewActivityContentModal from './NewActivityContentModal';
import ActivityEditor from '../MDEditor/ActivityEditor';
import { plainToClass } from 'class-transformer';
import { Activity } from '../../../Models/Course/activity.entity';
import ReactMarkdown from 'react-markdown';

/**
 * Displays the content of the activity in the CourseContext
 *
 * @author MoSk3
 */
const ActivityContent = (props: ActivityContentProps) => {
	const { theme } = useContext(ThemeContext);
	const {
		activity,
		saveActivityContent,
		saveActivity,
		canEdit,
		isNavigationOpen,
		setIsNavigationOpen,
	} = useContext(CourseContext);
	const { t } = useTranslation();
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState<string>('');
	const [editingName, setEditingName] = useState(false);
	const [defaultMDValue, setDefaultMDValue] = useState<string>();
	const [contentLayout, setContentLayout] = useState<any[]>([]);
	const [newContentModalOpen, setNewContentModalOpen] = useState(false);

	useEffect(() => {
		activity && setName(activity.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.name]);

	useEffect(() => {
		setDefaultMDValue(activity?.content?.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.content?.data]);

	const addContent = (content: any) => {
		setContentLayout(layout =>
			contentLayout.concat(
				<MDEditor onSave={saveActivityContent} defaultValue={defaultMDValue} />,
			),
		);
	};

	/*const projectId = useMemo(() => {
		return Math.random() > 0.5
			? '73f799b7-1019-4f8e-8205-872cf1fac1ff'
			: '7ae63621-b0f9-4996-a742-6f9bdce715b4';
	}, [activity?.id]);*/
	/*
	<>
							<div
								className="activity-header"
								style={{ cursor: editMode ? 'pointer' : 'initial' }}
							>
								{!editingName ? (
									<div
										className="activity-header-title"
										onClick={() => editMode && setEditingName(true)}
									>
										{activity.name}
									</div>
								) : (
									<Form.Control
										className="activity-header-title"
										value={name}
										autoFocus
										onChange={e => setName(e.target.value)}
										onBlur={() => {
											activity.name = name;
											saveActivity(activity);
											setEditingName(false);
										}}
										onKeyDown={(e: any) => {
											if (e.keyCode === 13) {
												activity.name = name;
												saveActivity(activity);
												setEditingName(false);
											}
										}}
									/>
								)}
								{canEdit && (
									<IconButton
										icon={editMode ? faCheckCircle : faPencilAlt}
										onClick={() => setEditMode(!editMode)}
										size="2x"
									/>
								)}
							</div>
							<div>
								{/*<IoTProject
									key={`iotproject-${projectId}`}
									id={projectId}
								></IoTProject>}
								<ActivityEditor
									isEditable={() => canEdit && editMode}
									onSave={content => {
										if (!activity.content) {
											activity.content = { data: '{}' };
										}
										activity.content.data = JSON.stringify(content);
										saveActivity(plainToClass(Activity, activity));
									}}
									defaultValue={
										activity.content?.data && JSON.parse(activity.content.data)
									}
								/>

								{activity.levels && activity.levels.length > 0 && (
									<>
										{activity.levels &&
											activity.levels.map((a, idx) => (
												<div key={idx} style={{ position: 'relative' }}>
													<Level
														key={`level-${a.level.id}`}
														level={a.level}
														editMode={false}
													/>
												</div>
											))}
									</>
								)}
							</div>
						</>
						*/

	return (
		<StyledActivityContent navigationOpen={isNavigationOpen} theme={theme}>
			<Button
				variant="secondary"
				className="btn-toggle-nav"
				onClick={() => {
					setIsNavigationOpen(!isNavigationOpen);
				}}
			>
				<FontAwesomeIcon
					style={{ transition: '0.35s' }}
					rotation={isNavigationOpen ? 180 : undefined}
					icon={faAngleRight}
					size="2x"
				/>
			</Button>
			<div className="activity-content-padding">
				<div className="activity-content-body">
					{activity ? (
						<>
							<div
								className="activity-header"
								style={{ cursor: editMode ? 'pointer' : 'initial' }}
							>
								{!editingName ? (
									<div
										className="activity-header-title"
										onClick={() => editMode && setEditingName(true)}
									>
										{activity.name}
									</div>
								) : (
									<Form.Control
										className="activity-header-title"
										value={name}
										onChange={e => setName(e.target.value)}
										onBlur={() => {
											activity.name = name;
											saveActivity(activity);
											setEditingName(false);
										}}
										onKeyDown={(e: any) => {
											if (e.keyCode === 13) {
												activity.name = name;
												saveActivity(activity);
												setEditingName(false);
											}
										}}
									/>
								)}
								{canEdit && (
									<IconButton
										icon={editMode ? faCheckCircle : faPencilAlt}
										onClick={() => setEditMode(!editMode)}
										size="2x"
									/>
								)}
							</div>
							<div>
								{/*<IoTProject
								key={`iotproject-${projectId}`}
								id={projectId}
							></IoTProject>*/}
								{canEdit && editMode ? (
									<MDEditor
										onSave={saveActivityContent}
										defaultValue={defaultMDValue}
									/>
								) : activity.content?.data ||
								  (activity.levels && activity.levels.length > 0) ? (
									<>
										{activity.content && (
											<ReactMarkdown>{activity.content.data}</ReactMarkdown>
										)}
										{activity.levels &&
											activity.levels.map((a, idx) => (
												<div key={idx} style={{ position: 'relative' }}>
													<Level
														key={`level-${a.level.id}`}
														level={a.level}
														editMode={false}
													/>
												</div>
											))}
									</>
								) : (
									<p>{t('course.activity.empty')}</p>
								)}
							</div>
						</>
					) : (
						<CenteredContainer
							style={{ height: '100%' }}
							horizontally
							vertically
						>
							{t('course.activity.no_activity')}
						</CenteredContainer>
					)}
				</div>
				{editMode && canEdit && (
					<Modal
						centered
						title={'course.activity.new_content'}
						open={newContentModalOpen}
						onClose={() => setNewContentModalOpen(false)}
						animation
						hideCloseButton
						hideFooter
					>
						<NewActivityContentModal />
					</Modal>
				)}
			</div>
		</StyledActivityContent>
	);
};

export default ActivityContent;