import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { Student } from '../../../Models/User/user.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import api from '../../../Models/api';

type FormValues = {
	firstName: string;
	lastName: string;
};

const NameMigrationForm = ({
	setOpen,
}: {
	setOpen: (bool: boolean) => void;
}) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormValues>();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const alert = useAlert();

	if (!(user instanceof Student)) return <></>;

	console.log(user.oldStudentName);

	const onNameSubmit = async (formValues: FormValues) => {
		try {
			await api.db.users.nameMigration(
				formValues.firstName,
				formValues.lastName,
			);
			user.firstName = formValues.firstName;
			user.lastName = formValues.lastName;
			setOpen(false);
		} catch (e) {
			const err = e as AxiosError;
			const statusCode = err.response?.status;
			if (statusCode === 400) {
				setError('lastName', { type: 'pattern' });
				setError('firstName', { type: 'pattern' });
				return;
			}
			return alert.error(t('error.unknown'));
		}
	};

	return (
		<form onSubmit={handleSubmit(onNameSubmit)}>
			<p className="text-sm text-[color:var(--fg-shade-two-color)]">
				{t('msg.auth.name_migration.desc')}
			</p>
			<p className="mt-4 text-red-600">{t('msg.auth.name_migration.please')}</p>
			<InputGroup
				className="mt-6"
				label={t('form.firstName.label')}
				placeholder={t('form.firstName.placeholder')}
				autoComplete="on"
				errors={errors.firstName}
				messages={{
					required: t('form.firstName.required'),
					pattern: t('form.firstName.pattern'),
				}}
				minLength={3}
				maxLength={25}
				defaultValue={user.oldStudentName ?? ''}
				{...register('firstName', {
					required: true,
					minLength: 3,
					maxLength: 25,
					pattern: /^[-\p{L}]{3,}$/u,
				})}
			/>
			<InputGroup
				label={t('form.lastName.label')}
				placeholder="Soldevila"
				autoComplete="on"
				errors={errors.lastName}
				messages={{
					required: t('form.lastName.required'),
					pattern: t('form.lastName.pattern'),
				}}
				minLength={3}
				maxLength={25}
				{...register('lastName', {
					required: true,
					minLength: 3,
					maxLength: 25,
					pattern: /^[-\p{L}]{3,}$/u,
				})}
			/>
			<Button className="mt-4" variant="third" type="submit">
				{t('msg.auth.name_migration.submit')}
			</Button>
		</form>
	);
};

export default NameMigrationForm;
