import { useContext, useEffect } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import IoTScript from '../IoTScript/IoTScript';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AsScript } from '../../../../Models/AsScript/as-script.entity';
import { UserContext } from '../../../../state/contexts/UserContext';

const IoTProjectScripts = () => {
	const { canEdit, project, loadIoTScripts, createScript } =
		useContext(IoTProjectContext);
	const { user } = useContext(UserContext);

	useEffect(() => {
		const getScripts = async () => {
			await loadIoTScripts();
		};
		getScripts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	console.log(project?.scripts);

	return (
		<div className="w-full h-full overflow-y-auto">
			<h6>
				Scripts{' '}
				{canEdit && (
					<IconButton
						onClick={() =>
							user &&
							createScript(
								new AsScript('Untitled', '# Write your code here', user),
							)
						}
						icon={faPlus}
					/>
				)}
			</h6>
			{project?.scripts && project?.scripts.length > 0 ? (
				project.scripts.map((script, idx) => (
					<IoTScript key={idx} script={script} odd={idx % 2 !== 0}></IoTScript>
				))
			) : (
				<label>Empty</label>
			)}
		</div>
	);
};

export default IoTProjectScripts;
