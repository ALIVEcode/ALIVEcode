import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import {
	FormCreateResourceDTO,
	FormCreateResourceProps,
} from './formCreateResourceTypes';
import api from '../../../Models/api';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import CreationMenu from '../../CourseComponents/CreationMenu/CreationMenu';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { getResourceIcon, SUBJECTS } from '../../../Types/sharedTypes';
import { Challenge } from '../../../Models/Challenge/challenge.entity';
import FormLabel from '../../UtilsComponents/FormLabel/FormLabel';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import Link from '../../UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';

const FormCreateResource = ({ open, setOpen }: FormCreateResourceProps) => {
	const [type, setType] = useState<RESOURCE_TYPE>(RESOURCE_TYPE.THEORY);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const { t } = useTranslation();
	const { setResources, resources } = useContext(UserContext);
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormCreateResourceDTO>({ defaultValues: { type } });
	if (!resources) return <LoadingScreen></LoadingScreen>;

	const onSelect = async (type: RESOURCE_TYPE) => {
		if (!user) return;
		if (type === RESOURCE_TYPE.CHALLENGE) {
			setChallenges(await api.db.users.getChallenges({ id: user?.id }));
		}
		setType(type);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = async (formValues: FormCreateResourceDTO) => {
		formValues.type = type;
		const resource = await api.db.resources.create(formValues);
		setResources([...resources, resource]);
		setOpen(false);
	};

	const renderSpecificFields = () => {
		switch (type) {
			case RESOURCE_TYPE.CHALLENGE:
				return (
					<>
						<FormLabel>{t('resources.challenge.form.select')}</FormLabel>
						{challenges.length <= 0 ? (
							<div>
								<i>{t('dashboard.challenges.empty')}. </i>
								<Link dark to={routes.auth.challenge_create.path}>
									{t('dashboard.challenges.create_challenge')}
								</Link>
							</div>
						) : (
							<FormInput
								as="select"
								errors={errors.resource?.challengeId}
								{...register('resource.challengeId', { required: true })}
							>
								{challenges.map((c, idx) => (
									<option key={idx} value={c.id}>
										{c.name}
									</option>
								))}
							</FormInput>
						)}
					</>
				);
			case RESOURCE_TYPE.THEORY:
				return <></>;
			case RESOURCE_TYPE.VIDEO:
				return (
					<InputGroup
						label={t('resources.video.form.url')}
						errors={errors.resource?.url}
						{...register('resource.url', { required: true })}
					/>
				);
			case RESOURCE_TYPE.IMAGE:
				return (
					<InputGroup
						label={t('resources.image.form.url')}
						errors={errors.resource?.url}
						{...register('resource.url', { required: true })}
					/>
				);
			case RESOURCE_TYPE.FILE:
				return <></>;
		}
	};

	return (
		<CreationMenu
			title={t('resources.form.create')}
			setOpen={setOpen}
			open={open}
			onSubmit={() => handleSubmit(onSubmit)()}
		>
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				{Object.entries(RESOURCE_TYPE).map((entry, idx) => (
					<TypeCard
						key={idx}
						title={t(`resources.${entry[0].toLowerCase()}.name`)}
						icon={getResourceIcon(entry[1])}
						onClick={() => onSelect(entry[1])}
						selected={type === entry[1]}
					/>
				))}
			</div>
			<>
				<InputGroup
					label={t('resources.form.name')}
					errors={errors.resource?.name}
					{...register('resource.name', { required: true })}
				/>
				<InputGroup
					as="select"
					label={t('resources.form.subject')}
					errors={errors.resource?.subject}
					{...register('resource.subject', { required: true })}
					onChange={(e: any) => {
						setType(e.target.value);
					}}
				>
					{Object.entries(SUBJECTS).map((entry, idx) => (
						<option key={idx} value={entry[1]}>
							{t(`msg.subjects.${entry[0].toLowerCase()}`)}
						</option>
					))}
				</InputGroup>
				{renderSpecificFields()}
			</>
		</CreationMenu>
	);
};

export default FormCreateResource;
