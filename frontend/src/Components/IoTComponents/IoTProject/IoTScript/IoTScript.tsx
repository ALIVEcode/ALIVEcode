import { IoTScriptProps } from './iotScriptTypes';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import Link from '../../../UtilsComponents/Link/Link';
import { classNames } from '../../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const IoTScript = ({ script, odd }: IoTScriptProps) => {
	const iconProps: { size: SizeProp; className: string } = {
		size: '3x',
		className: 'cursor-pointer',
	};
	console.log(script);

	return (
		<div
			className={classNames(
				'w-full flex justify-between',
				'flex-col py-10 px-5 gap-4 items-center',
				'tablet:flex-row',
				'desktop:px-10',
				odd
					? 'bg-[color:var(--background-color)]'
					: 'bg-[color:var(--bg-shade-one-color)]',
			)}
		>
			<div>
				<div>
					<label className="text-normal tablet:text-xl">{script.name}</label>
				</div>
				{!script.iotProjectObject && (
					<div>
						<Link
							className="cursor-pointer"
							onClick={() => console.log('Not implemented')}
						>
							Link script to object
						</Link>
					</div>
				)}
			</div>
			<div className="flex gap-4">
				<div>
					<FontAwesomeIcon icon={faPencilAlt} {...iconProps} />
				</div>
				<div>
					<FontAwesomeIcon icon={faTrash} {...iconProps} />
				</div>
			</div>
		</div>
	);
};

export default IoTScript;
