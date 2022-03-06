import React from 'react';
import { classNames } from '../../../Types/utils';

type CustomProps = {};

type LabelProps = CustomProps &
	React.DetailedHTMLProps<
		React.LabelHTMLAttributes<HTMLLabelElement>,
		HTMLLabelElement
	>;

/**
 * Styled Group for label and input
 *
 * @author Enric Soldevila
 */
const FormLabel: React.FC<LabelProps> = ({ className, ...props }) => {
	return (
		<label
			className={classNames('block text-base mb-2', className)}
			{...props}
		/>
	);
};

export default FormLabel;
