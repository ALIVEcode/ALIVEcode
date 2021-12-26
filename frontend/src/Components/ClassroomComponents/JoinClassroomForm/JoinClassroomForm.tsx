import { useTranslation } from 'react-i18next';
import api from '../../../Models/api';
import { useForm } from 'react-hook-form';
import { Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import Button from '../../UtilsComponents/Button/Button';
import useRoutes from '../../../state/hooks/useRoutes';

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
		formState: { errors },
	} = useForm();
	const [notFound, setNotFound] = useState(false);
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
			setNotFound(false);
		} catch {
			setNotFound(true);
			timeout.current = setTimeout(() => {
				setNotFound(false);
			}, 5000);
		}
	};

	return (
		<Form onSubmit={handleSubmit(SubmitForm)}>
			<Form.Group>
				<Form.Label>{t('form.join_classroom.code')}</Form.Label>
				<InputGroup hasValidation>
					<Form.Control
						isInvalid={notFound || errors.code?.type}
						placeholder={t('form.join_classroom.code')}
						{...register('code', {
							required: true,
							minLength: 6,
							maxLength: 6,
						})}
					/>
					<Form.Control.Feedback type="invalid">
						{notFound && !errors.code && t('form.join_classroom.invalid_code')}
						{errors.code?.type === 'required' && t('form.error.required')}
						{errors.code?.type === 'minLength' &&
							t('form.error.minLength', { min: 6 })}
						{errors.code?.type === 'maxLength' &&
							t('form.error.maxLength', { max: 6 })}
					</Form.Control.Feedback>
				</InputGroup>
			</Form.Group>
			{console.log(errors)}
			<Button type="submit" variant="primary">
				{t('form.join_classroom.submit')}
			</Button>
		</Form>
	);
};

export default JoinClassroomForm;