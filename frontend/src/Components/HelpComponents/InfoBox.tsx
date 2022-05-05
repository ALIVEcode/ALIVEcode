import { classNames } from '../../Types/utils';
import { InfoBoxProps } from './HelpProps';

const InfoBox = ({
	useDefaultStyle,
	className,
	children,
	text,
	title,
}: InfoBoxProps) => {
	return (
		<div
			className={classNames(
				useDefaultStyle &&
					'rounded-md bg-[color:rgb(var(--foreground-color-rgb),0.9)] p-2 ' +
						'text-[color:var(--background-color)] max-w-[30ch] text-wrap',
				className,
			)}
		>
			{text !== undefined ? <span>{text}</span> : children}
		</div>
	);
};
export default InfoBox;
