import { IoTProjectObjectProps } from './iotProjectObjectTypes';
import { classNames } from '../../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
	faPlayCircle,
	faServer,
	faStopCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useRef, useMemo, useEffect } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import Link from '../../../UtilsComponents/Link/Link';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AliotASExecutor from '../../../../Pages/Challenge/ChallengeIoT/AliotASExecutor';
import { UserContext } from '../../../../state/contexts/UserContext';

const IoTProjectObject = ({
	object,
	odd,
	mode,
	scriptToLink,
}: IoTProjectObjectProps) => {
	const {
		project,
		connectObjectToProject,
		disconnectObjectFromProject,
		setLogsOpen,
		setScriptOfObject,
	} = useContext(IoTProjectContext);
	const { user } = useContext(UserContext);

	const iconProps: { size: SizeProp; className: string } = {
		size: '3x',
		className: 'cursor-pointer text-[color:var(--fg-shade-four-color)]',
	};

	const target = object.target;

	const executor = useRef<AliotASExecutor | null>(null);

	executor.current = useMemo(
		() =>
			(executor.current = new AliotASExecutor(object.id.toString(), () => {})),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user],
	);

	useEffect(() => {}, [object.script]);

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
				<div className="text-normal text-center tablet:text-left tablet:text-xl">
					{object.iotObject.name}
				</div>
				<div>
					{mode === 'script-linking' && scriptToLink ? (
						scriptToLink.id === object.scriptId ? (
							<Link
								className="cursor-pointer text-center tablet:text-left !text-[color:var(--danger-color)]"
								onClick={() => setScriptOfObject(object, scriptToLink)}
							>
								Unlink
							</Link>
						) : (
							<Link
								className="cursor-pointer text-center tablet:text-left"
								onClick={() => setScriptOfObject(object, scriptToLink)}
							>
								Link
							</Link>
						)
					) : target ? (
						object.iotObject.currentIoTProjectId !== project?.id ? (
							<Link
								className="cursor-pointer text-center tablet:text-left"
								onClick={() => connectObjectToProject(target)}
							>
								Connect object to project
							</Link>
						) : (
							<Link
								className="cursor-pointer text-center tablet:text-left !text-[color:var(--danger-color)]"
								onClick={() => disconnectObjectFromProject(target)}
							>
								Disconnect object from project
							</Link>
						)
					) : (
						<Link
							className="cursor-pointer text-center tablet:text-left"
							onClick={() => console.log('Not Implemented')}
						>
							Select target
						</Link>
					)}
				</div>
			</div>
			<div className="flex items-center gap-4">
				{mode !== 'script-linking' && (
					<>
						<div>
							<FontAwesomeIcon
								onClick={() => executor.current?.run()}
								icon={faPlayCircle}
								{...iconProps}
							/>
						</div>
						<div>
							<FontAwesomeIcon icon={faStopCircle} {...iconProps} />
						</div>
						<div>
							<FontAwesomeIcon
								onClick={() => setLogsOpen(target)}
								icon={faServer}
								{...iconProps}
							/>
						</div>
					</>
				)}
				<div>
					<FontAwesomeIcon
						className="ml-4 cursor-pointer"
						size="lg"
						icon={faTimes}
					/>
				</div>
			</div>
		</div>
	);
};

export default IoTProjectObject;
