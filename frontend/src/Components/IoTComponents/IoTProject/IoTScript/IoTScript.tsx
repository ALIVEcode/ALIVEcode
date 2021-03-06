import { IoTScriptProps } from './iotScriptTypes';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import Link from '../../../UtilsComponents/Link/Link';
import { classNames } from '../../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTProjectObjects from '../IoTProjectObjects/IoTProjectObjects';

const IoTScript = ({ script, odd, mode, objectToLink }: IoTScriptProps) => {
	const { setScriptOpen, setScriptOfObject } = useContext(IoTProjectContext);
	const [open, setOpen] = useState(false);

	const iconProps: { size: SizeProp; className: string } = {
		size: '3x',
		className: 'cursor-pointer',
	};

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
				{
					/* TODO : Find way to check if link is there */ true && (
						<div>
							{mode === 'script-linking' && objectToLink ? (
								objectToLink.script?.id === script.id ? (
									<Link
										className="cursor-pointer !text-[color:var(--danger-color)]"
										onClick={() => console.error('Not implemented')}
									>
										<>Unlink script</>
									</Link>
								) : (
									<Link
										className="cursor-pointer"
										onClick={() => setScriptOfObject(objectToLink, script)}
									>
										<>Link script with object "{objectToLink.target?.name}"</>
									</Link>
								)
							) : (
								<Link className="cursor-pointer" onClick={() => setOpen(true)}>
									Link script to object
								</Link>
							)}
						</div>
					)
				}
			</div>
			<div className="flex gap-4">
				{mode !== 'script-linking' && (
					<>
						<div>
							<FontAwesomeIcon
								onClick={() => setScriptOpen(script)}
								icon={faPencilAlt}
								{...iconProps}
							/>
						</div>
						<div>
							<FontAwesomeIcon icon={faTrash} {...iconProps} />
						</div>
					</>
				)}
			</div>
			<Modal title="Linking" open={open} setOpen={setOpen} size="lg">
				<IoTProjectObjects scriptToLink={script} mode="script-linking" />
			</Modal>
		</div>
	);
};

export default IoTScript;
