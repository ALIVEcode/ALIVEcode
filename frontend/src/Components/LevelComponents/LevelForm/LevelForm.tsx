import Form from '../../UtilsComponents/Form/Form';
import { LevelFormProps } from './levelFormTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { useTranslation } from 'react-i18next';
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
	LEVEL_TYPE,
} from '../../../Models/Level/level.entity';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { LevelCode } from '../../../Models/Level/levelCode.entity';
import { LevelAI } from '../../../Models/Level/levelAI.entity';
import {
	IOT_LEVEL_TYPE,
	LevelIoT,
} from '../../../Models/Level/levelIoT.entity';
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
 * @author MoSk3
 */
const LevelForm = ({ type }: LevelFormProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();

	const [projects, setProjects] = useState<IoTProject[]>([]);

	useEffect(() => {
		if (type === LEVEL_TYPE.IOT) {
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
			case LEVEL_TYPE.ALIVE:
				return (
					<Form
						onSubmit={res => {
							const level: LevelAlive = res.data;
							navigate(
								routes.auth.level_edit.path.replace(':levelId', level.id),
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
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
								default: LEVEL_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
								default: LEVEL_DIFFICULTY.MEDIUM,
							},
						]}
						{...sharedProps}
					/>
				);
			case LEVEL_TYPE.AI:
				return (
					<Form
						onSubmit={res => {
							const level: LevelAI = res.data;
							navigate(
								routes.auth.level_edit.path.replace(':levelId', level.id),
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
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
								default: LEVEL_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
								default: LEVEL_DIFFICULTY.MEDIUM,
							},
						]}
						{...sharedProps}
					/>
				);
			case LEVEL_TYPE.CODE:
				return (
					<Form
						onSubmit={res => {
							const level: LevelCode = res.data;
							navigate(
								routes.auth.level_edit.path.replace(':levelId', level.id),
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
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
								default: LEVEL_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
								default: LEVEL_DIFFICULTY.MEDIUM,
							},
						]}
						{...sharedProps}
					/>
				);
			case LEVEL_TYPE.IOT:
				return (
					<Form
						onSubmit={res => {
							const level: LevelIoT = res.data;
							navigate(
								routes.auth.level_edit.path.replace(':levelId', level.id),
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
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
								default: LEVEL_ACCESS.PRIVATE,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
								default: LEVEL_DIFFICULTY.MEDIUM,
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
								default: IOT_LEVEL_TYPE.UPDATING,
								selectOptions: IOT_LEVEL_TYPE,
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
