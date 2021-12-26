import { Modal as BootModal } from 'react-bootstrap';
import styled from 'styled-components';
import Button from '../Button/Button';
import { ModalProps } from './modalTypes';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(BootModal)`
	${({ centeredText }) =>
		centeredText &&
		`
		text-align: center;

		.modal-header {
			justify-content: center;
		}
	`}

	.modal-content {
		background-color: var(--background-color);
	}

	.close {
		color: var(--foreground-color);
	}
`;

/**
 * Component used to show a custom styled modal
 *
 * @param {boolean} open State of the modal
 * @param {any} children Body content of the modal
 * @param {string} title Title shown in the header of the modal
 * @param {callback} onClose Callback called on close
 * Button props
 * @param {string} buttonVariant Show the closeButtons on the top right
 * @param {string} submitText Text of the submit button
 * @param {string} size Size of the modal
 * @param {boolean} closeCross Shows the closeButton on the top right
 * @param {boolean} hideCloseButton Hides the close button in the footer
 * Other
 * @param {boolean} hideFooter
 * @param {boolean} centered Centers the modal at the center of the screen
 * @param {boolean} centeredText Centers the text inside of the modal
 * @returns
 */
const Modal = (props: ModalProps) => {
	const {
		children,
		title,
		open,
		size,
		hideFooter,
		closeCross,
		buttonVariant,
		submitText,
		hideCloseButton,
		onClose,
		...other
	} = props;

	const { t } = useTranslation();

	return (
		<StyledModal size={size} show={open} onHide={onClose} {...other}>
			<BootModal.Header closeButton={closeCross}>
				<BootModal.Title>{title}</BootModal.Title>
			</BootModal.Header>
			<BootModal.Body>{children}</BootModal.Body>
			{!hideFooter && (
				<BootModal.Footer>
					{!hideCloseButton && (
						<Button variant="secondary" onClick={onClose}>
							{t('modal.close')}
						</Button>
					)}
					<Button variant={buttonVariant || 'primary'} onClick={onClose}>
						{submitText ?? t('modal.save')}
					</Button>
				</BootModal.Footer>
			)}
		</StyledModal>
	);
};

export default Modal;