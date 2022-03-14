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

const FormCreateResource = ({ open, setOpen }: FormCreateResourceProps) => {
	const [type, setType] = useState<RESOURCE_TYPE>(RESOURCE_TYPE.FILE);
	const { t } = useTranslation();
	const { setResources, resources } = useContext(UserContext);
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormCreateResourceDTO>({ defaultValues: { type } });
	if (!resources) return <LoadingScreen></LoadingScreen>;

	const onSelect = async (type: RESOURCE_TYPE) => {
		setType(type);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = async (formValues: FormCreateResourceDTO) => {
		formValues.type = type;
		const resource = await api.db.resources.create(formValues);
		setResources([...resources, resource]);
	};

	const renderSpecificFields = () => {
		console.log('bo');
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
		<CreationMenu
			title="ww"
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
					as="select"
					label="Subject"
					errors={errors.resource?.name}
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
