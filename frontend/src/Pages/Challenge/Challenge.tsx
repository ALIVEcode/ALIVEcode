import {
	ChallengeProps,
	StyledChallenge,
	typeAskForUserInput,
} from './challengeTypes';
import {
	useEffect,
	useState,
	useContext,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import {
	Challenge as ChallengeModel,
	CHALLENGE_ACCESS,
	CHALLENGE_DIFFICULTY,
} from '../../Models/Challenge/challenge.entity';
import { useAlert } from 'react-alert';
import { ChallengeAlive as ChallengeAliveModel } from '../../Models/Challenge/challenges/challenge_alive.entity';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ChallengeCode as ChallengeCodeModel } from '../../Models/Challenge/challenges/challenge_code.entity';
import ChallengeCode from './ChallengeCode/ChallengeCode';
import api from '../../Models/api';
import { useParams } from 'react-router';
import { UserContext } from '../../state/contexts/UserContext';
import { ChallengeProgression } from '../../Models/Challenge/challengeProgression';
import { plainToClass } from 'class-transformer';
import ChallengeAlive from './ChallengeAlive/ChallengeAlive';
import { ChallengeAI as ChallengeAIModel } from '../../Models/Challenge/challenges/challenge_ai.entity';
import ChallengeAI from './ChallengeAI/ChallengeAI';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import { useTranslation } from 'react-i18next';
import {
	ChallengeContext,
	ChallengeContextTypes,
} from '../../state/contexts/ChallengeContext';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import useRoutes from '../../state/hooks/useRoutes';
import $ from 'jquery';
import Confetti from 'react-confetti';
import FormModal from '../../Components/UtilsComponents/FormModal/FormModal';
import Form from '../../Components/UtilsComponents/Form/Form';
import { ChallengeExecutor } from './AbstractChallengeExecutor';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { FORM_ACTION } from '../../Components/UtilsComponents/Form/formTypes';
import { ChallengeIoT as ChallengeIoTModel } from '../../Models/Challenge/challenges/challenge_IoT.entity';
import IoTProject from '../IoT/IoTProject/IoTProject';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';

/**
 * This component is used to load any type of Challenge with an id or passed as a prop.
 * It automatically loads the progression or create a new one.
 * It also renders the correct Challenge component depending on the type specified.
 *
 * @param {boolean} editMode if the challenge is in editMode
 * @param {Challenge} challenge challenge to load (optional if specified in url parameters)
 * @param {string} type type of the challenge to load: AI, ALIVE, IoT, code
 *
 * @author Enric Soldevila
 */
