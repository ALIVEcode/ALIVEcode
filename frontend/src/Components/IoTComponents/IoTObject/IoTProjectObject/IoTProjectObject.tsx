import { IoTProjectObjectProps } from './iotProjectObjectTypes';
import { classNames } from '../../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
	faPlayCircle,
	faServer,
	faStopCircle,
	faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import Link from '../../../UtilsComponents/Link/Link';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useForceUpdate } from '../../../../state/hooks/useForceUpdate';
import { useAlert } from 'react-alert';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTProjectScripts from '../../IoTProject/IoTProjectScripts/IoTProjectScripts';
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
		socket,
		addRunningObject,
		removeRunningObject,
	} = useContext(IoTProjectContext);

	const [open, setOpen] = useState(false);

	const iconProps: { size: SizeProp; className: string } = {
		size: '3x',
		className: 'cursor-pointer text-[color:var(--fg-shade-four-color)]',
	};

	const target = object.target;

	const forceUpdate = useForceUpdate();

	const alert = useAlert();
	const { user } = useContext(UserContext);

	if (!object.hasExecutor() && socket && user) {
		object.initializeExecutor(socket, user, alert);
	}

	const executor = object.executor;

	const [executing, setExecuting] = useState(executor?.running);

	const [executionError, setExecutionError] = useState(
		executor?.running && executor?.error !== undefined,
	);

	useEffect(() => {
		if (!executor || !object.script?.content) return;
		executor.lineInterfaceContent = object.script?.content;
		executor.doBeforeInterrupt(() => {
			setExecutionError(true);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [executor]);

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
						<>
							<Link
								className="cursor-pointer text-center tablet:text-left"
								onClick={() => setOpen(true)}
							>
								{object.script ? 'Change script' : 'Add script'}
							</Link>
							<br />
							{object.iotObject.currentIoTProjectId !== project?.id ? (
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
							)}
						</>
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
								onClick={() => {
									if (!executor || !object.script) return;
									executor.toggleExecution();
									setExecuting(!executing);
									setExecutionError(false);
									if (executor.running) addRunningObject(object);
									else removeRunningObject(object);
									forceUpdate();
								}}
								icon={
									executing
										? executionError
											? faTimesCircle
											: faStopCircle
										: faPlayCircle
								}
								{...iconProps}
								title={executor?.error}
								className={classNames(
									'cursor-pointer',
									executing
										? executionError
											? ' text-[color:#FF4C29] hover:text-[color:rgb(#FF4C29,0.7)]'
											: ' text-[color:var(--fourth-color)] hover:text-[color:rgb(var(--fourth-color-rgb),0.7)]'
										: ' text-[color:var(--fg-shade-four-color)] hover:text-[color:rgb(var(--fg-shade-four-color-rgb),0.7)]',
									!object.script && 'opacity-50 cursor-not-allowed',
								)}
							/>
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
			<Modal title="Linking" open={open} setOpen={setOpen} size="lg">
				<IoTProjectScripts objectToLink={object} mode="script-linking" />
			</Modal>
		</div>
	);
};

export default IoTProjectObject;
