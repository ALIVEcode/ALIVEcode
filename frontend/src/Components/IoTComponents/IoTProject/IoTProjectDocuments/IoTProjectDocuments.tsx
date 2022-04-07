import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import useWaitBeforeUpdate from '../../../../state/hooks/useWaitBeforeUpdate';
import { StyledLineInterface } from '../../../ChallengeComponents/LineInterface/lineInterfaceTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import 'brace/mode/json';

const IoTProjectDocuments = () => {
	const { project, updateDocument } = useContext(IoTProjectContext);

	const defaultState = JSON.stringify(project?.document, null, '\t');

	const [isLive, setIsLive] = useState(true);

	const [saving, setSaving] = useState(false);

	const [isWriting, setIsWriting] = useWaitBeforeUpdate(
		{
			wait: 500,
			onUpdate: () => {
				isWriting && setIsWriting(false);
			},
		},
		false,
	);

	const [doc, setDoc] = useWaitBeforeUpdate<string>(
		{
			wait: 500,
			onUpdate: () => {
				try {
					if (isWriting) {
						return;
					}
					updateDocument(JSON.parse(doc));
					setSaving(false);
				} catch {}
			},
		},
		defaultState,
	);

	useEffect(() => {
		if (project?.document && isLive)
			setDoc(JSON.stringify(project.document, null, '\t'));
	}, [project?.document]);

	// TODO traductions pour "Update Mode:" et "LIVE"
	return (
		<StyledLineInterface className="w-full h-full">
			<div className="flex flex-col !h-full ">
				<div className="flex justify-between items-center">
					<div className="flex justify-start items-center">
						<h2 className="text-2xl font-bold pr-2">Update Mode: </h2>
						<div className="flex items-center">
							<button
								className={
									(isLive
										? 'text-red-600 bg-red-300'
										: 'text-gray-500 bg-gray-300') +
									' px-1 rounded-sm  top-5 z-[10000]'
								}
								onClick={() => {
									setIsLive(!isLive);
									if (project?.document && isLive)
										setDoc(JSON.stringify(project.document, null, '\t'));
								}}
							>
								<FontAwesomeIcon
									icon={faCircle}
									color={isLive ? 'red' : 'grey'}
									className="pr-1"
								/>
								LIVE
							</button>
						</div>
					</div>
					<span className="pr-3">{saving ? 'Saving...' : 'Saved'}</span>
				</div>
				<AceEditor
					className="!w-full !h-full"
					mode="json"
					theme="twilight"
					fontSize="14px"
					value={doc}
					onInput={e => {
						setIsWriting(true);
					}}
					onChange={content => {
						setDoc(content);
						setSaving(true);
					}}
				/>
			</div>
		</StyledLineInterface>
	);
};

export default IoTProjectDocuments;
