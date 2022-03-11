import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { useContext } from 'react';
import AceEditor from 'react-ace';
import useWaitBeforeUpdate from '../../../../state/hooks/useWaitBeforeUpdate';
import 'ace-builds/src-noconflict/mode-json';
import { StyledLineInterface } from '../../../ChallengeComponents/LineInterface/lineInterfaceTypes';

const IoTProjectDocuments = () => {
	const { project, updateDocument } = useContext(IoTProjectContext);

	const [doc, setDoc] = useWaitBeforeUpdate<string>(
		{ wait: 1000, onUpdate: () => updateDocument(JSON.parse(doc)) },
		JSON.stringify(project?.document, null, '\t'),
	);

	return (
		<StyledLineInterface className="w-full h-full">
			<AceEditor
				className="!w-full !h-full"
				mode="json"
				theme="cobalt"
				value={doc}
				onChange={content => setDoc(content)}
			></AceEditor>
		</StyledLineInterface>
	);
};

export default IoTProjectDocuments;