const Challenge = ({
	challenge: challengeProp,
	type,
	...props
}: ChallengeProps) => {
	const { challengeId } = useParams<{ challengeId: string }>();
	const { user } = useContext(UserContext);
	const [challenge, setChallenge] = useState<ChallengeModel | undefined>(
		() => challengeProp,
	);
	const [progression, setProgression] = useState<ChallengeProgression>();
	const [initialProgressionCode, setInitialProgressionCode] =
		useState<string>('');
	const alert = useAlert();
	const navigate = useNavigate();
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
	const executor = useRef<ChallengeExecutor | null>(null);
	const saveTimeout = useRef<any>(null);
	const messageTimeout = useRef<any>(null);
	const forceUpdate = useForceUpdate();
	const editMode =
		props.editMode &&
		user != null &&
		challenge?.creator != null &&
		challenge?.creator.id === user.id;

	const askForUserInput: typeAskForUserInput = (msg, callback) => {
		userInputCallback.current = callback;
		inputMsg.current = msg;
		setUserInputModalOpen(true);
	};

	/*useEffect(() => {
		const previousOverflowY = document.body.style.overflowY;
		document.body.style.overflowY = 'hidden';

		return () => {
			document.body.style.overflowY = previousOverflowY;
		};
	}, []);*/

	useEffect(() => {
		setInitialProgressionCode('');

		const loadChallenge = async () => {
			if (!user) return;
			let fetchedChallenge: ChallengeModel | null = null;
			// ChallengeId as url param
			if (challengeId) {
				try {
					fetchedChallenge = await api.db.challenges.get({ id: challengeId });
				} catch (err) {
					alert.error('Niveau introuvable');
					navigate('/');
					return;
				}
			}

			// If user, load or create progression
			if (user && (challengeProp || fetchedChallenge)) {
				let progression: ChallengeProgression;
				const currentChallenge = challengeProp ?? fetchedChallenge;
				if (!currentChallenge) return;
				try {
					progression = await api.db.challenges.progressions.get({
						id: currentChallenge.id,
						userId: user.id,
					});
				} catch (err) {
					progression = await api.db.challenges.progressions.save(
						{
							id: currentChallenge.id,
							userId: user.id,
						},
						{},
					);
				}
				progression.data.code &&
					setInitialProgressionCode(progression.data.code);
				setProgression(progression);
				setChallenge(currentChallenge);
			}

			// If no challenge loaded create an non-saved empty one
			if (!challenge && !fetchedChallenge && !challengeProp) {
				fetchedChallenge = plainToClass(ChallengeModel, {
					id: 'dummy',
					name: 'New challenge',
					creator: {
						id: 'dummy',
						email: 'dummy@gmail.com',
					},
					access: CHALLENGE_ACCESS.RESTRICTED,
					difficulty: CHALLENGE_DIFFICULTY.EASY,
					hints: [],
					tags: [],
					creationDate: new Date(),
					updateDate: new Date(),
				});
			}
			fetchedChallenge && setChallenge(fetchedChallenge);
		};
		loadChallenge();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [challengeId, challengeProp, user]);

	const saveChallenge = useCallback(async () => {
		(challenge as any).project = undefined;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);

		if (!challenge) return;

		const updatedChallenge = (await api.db.challenges.update(
			{
				id: challenge.id,
			},
			challenge,
		)) as ChallengeModel;

		messageTimeout.current = setTimeout(() => {
			setSaving(false);
			setSaved(true);

			messageTimeout.current = setTimeout(() => {
				setSaved(false);
			}, 5000);
		}, 500);

		setChallenge(updatedChallenge);
	}, [challenge]);

	const saveChallengeTimed = useCallback(() => {
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(saveChallenge, 2000);
	}, [saveChallenge]);

	const saveProgression = useCallback(async () => {
		if (!user || !progression || !challenge) return;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		if (messageTimeout.current) clearTimeout(messageTimeout.current);
		setSaving(true);
		setSaved(false);
		const updatedProgression = await api.db.challenges.progressions.save(
			{
				id: challenge.id,
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
	}, [challenge, progression, user]);

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
				editMode ? saveChallenge() : saveProgression();
			}
		});
	}, [editMode, saveChallenge, saveProgression, user]);

	useEffect(() => {
		return () => {
			clearTimeout(saveTimeout.current);
			clearTimeout(messageTimeout.current);
			$(document).off('keydown');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const challengeContextValues: ChallengeContextTypes = useMemo(() => {
		return {
			editMode,
			challenge,
			saveChallenge,
			saveChallengeTimed,
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
		challenge,
		progression,
		saveChallenge,
		saveChallengeTimed,
		saveProgression,
		saveProgressionTimed,
		saved,
		saving,
	]);

	if (!challenge || !progression) return <LoadingScreen />;

	return (
		<StyledChallenge editMode={editMode}>
			<ChallengeContext.Provider value={challengeContextValues}>
				{challenge instanceof ChallengeAliveModel ? (
					<ChallengeAlive
						initialCode={
							initialProgressionCode ||
							(challenge as ChallengeAliveModel).initialCode
						}
					></ChallengeAlive>
				) : challenge instanceof ChallengeCodeModel ? (
					<ChallengeCode
						initialCode={
							initialProgressionCode ||
							(challenge as ChallengeCodeModel).initialCode
						}
					></ChallengeCode>
				) : challenge instanceof ChallengeAIModel ? (
					<ChallengeAI
						initialCode={
							initialProgressionCode ||
							(challenge as ChallengeAIModel).initialCode
						}
					></ChallengeAI>
				) : challenge instanceof ChallengeIoTModel ? (
					<IoTProject
						initialCode={
							initialProgressionCode ||
							(challenge as ChallengeIoTModel).initialCode
						}
						challenge={challenge}
						updateId={challenge.id + '/' + progression?.id}
					></IoTProject>
				) : (
					<LoadingScreen></LoadingScreen>
				)}
				<Modal
					open={userInputModalOpen}
					setOpen={opening => {
						if (!opening) {
							if (userInputCallback.current && userInputRef.current)
								userInputCallback.current(`${userInputRef.current.value}`);
							setUserInputModalOpen(false);
							userInputRef.current.value = '';
						}
					}}
					title={inputMsg.current}
					hideCloseButton
					submitText="Confirmer"
					centered
					onShow={() => userInputRef.current && userInputRef.current.focus()}
					centeredText
				>
					<FormInput
						ref={userInputRef}
						placeholder={`${t('input.defaultValue')}`}
						type="text"
						onKeyPress={(e: KeyboardEvent) => {
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
					setOpen={setAccountModalOpen}
				>
					<Button
						variant="third"
						to={routes.non_auth.signup.path}
						className="mb-2"
					>
						{t('msg.auth.signup')}
					</Button>
					<br />
					or
					<br />
					<Button
						variant="third"
						to={routes.non_auth.signin.path}
						className="mt-2"
					>
						{t('msg.auth.signin')}
					</Button>
				</Modal>
				<FormModal
					title={t('form.challenge.PATCH.title')}
					onSubmit={res => {
						if (!challenge) return;
						const { name, description, access, difficulty }: ChallengeModel =
							res.data;
						challenge.name = name;
						challenge.description = description;
						challenge.access = access;
						challenge.difficulty = difficulty;
						setChallenge(challenge);
						forceUpdate();
						setSettingsModalOpen(false);
					}}
					setOpen={setSettingsModalOpen}
					open={settingsModalOpen}
				>
					<Form
						action={FORM_ACTION.PATCH}
						name="challenge"
						url={`challenges/${challenge!.id}`}
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								default: challenge?.name,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'textarea',
								default: challenge?.description,
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_ACCESS,
								default: challenge?.access,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_DIFFICULTY,
								default: challenge?.difficulty,
							},
						]}
					/>
				</FormModal>
				{showConfetti && <Confetti />}
			</ChallengeContext.Provider>
		</StyledChallenge>
	);
};

export default Challenge;
