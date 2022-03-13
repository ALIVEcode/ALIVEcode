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
import { faCode, faVideo, faBook } from '@fortawesome/free-solid-svg-icons';

const FormCreateResource = ({ open, setOpen }: FormCreateResourceProps) => {
	const [type, setType] = useState<RESOURCE_TYPE>(RESOURCE_TYPE.FILE);
	const { t } = useTranslation();
	const { setResources, resources } = useContext(UserContext);
	const {
		register,
		formState: { errors },
	} = useForm<FormCreateResourceDTO>({ defaultValues: { type } });
	if (!resources) return <LoadingScreen></LoadingScreen>;

	const onSelect = async (type: RESOURCE_TYPE) => {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = async (formValues: FormCreateResourceDTO) => {
		const resource = await api.db.resources.create(formValues);
		setResources([...resources, resource]);
	};

	const renderSpecificFields = () => {
		switch (type) {
			case RESOURCE_TYPE.CHALLENGE:
				return <></>;
			case RESOURCE_TYPE.THEORY:
				return <></>;
			case RESOURCE_TYPE.VIDEO:
				return (
					<InputGroup
						label="Url"
						errors={errors.resource?.url}
						{...register('resource.url', { required: true })}
					/>
				);
			case RESOURCE_TYPE.IMAGE:
				return (
					<InputGroup
						label="Url"
						errors={errors.resource?.url}
						{...register('resource.url', { required: true })}
					/>
				);
			case RESOURCE_TYPE.FILE:
				return <></>;
		}
	};

	return (
		<CreationMenu<{ name: string }>
			title="ww"
			setOpen={setOpen}
			open={open}
			state={{ name: 'This is a default state' }}
		>
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				<TypeCard
					title={t('resources.challenge.name')}
					icon={faCode}
					onClick={() => onSelect(RESOURCE_TYPE.CHALLENGE)}
				/>
				<TypeCard
					title={t('resources.video.name')}
					icon={faVideo}
					onClick={() => onSelect(RESOURCE_TYPE.VIDEO)}
				/>
				<TypeCard
					title={t('resources.file.name')}
					icon={faBook}
					onClick={() => onSelect(RESOURCE_TYPE.FILE)}
				/>
				<TypeCard
					title={t('resources.image.name')}
					icon={faBook}
					onClick={() => onSelect(RESOURCE_TYPE.IMAGE)}
				/>
				<TypeCard
					title={t('resources.theory.name')}
					icon={faBook}
					onClick={() => onSelect(RESOURCE_TYPE.THEORY)}
				/>
			</div>
			<>
				<InputGroup
					as="select"
					label="Type"
					errors={errors.resource?.name}
					{...register('type', { required: true })}
					onChange={(e: any) => {
						setType(e.target.value);
					}}
				>
					<option value={RESOURCE_TYPE.FILE}>{t('resources.file.name')}</option>
					<option value={RESOURCE_TYPE.VIDEO}>
						{t('resources.video.name')}
					</option>
					<option value={RESOURCE_TYPE.IMAGE}>
						{t('resources.image.name')}
					</option>
					<option value={RESOURCE_TYPE.THEORY}>
						{t('resources.theory.name')}
					</option>
					<option value={RESOURCE_TYPE.CHALLENGE}>
						{t('resources.challenge.name')}
					</option>
				</InputGroup>
				<InputGroup
					label="Name"
					errors={errors.resource?.name}
					{...register('resource.name', { required: true })}
				/>
				{renderSpecificFields()}
			</>
		</CreationMenu>
	);
};

export default FormCreateResource;
