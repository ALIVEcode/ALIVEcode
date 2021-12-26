
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useRef, useContext } from 'react';
import Button from '../../UtilsComponents/Button/Button';
import { UserContext } from '../../../state/contexts/UserContext';
import { ConnectCarFormProps } from './connectCarFormTypes';

/**
 * Component used to connect to a car
 *
 * @author MoSk3
 */
const ConnectCarForm = ({ onClose }: ConnectCarFormProps) => {
	const { t } = useTranslation();
	const { playSocket } = useContext(UserContext);
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

	const SubmitForm = async ({ id }: { id: string }) => {
		if (!playSocket) return;
		try {
			playSocket.robotConnect(id, data => {
				if (data.event === 'success') {
					onClose();
					setNotFound(false);
				} else if (data.event === 'error') {
					console.log(data.error);
					setNotFound(true);
					timeout.current = setTimeout(() => {
						setNotFound(false);
					}, 5000);
				}
			});
		} catch {}
	};

	return (
		<Form onSubmit={handleSubmit(SubmitForm)}>
			<Form.Group>
				<Form.Label>{t('simulation.modal.connect_car.label')}</Form.Label>
				<InputGroup hasValidation>
					<Form.Control
						isInvalid={notFound || errors.code?.type}
						placeholder={t('simulation.modal.connect_car.id')}
						{...register('id', {
							required: true,
						})}
					/>
					<Form.Control.Feedback type="invalid">
						{notFound &&
							!errors.code &&
							t('simulation.modal.connect_car.invalid')}
						{errors.code?.type === 'required' && t('form.error.required')}
					</Form.Control.Feedback>
				</InputGroup>
			</Form.Group>
			<Button type="submit" variant="primary">
				{t('simulation.modal.connect_car.button')}
			</Button>
		</Form>
	);
};

export default ConnectCarForm;
