import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import useWaitBeforeUpdate from '../../../../state/hooks/useWaitBeforeUpdate';
import { StyledLineInterface } from '../../../ChallengeComponents/LineInterface/lineInterfaceTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import 'ace-builds/src-noconflict/mode-json';
import { useTranslation } from 'react-i18next';

const IoTProjectDocuments = () => {
	const { project, updateDocument } = useContext(IoTProjectContext);
	const { t } = useTranslation();

	const defaultState = JSON.stringify(project?.document, null, '\t');

	const [isLive, setIsLive] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(false);
	const [doc, setDoc] = useWaitBeforeUpdate<string>(
		{
			wait: 500,
			onUpdate: () => {
				try {
					const c = JSON.parse(doc, (key: string, value: any) => {
						if (value === null) throw new Error('null');
						return value;
					});
					updateDocument(c);
					setSaving(false);
					setError(false);
				} catch {
					setError(true);
				}
			},
		},
		defaultState,
	);

	useEffect(() => {
		if (project?.document && isLive)
			setDoc(JSON.stringify(project.document, null, '\t'));
	}, [project?.document]);

	return (
		<StyledLineInterface className="w-full h-full">
			<div className="flex flex-col !h-full ">
				<div className="flex justify-between items-center">
					<div className="flex justify-start items-center">
						<h2 className="text-2xl font-bold pr-2">
							{t('iot.project.document.update_mode')}:{' '}
						</h2>
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
								{t('iot.project.document.live')}
							</button>
							{error && (
								<span className="text-red-600 pl-4 text-sm">
									<i>{t('iot.project.document.error')}</i>
								</span>
							)}
						</div>
					</div>
					<span className="pr-3">
						{saving ? t('msg.saving') : t('msg.saved')}
					</span>
				</div>
				<AceEditor
					onInput={e => {
						if (e.ctrlKey && e.key === 's') {
							setSaving(true);
						}
					}}
					className="!w-full !h-full"
					mode="json"
					theme="twilight"
					fontSize="14px"
					value={doc}
					onChange={content => {
						setSaving(true);
						setDoc(content);
					}}
				/>
			</div>
		</StyledLineInterface>
	);
};

export default IoTProjectDocuments;
