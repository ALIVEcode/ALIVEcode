import Form from '../../UtilsComponents/Form/Form';
import { ChallengeFormProps } from './challengeFormTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import {
	Challenge,
	CHALLENGE_ACCESS,
	CHALLENGE_DIFFICULTY,
	CHALLENGE_TYPE,
	SUPPORTED_LANG,
} from '../../../Models/Challenge/challenge.entity';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { ChallengeCode } from '../../../Models/Challenge/challenges/challenge_code.entity';
import { ChallengeAI } from '../../../Models/Challenge/challenges/challenge_ai.entity';
import {
	IOT_CHALLENGE_TYPE,
	ChallengeIoT,
} from '../../../Models/Challenge/challenges/challenge_IoT.entity';
import { FORM_ACTION, InputGroup } from '../../UtilsComponents/Form/formTypes';
import { useState, useEffect, useContext } from 'react';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useNavigate } from 'react-router-dom';
import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { plainToInstance } from 'class-transformer';
import { UserContext } from '../../../state/contexts/UserContext';
import { ChallengeAlive } from '../../../Models/Challenge/challenges/challenge_alive.entity';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';

/**
 * Component that renders the create form for the selected challenge type
 *
 * @param {string} type type of the challenge to create: ALIVE, IoT, code or AI
 * @author Enric Soldevila
 */
const ChallengeForm = ({ type }: ChallengeFormProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const alert = useAlert();
	const navigate = useNavigate();
	const [projects, setProjects] = useState<IoTProject[]>([]);
	const [datasets, setDatasets] = useState<AIDataset[]>([]);

	/**
	 * Creates a resource Challenge based on the challenge if the user is a profesor.
	 * @param challenge Challenge to create the resource based on
	 */
	const createResourceChallenge = async (challenge: Challenge) => {
		if (user?.isProfessor()) {
			await api.db.resources.create(
				{
					type: RESOURCE_TYPE.CHALLENGE,
					resource: {
						name: challenge.name,
						subject: challenge.getSubject(),
						challengeId: challenge.id,
					},
					file: null,
				},
				value => {},
			);
		}
	};

	/**
	 * Loads the IoTProjects of a user when he switched to a level of type IoT.
	 * Also loads all possible datasets if its creating a ChallengeAI
	 */
	useEffect(() => {
		if (type === CHALLENGE_TYPE.IOT) {
			const getIoTProjects = async () => {
				const projects = await api.db.users.iot.getProjects({});
				setProjects(projects);
			};

			getIoTProjects();
		} else if (type === CHALLENGE_TYPE.AI) {
			const getDatasets = async () => {
				const datasets = await api.db.ai.getAllDatasets({});
				setDatasets(datasets);
			};

			getDatasets();
		}
	}, [type]);

	/**
	 *
	 * Renders the specific fields for creating a challenge based on its type
	 * @returns Specific fields for creating a challenge based on its type
	 */
	const getSpecificChallenge = () => {
		const sharedProps = {
			name: 'challenge',
			action: FORM_ACTION.POST,
		};
		const sharedInputGroup: InputGroup[] = [
			{
				name: 'lang',
				required: true,
				inputType: 'select',
				selectOptions: SUPPORTED_LANG,
				default: SUPPORTED_LANG.FR,
			},
		];

		switch (type) {
			case CHALLENGE_TYPE.ALIVE:
				return (
					<Form
						onSubmit={async res => {
							const challenge: Challenge = plainToInstance(
								ChallengeAlive,
								res.data as object,
							);

							await createResourceChallenge(challenge);

							navigate(
								routes.auth.challenge_edit.path.replace(
									':challengeId',
									challenge.id,
								),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="challenges/alive"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'textarea',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_ACCESS,
								default: CHALLENGE_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_DIFFICULTY,
								default: CHALLENGE_DIFFICULTY.MEDIUM,
							},
							...sharedInputGroup,
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.AI:
				return (
					<Form
						onSubmit={async res => {
							const challenge: ChallengeAI = plainToInstance(
								ChallengeAI,
								res.data as object,
							);

							await createResourceChallenge(challenge);

							navigate(
								routes.auth.challenge_edit.path.replace(
									':challengeId',
									challenge.id,
								),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="challenges/ai"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'textarea',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_ACCESS,
								default: CHALLENGE_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_DIFFICULTY,
								default: CHALLENGE_DIFFICULTY.MEDIUM,
							},
							{
								name: 'datasetId',
								required: true,
								inputType: 'select',
								selectOptions: datasets.flatMap(dataset => {
									return {
										value: dataset.id,
										display: dataset.getName(),
									};
								}),
								default: datasets.length === 0 ? null : datasets[0],
							},
							...sharedInputGroup,
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.CODE:
				return (
					<Form
						onSubmit={async res => {
							const challenge: ChallengeCode = plainToInstance(
								ChallengeCode,
								res.data as object,
							);

							await createResourceChallenge(challenge);

							navigate(
								routes.auth.challenge_edit.path.replace(
									':challengeId',
									challenge.id,
								),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="challenges/code"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'textarea',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_ACCESS,
								default: CHALLENGE_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_DIFFICULTY,
								default: CHALLENGE_DIFFICULTY.MEDIUM,
							},
							...sharedInputGroup,
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.IOT:
				return (
					<Form
						onSubmit={async res => {
							const challenge: ChallengeIoT = plainToInstance(
								ChallengeIoT,
								res.data as object,
							);

							await createResourceChallenge(challenge);

							navigate(
								routes.auth.challenge_edit.path.replace(
									':challengeId',
									challenge.id,
								),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="challenges/iot"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'textarea',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_ACCESS,
								default: CHALLENGE_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: CHALLENGE_DIFFICULTY,
								default: CHALLENGE_DIFFICULTY.MEDIUM,
							},
							{
								name: 'project_id',
								required: true,
								inputType: 'select',
								default: projects.length === 0 ? null : projects[0],
								selectOptions: projects.flatMap(p => {
									return {
										value: p.id,
										display: p.name,
									};
								}),
							},
							{
								name: 'iotType',
								required: true,
								inputType: 'select',
								default: IOT_CHALLENGE_TYPE.UPDATING,
								selectOptions: IOT_CHALLENGE_TYPE,
							},
							...sharedInputGroup,
						]}
						{...sharedProps}
					/>
				);
		}
	};

	return (
		<FormContainer title={t('form.title.create_challenge')}>
			{getSpecificChallenge()}
		</FormContainer>
	);
};

export default ChallengeForm;
