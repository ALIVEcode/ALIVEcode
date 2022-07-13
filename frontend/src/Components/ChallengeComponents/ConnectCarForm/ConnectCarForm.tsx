import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef, useContext } from 'react';
import Button from '../../UtilsComponents/Buttons/Button';
import { UserContext } from '../../../state/contexts/UserContext';
import { ConnectCarFormProps } from './connectCarFormTypes';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';

/**
 * Component used to connect to a car
 *
 * @author Enric Soldevila
 */
const ConnectCarForm = ({ setOpen }: ConnectCarFormProps) => {
	const { t } = useTranslation();
	const { userSocket: playSocket } = useContext(UserContext);
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
					setOpen(false);
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
		<form onSubmit={handleSubmit(SubmitForm)} className="mt-4">
			<InputGroup
				label={t('simulation.modal.connect_car.label')}
				placeholder={t('simulation.modal.connect_car.id')}
				errors={notFound || errors.code?.type}
				messages={{
					notFound: t('simulation.modal.connect_car.invalid'),
				}}
				{...register('id', {
					required: true,
				})}
			/>
			<Button className="mt-4" type="submit" variant="third">
				{t('simulation.modal.connect_car.button')}
			</Button>
		</form>
	);
};

export default ConnectCarForm;
