import React from 'react';
import { classNames } from '../../../Types/utils';
import Info from '../../HelpComponents';

type CustomProps = {
	info?: string;
};

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
const FormLabel: React.FC<LabelProps> = ({ className, info, ...props }) => {
	return (
		<div className={classNames('block text-lg mb-2 relative', className)}>
			<label {...props} />
			{info && (
				<Info.Icon
					className="absolute right-0 top-0"
					// onClick={() => setTimelineOpen(true)}
					hoverPopup={{
						position: 'right center',
					}}
				>
					<Info.Box useDefaultStyle text={info} />
				</Info.Icon>
			)}
		</div>
	);
};

export default FormLabel;
