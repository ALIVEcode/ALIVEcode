import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import { FormCreateResourceDTO } from './formCreateResourceTypes';
import api from '../../../Models/api';
import Button from '../../UtilsComponents/Buttons/Button';

const FormCreateResource = ({ type }: { type: RESOURCE_TYPE }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormCreateResourceDTO>();

	const onSubmit = async (formValues: FormCreateResourceDTO) => {
		formValues.type = type;
		const resource = await api.db.resources.create(formValues);
		console.log(resource);
	};

	const renderSpecificFields = () => {
		switch (type) {
			case RESOURCE_TYPE.CHALLENGE:
				return <></>;
			case RESOURCE_TYPE.THEORY:
				return <></>;
			case RESOURCE_TYPE.VIDEO:
				return <></>;
			case RESOURCE_TYPE.IMAGE:
				return <></>;
			case RESOURCE_TYPE.FILE:
				return <></>;
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputGroup
				label="Name"
				errors={errors.resource?.name?.type}
				{...register('resource.name', { required: true })}
			/>
			{renderSpecificFields()}
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</form>
	);
};

export default FormCreateResource;
