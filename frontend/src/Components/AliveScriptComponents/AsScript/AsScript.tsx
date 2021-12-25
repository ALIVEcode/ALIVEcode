import LineInterface from '../../LevelComponents/LineInterface/LineInterface';
import { Col, Row } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import api from '../../../Models/api';
import { AsScriptProps } from './asScriptTypes';

export const AsScript = ({ asScript, onSave }: AsScriptProps) => {
	const [saving, setSaving] = useState(false);
	const content = useRef<string>(asScript.content);
	const saveTimeout = useRef<any>(null);

	useEffect(() => {
		return () => {
			saveTimeout.current && clearTimeout(saveTimeout.current);
		};
	}, []);

	const handleChange = async (newContent: string) => {
		setSaving(true);
		content.current = newContent;
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(save, 2000);
	};

	const save = async () => {
		await api.db.asScript.updateContent(asScript, content.current);
		asScript.content = content.current;
		onSave && onSave(asScript);
		setSaving(false);
	};

	return (
		<>
			<div style={{ height: '500px' }}>
				<Row className="h-100">
					<Col style={{ padding: '0' }}>
						<LineInterface
							handleChange={handleChange}
							initialContent={asScript.content}
						/>
					</Col>
				</Row>
			</div>
			{saving && 'Saving...'}
		</>
	);
};

export default AsScript;