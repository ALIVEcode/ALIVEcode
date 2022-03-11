import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import { FormCreateResourceDTO } from './formCreateResourceTypes';
import api from '../../../Models/api';
import Button from '../../UtilsComponents/Buttons/Button';
import { SUBJECTS } from '../../../Types/sharedTypes';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

const FormCreateResource = ({ subject }: { subject: SUBJECTS }) => {
	const [type, setType] = useState<RESOURCE_TYPE>(RESOURCE_TYPE.FILE);
	const { t } = useTranslation();
	const { setResources, resources } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormCreateResourceDTO>({ defaultValues: { type } });
	if (!resources) return <LoadingScreen></LoadingScreen>;

	const onSubmit = async (formValues: FormCreateResourceDTO) => {
		formValues.resource.subject = subject;
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
		<form onSubmit={handleSubmit(onSubmit)}>
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
				<option value={RESOURCE_TYPE.VIDEO}>{t('resources.video.name')}</option>
				<option value={RESOURCE_TYPE.IMAGE}>{t('resources.image.name')}</option>
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
			<Button variant="primary" type="submit" className="mt-3">
				Submit
			</Button>
		</form>
	);
};

export default FormCreateResource;
