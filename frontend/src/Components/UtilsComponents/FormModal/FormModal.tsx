import { cloneElement, isValidElement } from 'react';
import styled from 'styled-components';
import { FormModalProps } from './formModalTypes';
import Modal from '../Modal/Modal';
import { classNames } from '../../../Types/utils';

/**
 * Modal containing a Form component (the one used to create a relation in the db) in the children
 *
 * @param {form} children the form;
 * @param {string} title title of the modal
 * @param {boolean} open if the modal is open or closed
 * @param {boolean} closeButton if the button should have the closeButton
 * @param {ButtonVariants} buttonVariant variant of the submit button
 * @param {() => any} setOpen method to change modal open state
 *
 * @author Enric Soldevila
 */
const FormModal = ({ children: form, onSubmit, ...props }: FormModalProps) => {
	const makeChildrenWithProps = () => {
		return (
			form && isValidElement(form) && cloneElement(form as any, { onSubmit })
		);
	};

	return (
		<Modal
			hideFooter={'hideFooter' in props ? props['hideFooter'] : true}
			closeCross
			{...props}
		>
			{makeChildrenWithProps()}
		</Modal>
	);
};

export default FormModal;
