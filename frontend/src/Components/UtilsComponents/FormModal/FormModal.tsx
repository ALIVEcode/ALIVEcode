import { cloneElement, isValidElement } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Button from '../Button/Button';
import { FormModalProps } from './formModalTypes';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(Modal)`
	.modal-content {
		background-color: var(--background-color);
	}

	.close {
		color: var(--foreground-color);
	}
`;

/**
 * Modal containing a Form component (the one used to create a relation in the db) in the children
 *
 * @param {form} children the form;
 * @param {string} title title of the modal
 * @param {boolean} open if the modal is open or closed
 * @param {boolean} closeButton if the button should have the closeButton
 * @param {ButtonVariants} buttonVariant variant of the submit button
 * @param {() => any} onClose callback called when the modal closes
 * @param {(res) => any} onClose callback called with the result when the form is submitted
 *
 * @author MoSk3
 */
const FormModal = ({
	children: form,
	title,
	open,
	closeButton,
	buttonVariant,
	onClose,
	onSubmit,
}: FormModalProps) => {
	const { t } = useTranslation();

	const makeChildrenWithProps = () => {
		return (
			form && isValidElement(form) && cloneElement(form as any, { onSubmit })
		);
	};

	return (
		<StyledModal show={open} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{makeChildrenWithProps()}</Modal.Body>
			<Modal.Footer>
				{(closeButton ?? true) && (
					<Button variant="secondary" onClick={onClose}>
						{t('modal.cancel')}
					</Button>
				)}
				{/*<Button variant={buttonVariant || 'primary'} onClick={onClose}>
					{t('modal.save')}
				</Button>
				*/}
			</Modal.Footer>
		</StyledModal>
	);
};

export default FormModal;