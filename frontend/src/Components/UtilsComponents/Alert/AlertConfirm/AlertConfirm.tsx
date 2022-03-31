import { AlertConfirmProps } from './alertConfirmTypes';
import Button from '../../Buttons/Button';
import { useTranslation } from 'react-i18next';
import Modal from '../../Modal/Modal';

/**
 * Modal used to confirm an action (for example: deleting something)
 *
 * @param {() => void} onClose when the modal is closed
 * @param {() => void} onConfirm when the action is confirmed
 * @param {() => void} onCancel when the action is cancelled
 * @param {ModalProps} other other normal modal props
 *
 * @author Enric Soldevila
 */
const AlertConfirm = ({
	setOpen,
	onConfirm,
	onCancel,
	children,
	...other
}: AlertConfirmProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			hideFooter
			size="sm"
			centered
			setOpen={setOpen}
			centeredText
			closeCross
			{...other}
		>
			{children}
			<div className="flex justify-evenly">
				<Button
					className="p-5"
					variant="third"
					onClick={() => {
						setOpen(false);
						onCancel && onCancel();
					}}
				>
					{t('modal.cancel')}
				</Button>
				<Button
					className="p-5"
					variant="danger"
					onClick={() => {
						setOpen(false);
						onConfirm && onConfirm();
					}}
				>
					{t('modal.confirm')}
				</Button>
			</div>
		</Modal>
	);
};

export default AlertConfirm;
