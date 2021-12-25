import { AsScript as AsScriptModel } from '../../../../Models/AsScript/as-script.entity';
import AsScript from '../../../AliveScriptComponents/AsScript/AsScript';
import Button from '../../../UtilsComponents/Button/Button';
import { IoTRouteSettingsProps } from './iotRouteSettingsTypes';
import api from '../../../../Models/api';
import { useContext } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import Form from '../../../UtilsComponents/Form/Form';
import { Form as BootForm } from 'react-bootstrap';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';

const IoTRouteSettings = ({ route }: IoTRouteSettingsProps) => {
	const { asScript: script } = route;
	const { project, canEdit, updateScript, updateRoute } =
		useContext(IoTProjectContext);

	if (!project) return <LoadingScreen />;

	return (
		<div>
			<Form
				onSubmit={res => {
					const { name, path } = res.data;
					route.path = path;
					route.name = name;
					updateRoute(route);
				}}
				disabled={!canEdit}
				action={FORM_ACTION.PATCH}
				name="iot route"
				url={`iot/routes/projects/${project.id}/${route.id}`}
				inputGroups={[
					{
						name: 'name',
						required: true,
						default: route.name,
						inputType: 'text',
					},
					{
						name: 'path',
						required: true,
						default: route.path,
						inputType: 'text',
					},
				]}
			/>
			<hr />
			<BootForm.Label style={{ display: 'block' }} className="mt-2">
				Execution Script
			</BootForm.Label>
			{script ? (
				<AsScript
					onSave={(asScript: AsScriptModel) => {
						updateScript(route, asScript);
					}}
					asScript={script}
				></AsScript>
			) : (
				<Button
					variant="primary"
					onClick={async () => {
						const asScript = new AsScriptModel();
						asScript.content = '# New Script';
						asScript.name = `Script for route ${route.name}`;
						const script = await api.db.iot.projects.createScriptRoute(
							project.id,
							route.id,
							asScript,
						);
						updateScript(route, script);
					}}
				>
					New script
				</Button>
			)}
		</div>
	);
};

export default IoTRouteSettings;