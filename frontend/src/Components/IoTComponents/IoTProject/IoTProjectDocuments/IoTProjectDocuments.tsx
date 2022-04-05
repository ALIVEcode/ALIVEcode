import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import useWaitBeforeUpdate from '../../../../state/hooks/useWaitBeforeUpdate';
import 'ace-builds/src-noconflict/mode-json';
import { StyledLineInterface } from '../../../ChallengeComponents/LineInterface/lineInterfaceTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const IoTProjectDocuments = () => {
	const { project, updateDocument } = useContext(IoTProjectContext);

	const defaultState = JSON.stringify(project?.document, null, '\t');

	const [isLive, setIsLive] = useState(true);

	const [doc, setDoc] = useWaitBeforeUpdate<string>(
		{
			wait: 1000,
			onUpdate: () => {
				try {
					updateDocument(JSON.parse(doc));
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
							onClick={() => setIsLive(!isLive)}
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
				<AceEditor
					className="!w-full !h-full"
					mode="json"
					theme="cobalt"
					fontSize="14px"
					value={doc}
					onChange={content => setDoc(content)}
				/>
			</div>
		</StyledLineInterface>
	);
};

export default IoTProjectDocuments;
