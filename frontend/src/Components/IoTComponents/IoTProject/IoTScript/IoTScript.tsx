import { IoTScriptProps } from './iotScriptTypes';

const IoTScript = ({ script }: IoTScriptProps) => {
	return (
		<div>
			<div>{script.name}</div>
		</div>
	);
};

export default IoTScript;
