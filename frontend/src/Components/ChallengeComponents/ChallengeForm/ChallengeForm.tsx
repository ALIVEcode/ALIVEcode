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
} from '../../../Models/Challenge/challenge.entity';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { ChallengeCode } from '../../../Models/Challenge/challenges/challenge_code.entity';
import { ChallengeAI } from '../../../Models/Challenge/challenges/challenge_ai.entity';
import {
	IOT_CHALLENGE_TYPE,
	ChallengeIoT,
} from '../../../Models/Challenge/challenges/challenge_IoT.entity';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { useState, useEffect, useContext } from 'react';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useNavigate } from 'react-router-dom';
import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { plainToInstance } from 'class-transformer';
import { UserContext } from '../../../state/contexts/UserContext';

/**
 * Component that renders the create form for the selected challenge type
 *
 * @param {string} type type of the challenge to create: ALIVE, IoT, code or AI
 *
 * @author Enric Soldevila
 */
const ChallengeForm = ({ type }: ChallengeFormProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const alert = useAlert();
	const navigate = useNavigate();

	const [projects, setProjects] = useState<IoTProject[]>([]);

	useEffect(() => {
		if (type === CHALLENGE_TYPE.IOT) {
			const getIoTProjects = async () => {
				const projects = await api.db.users.iot.getProjects({});
				setProjects(projects);
			};

			getIoTProjects();
		}
	}, [type]);

	const getSpecificChallenge = () => {
		const sharedProps = {
			name: 'challenge',
			action: FORM_ACTION.POST,
		};

		switch (type) {
			case CHALLENGE_TYPE.ALIVE:
				return (
					<Form
						onSubmit={async res => {
							const challenge: Challenge = plainToInstance(Challenge, res.data);

							if (user?.isProfessor()) {
								await api.db.resources.create({
									type: RESOURCE_TYPE.CHALLENGE,
									resource: {
										name: challenge.name,
										subject: challenge.getSubject(),
										challengeId: challenge.id,
									},
								});
							}

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
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.AI:
				return (
					<Form
						onSubmit={res => {
							const challenge: ChallengeAI = res.data;
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
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.CODE:
				return (
					<Form
						onSubmit={res => {
							const challenge: ChallengeCode = res.data;
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
						]}
						{...sharedProps}
					/>
				);
			case CHALLENGE_TYPE.IOT:
				return (
					<Form
						onSubmit={res => {
							const challenge: ChallengeIoT = res.data;
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
