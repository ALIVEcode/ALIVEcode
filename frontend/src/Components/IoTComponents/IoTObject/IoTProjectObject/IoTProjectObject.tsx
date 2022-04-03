import { IoTProjectObjectProps } from './iotProjectObjectTypes';
import { classNames } from '../../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
	faPlayCircle,
	faServer,
	faStopCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import Link from '../../../UtilsComponents/Link/Link';

const IoTProjectObject = ({ object, odd }: IoTProjectObjectProps) => {
	const { project, connectObjectToProject, disconnectObjectFromProject } =
		useContext(IoTProjectContext);

	const iconProps: { size: SizeProp; className: string } = {
		size: '3x',
		className: 'cursor-pointer',
	};

	const target = object.target;

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
					<label className="text-normal tablet:text-xl">
						{object.iotObject.name}
					</label>
				</div>
				{target ? (
					object.iotObject.currentIoTProjectId !== project?.id ? (
						<div>
							<Link
								className="cursor-pointer"
								onClick={() => connectObjectToProject(target)}
							>
								Connect object to project
							</Link>
						</div>
					) : (
						<div>
							<Link
								className="cursor-pointer !text-[color:var(--danger-color)]"
								onClick={() => disconnectObjectFromProject(target)}
							>
								Disconnect object from project
							</Link>
						</div>
					)
				) : (
					<div>
						<Link
							className="cursor-pointer"
							onClick={() => console.log('Not Implemented')}
						>
							Select target
						</Link>
					</div>
				)}
			</div>
			<div className="flex gap-4">
				<div className="">
					<FontAwesomeIcon icon={faPlayCircle} {...iconProps} />
				</div>
				<div className="">
					<FontAwesomeIcon icon={faStopCircle} {...iconProps} />
				</div>
				<div className="">
					<FontAwesomeIcon icon={faServer} {...iconProps} />
				</div>
			</div>
		</div>
	);
};

export default IoTProjectObject;
