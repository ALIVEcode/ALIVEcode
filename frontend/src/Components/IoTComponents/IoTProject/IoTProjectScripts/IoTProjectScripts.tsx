import { useContext, useEffect } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import IoTScript from '../IoTScript/IoTScript';

const IoTProjectScripts = () => {
	const { project, loadIoTScripts } = useContext(IoTProjectContext);

	useEffect(() => {
		const getScripts = async () => {
			await loadIoTScripts();
		};
		getScripts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-full h-full overflow-y-auto">
			{project?.iotScripts && project?.iotScripts.length > 0 ? (
				project.iotScripts.map((script, idx) => (
					<IoTScript key={idx} script={script}></IoTScript>
				))
			) : (
				<label>Empty</label>
			)}
		</div>
	);
};

export default IoTProjectScripts;
