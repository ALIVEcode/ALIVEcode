import { useContext, useEffect } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import IoTScript from '../IoTScript/IoTScript';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AsScript } from '../../../../Models/AsScript/as-script.entity';
import { UserContext } from '../../../../state/contexts/UserContext';
import { IoTProjectObject } from '../../../../Models/Iot/IoTprojectObject.entity';

const IoTProjectScripts = ({
	mode,
	objectToLink,
}: {
	mode?: 'script-linking';
	objectToLink?: IoTProjectObject;
}) => {
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

	return (
		<div className="w-full h-full overflow-y-auto">
			<h6>
				Scripts{' '}
				{canEdit && (
					<IconButton
						onClick={() =>
							user &&
							createScript(
								new AsScript(
									'Untitled',
									'# Write your code here\n\nutiliser Aliot',
									user,
								),
							)
						}
						icon={faPlus}
					/>
				)}
			</h6>
			{project?.scripts && project?.scripts.length > 0 ? (
				project.scripts.map((script, idx) => (
					<IoTScript
						mode={mode}
						objectToLink={objectToLink}
						key={idx}
						script={script}
						odd={idx % 2 !== 0}
					/>
				))
			) : (
				<label>Empty</label>
			)}
		</div>
	);
};

export default IoTProjectScripts;
