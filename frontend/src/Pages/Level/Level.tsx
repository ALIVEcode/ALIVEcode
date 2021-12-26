import { LevelProps, StyledLevel, typeAskForUserInput } from './levelTypes';
import {
	useEffect,
	useState,
	useContext,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import {
	Level as LevelModel,
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../Models/Level/level.entity';
import { useAlert } from 'react-alert';
import { LevelAlive as LevelAliveModel } from '../../Models/Level/levelAlive.entity';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelCode as LevelCodeModel } from '../../Models/Level/levelCode.entity';
import LevelCode from './LevelCode/LevelCode';
import api from '../../Models/api';
import { useHistory, useParams } from 'react-router';
import { UserContext } from '../../state/contexts/UserContext';
import { LevelProgression } from '../../Models/Level/levelProgression';
import { plainToClass } from 'class-transformer';
import LevelAlive from './LevelAlive/LevelAlive';
import { LevelAI as LevelAIModel } from '../../Models/Level/levelAI.entity';
import LevelAI from './LevelAI/LevelAI';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import { useTranslation } from 'react-i18next';
import {
	LevelContext,
	LevelContextTypes,
} from '../../state/contexts/LevelContext';
import Button from '../../Components/UtilsComponents/Button/Button';
import useRoutes from '../../state/hooks/useRoutes';
import $ from 'jquery';
import Confetti from 'react-confetti';
import FormModal from '../../Components/UtilsComponents/FormModal/FormModal';
import Form from '../../Components/UtilsComponents/Form/Form';
import { LevelExecutor } from './AbstractLevelExecutor';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { FORM_ACTION } from '../../Components/UtilsComponents/Form/formTypes';
import { LevelIoT as LevelIoTModel } from '../../Models/Level/levelIoT.entity';
import IoTProject from '../../Pages/IoT/IoTProject/IoTProject';

/**
 * This component is used to load any type of Level with an id or passed as a prop.
 * It automatically loads the progression or create a new one.
 * It also renders the correct Level component depending on the type specified.
 *
 * @param {boolean} editMode if the level is in editMode
 * @param {Level} level level to load (optional if specified in url parameters)
 * @param {string} type type of the level to load: AI, ALIVE, IoT, code
 *
 * @author MoSk3
 */
const Level = ({ level: levelProp, type, ...props }: LevelProps) => {
	const { levelId } = useParams<{ levelId: string }>();
	const { user } = useContext(UserContext);
	const [level, setLevel] = useState<LevelModel | undefined>(() => levelProp);
	const [progression, setProgression] = useState<LevelProgression>();
	const [initialProgressionCode, setInitialProgressionCode] =
		useState<string>('');
	const alert = useAlert();
	const history = useHistory();
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const userInputRef = useRef<any>();
	const userInputCallback = useRef<(inputValue: string) => void>();
	const inputMsg = useRef<string>(t('input.defaultMessage'));
	const [userInputModalOpen, setUserInputModalOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [accountModalOpen, setAccountModalOpen] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const executor = useRef<LevelExecutor | null>(null);
	const saveTimeout = useRef<any>(null);
	const messageTimeout = useRef<any>(null);
	const forceUpdate = useForceUpdate();
	const editMode =
		props.editMode &&
		user != null &&
		level?.creator != null &&
		level?.creator.id === user.id;

	const askForUserInput: typeAskForUserInput = (msg, callback) => {
		userInputCallback.current = callback;
		inputMsg.current = msg;
		setUserInputModalOpen(true);
	};

	useEffect(() => {
		setInitialProgressionCode('');

		const loadLevel = async () => {
			let fetchedLevel: LevelModel | null = null;
			// LevelId as url param
			if (levelId) {
				try {
					fetchedLevel = await api.db.levels.get({ id: levelId });
				} catch (err) {
					alert.error('Niveau introuvable');
					history.push('/');
					return;
				}
			}

			// If user, load or create progression
			if (user && (levelProp || fetchedLevel)) {
				let progression: LevelProgression;
				const currentLevel = levelProp ?? fetchedLevel;
				if (!currentLevel) return;
				try {
					progression = await api.db.levels.progressions.get({
						id: currentLevel.id,
						userId: user.id,
					});
				} catch (err) {
					progression = await api.db.levels.progressions.save(
						{
							id: currentLevel.id,
							userId: user.id,
						},
						{},
					);
				}
				progression.data.code &&
					setInitialProgressionCode(progression.data.code);
				setProgression(progression);
				setLevel(currentLevel);
			}

			// If no level loaded create an non-saved empty one
			if (!level && !fetchedLevel && !levelProp) {
				fetchedLevel = plainToClass(LevelModel, {
					id: 'dummy',
					name: 'New level',
					creator: {
						id: 'dummy',
						email: 'dummy@gmail.com',
					},
					access: LEVEL_ACCESS.RESTRICTED,
					difficulty: LEVEL_DIFFICULTY.EASY,
					hints: [],
					tags: [],
					creationDate: new Date(),
					updateDate: new Date(),
				});
			}
			fetchedLevel && setLevel(fetchedLevel);
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [levelId, levelProp]);

	const saveLevel = useCallback(async () => {
		(level as any).project = undefined;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);

		if (!level) {
			if (process.env.REACT_APP_DEBUG) console.log('save aborted');
			return;
		}

		const updatedLevel = (await api.db.levels.update(
			{
				id: level.id,
			},
			level,
		)) as LevelModel;

		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);

		setLevel(updatedLevel);
	}, [level]);

	const saveLevelTimed = useCallback(() => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveLevel, 2000);
	}, [saveLevel]);

	const saveProgression = useCallback(async () => {
		if (!user || !progression || !level) return;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedProgression = await api.db.levels.progressions.save(
			{
				id: level.id,
				userId: user.id,
			},
			progression,
		);
		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);
		setProgression(updatedProgression);
	}, [level, progression, user]);

	const saveProgressionTimed = useCallback(() => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveProgression, 2000);
	}, [saveProgression]);

	useEffect(() => {
		$(document).off('keydown');
		$(document).on('keydown', e => {
			if (e.key.toUpperCase() === 'S' && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();
				if (!user) return setAccountModalOpen(true);
				editMode ? saveLevel() : saveProgression();
			}
		});
	}, [editMode, saveLevel, saveProgression, user]);

	useEffect(() => {
		return () => {
			clearTimeout(saveTimeout.current);
			clearTimeout(messageTimeout.current);
			$(document).off('keydown');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const levelContextValues: LevelContextTypes = useMemo(() => {
		return {
			editMode,
			level,
			saveLevel,
			saveLevelTimed,
			progression,
			setProgression,
			saveProgression,
			saveProgressionTimed,
			saved,
			saving,
			setShowConfetti,
			setOpenSettings: setSettingsModalOpen,
			askForUserInput,
			executor,
		};
	}, [
		editMode,
		level,
		progression,
		saveLevel,
		saveLevelTimed,
		saveProgression,
		saveProgressionTimed,
		saved,
		saving,
	]);

	if (!level || !progression) return <LoadingScreen />;

	console.log('PASSED');
	return (
		<StyledLevel editMode={editMode}>
			<LevelContext.Provider value={levelContextValues}>
				{level instanceof LevelAliveModel ? (
					<LevelAlive
						initialCode={
							initialProgressionCode || (level as LevelAliveModel).initialCode
						}
					></LevelAlive>
				) : level instanceof LevelCodeModel ? (
					<LevelCode
						initialCode={
							initialProgressionCode || (level as LevelCodeModel).initialCode
						}
					></LevelCode>
				) : level instanceof LevelAIModel ? (
					<LevelAI
						initialCode={
							initialProgressionCode || (level as LevelAIModel).initialCode
						}
					></LevelAI>
				) : level instanceof LevelIoTModel ? (
					<IoTProject
						initialCode={
							initialProgressionCode || (level as LevelIoTModel).initialCode
						}
						level={level}
						updateId={level.id + '/' + progression?.id}
					></IoTProject>
				) : (
					<LoadingScreen></LoadingScreen>
				)}
				<Modal
					open={userInputModalOpen}
					onClose={() => {
						if (userInputCallback.current && userInputRef.current)
							userInputCallback.current(`${userInputRef.current.value}`);
						setUserInputModalOpen(false);
						userInputRef.current.value = '';
					}}
					title={inputMsg.current}
					hideCloseButton
					submitText="Confirmer"
					centered
					onShow={() => userInputRef.current.focus()}
					centeredText
				>
					<input
						ref={userInputRef}
						placeholder={`${t('input.defaultValue')}`}
						type="text"
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								if (userInputCallback.current && userInputRef.current)
									userInputCallback.current(
										`${userInputRef.current?.value ?? ''}`,
									);
								userInputRef.current.value = '';
								setUserInputModalOpen(false);
							}
						}}
					/>
				</Modal>
				<Modal
					title={t('msg.auth.account_required')}
					open={accountModalOpen}
					onClose={() => setAccountModalOpen(false)}
				>
					<Button
						variant="primary"
						to={routes.non_auth.signup.path}
						className="mb-2"
					>
						{t('msg.auth.signup')}
					</Button>
					<br />
					or
					<br />
					<Button
						variant="primary"
						to={routes.non_auth.signin.path}
						className="mt-2"
					>
						{t('msg.auth.signin')}
					</Button>
				</Modal>
				<FormModal
					title={t('form.level.PATCH.title')}
					onSubmit={res => {
						if (!level) return;
						const { name, description, access, difficulty }: LevelModel =
							res.data;
						level.name = name;
						level.description = description;
						level.access = access;
						level.difficulty = difficulty;
						setLevel(level);
						forceUpdate();
						setSettingsModalOpen(false);
					}}
					onClose={() => setSettingsModalOpen(false)}
					open={settingsModalOpen}
				>
					<Form
						action={FORM_ACTION.PATCH}
						name="level"
						url={`levels/${level!.id}`}
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								default: level?.name,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'text',
								default: level?.description,
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
								default: level?.access,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
								default: level?.difficulty,
							},
						]}
					/>
				</FormModal>
				{showConfetti && <Confetti />}
			</LevelContext.Provider>
		</StyledLevel>
	);
};

export default Level;