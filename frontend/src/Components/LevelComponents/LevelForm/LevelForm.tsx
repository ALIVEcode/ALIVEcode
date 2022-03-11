import Form from '../../UtilsComponents/Form/Form';
import { LevelFormProps } from './levelFormTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { ChallengeAlive } from '../../../Models/Level/challenges/challenge_alive.entity';
import { useTranslation } from 'react-i18next';
import {
	CHALLENGE_ACCESS,
	CHALLENGE_DIFFICULTY,
	CHALLENGE_TYPE,
} from '../../../Models/Level/challenge.entity';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { ChallengeCode } from '../../../Models/Level/challenges/challenge_code.entity';
import { ChallengeAI } from '../../../Models/Level/challenges/challenge_ai.entity';
import {
	IOT_CHALLENGE_TYPE,
	ChallengeIoT,
} from '../../../Models/Level/challenges/challenge_IoT.entity';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { useState, useEffect } from 'react';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useNavigate } from 'react-router-dom';

/**
 * Component that renders the create form for the selected level type
 *
 * @param {string} type type of the level to create: ALIVE, IoT, code or AI
 *
 * @author Enric Soldevila
 */
const LevelForm = ({ type }: LevelFormProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
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

	const getSpecificLevel = () => {
		const sharedProps = {
			name: 'level',
			action: FORM_ACTION.POST,
		};

		switch (type) {
			case CHALLENGE_TYPE.ALIVE:
				return (
					<Form
						onSubmit={res => {
							const level: ChallengeAlive = res.data;
							navigate(
								routes.auth.challenge_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="levels/alive"
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
							const level: ChallengeAI = res.data;
							navigate(
								routes.auth.challenge_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="levels/ai"
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
							const level: ChallengeCode = res.data;
							navigate(
								routes.auth.challenge_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="levels/code"
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
							const level: ChallengeIoT = res.data;
							navigate(
								routes.auth.challenge_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						url="levels/iot"
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
		<FormContainer title={t('form.title.create_level')}>
			{getSpecificLevel()}
		</FormContainer>
	);
};

export default LevelForm;
