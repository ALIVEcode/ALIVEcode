import { useTranslation } from 'react-i18next';
import api from '../../../Models/api';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import Button from '../../UtilsComponents/Button/Button';
import useRoutes from '../../../state/hooks/useRoutes';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';

/**
 * Component used to join a classroom with a provided classroom code
 *
 * @author MoSk3
 */
const JoinClassroomForm = () => {
	const { t } = useTranslation();
	const { goTo, routes } = useRoutes();
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();
	const timeout = useRef<NodeJS.Timeout>();

	// Cleanup of timeouts
	useEffect(() => {
		return () => {
			timeout.current && clearTimeout(timeout.current);
		};
	}, []);

	const SubmitForm = async (formValues: { code: string }) => {
		try {
			const classroom = await api.db.classrooms.join({ code: formValues.code });
			goTo(routes.auth.classroom.path.replace(':id', classroom.id));
			clearErrors('code');
		} catch {
			setError('code', {
				type: 'notFound',
			});
			timeout.current = setTimeout(() => {
				clearErrors('code');
			}, 5000);
		}
	};

	return (
		<form onSubmit={handleSubmit(SubmitForm)}>
			<InputGroup
				label={t('form.join_classroom.code')}
				errors={errors.code}
				messages={{
					notFound: t('form.join_classroom.invalid_code'),
				}}
				placeholder={t('form.join_classroom.code')}
				minLength={6}
				maxLength={6}
				{...register('code', {
					required: true,
					minLength: 6,
					maxLength: 6,
				})}
			/>
			<Button type="submit" variant="third">
				{t('form.join_classroom.submit')}
			</Button>
		</form>
	);
};

export default JoinClassroomForm;
