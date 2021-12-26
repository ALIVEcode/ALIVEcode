import styled from 'styled-components';
import { AlertConfirmProps } from './alertConfirmTypes';
import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(Modal)`
	z-index: 1075;

	.modal-content {
		background-color: var(--background-color);
		color: white;
	}

	.modal-header {
		background-color: var(--contrast-color);
		display: block;
		text-align: center;
	}

	.modal-body {
		display: flex;
		justify-content: space-evenly;
	}
`;

/**
 * Modal used to confirm an action (for example: deleting something)
 *
 * @param {() => void} onClose when the modal is closed
 * @param {() => void} onConfirm when the action is confirmed
 * @param {() => void} onCancel when the action is cancelled
 * @param {ModalProps} other other normal modal props
 *
 * @author MoSk3
 */
const AlertConfirm = ({
	onClose,
	onConfirm,
	onCancel,
	...other
}: AlertConfirmProps) => {
	const { t } = useTranslation();

	return (
		<StyledModal
			backdropClassName="modal-backdrop-alert-confirm"
			closeButton={false}
			hideFooter
			size="md"
			centered
			{...other}
		>
			<Button
				padding="15px"
				variant="primary"
				onClick={() => {
					onClose();
					onCancel && onCancel();
				}}
			>
				{t('modal.cancel')}
			</Button>
			<Button
				padding="15px"
				variant="danger"
				onClick={() => {
					onClose();
					onConfirm && onConfirm();
				}}
			>
				{t('modal.confirm')}
			</Button>
		</StyledModal>
	);
};

export default AlertConfirm;