import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import Cmd from '../../../ChallengeComponents/Cmd/Cmd';
import { useRef, useEffect } from 'react';
import $ from 'jquery';

const IoTObjectLogs = ({ object }: { object: IoTObject }) => {
	const cmd = useRef<HTMLDivElement>(null);

	const make_safe = (msg: string) =>
		msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const print = (msg: string) => {
		if (!cmd.current) return;
		const $cmd = $(cmd.current);
		msg = make_safe(msg);
		//cmd.append(`<span><u><i>${heures}:${minutes}:${secondes}:</i></u> ${msg}</span><br>`)
		$cmd.append(`<pre>${msg}</pre>`);
		$cmd.scrollTop(cmd.current.scrollHeight);
	};

	/*const error = (msg: string, line: number) => {
		if (!cmd.current) return;
		const $cmd = $(cmd.current);
		msg = make_safe(msg);

		const errorName = msg.split(':', 1)[0];
		const errorMsg = msg.substring(msg.indexOf(':') + 1);

		//cmd.append(`<span style="color: red"><u><i>${heures}:${minutes}:${secondes}:</i></u> ${errorName}</span> à la ligne <strong>#${line} :<br></strong>"${msg}"<br>`)
		$cmd.append(
			`<span style="color: red">
					${errorTitle}:
			</span>
			<br>
			→ ${errorMsg}
			<br>`,
		);

		$cmd.scrollTop(cmd.current.scrollHeight);
	};*/

	useEffect(() => {
		object.logs.forEach(log => {
			print(log.text);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

	return <Cmd ref={cmd} />;
};

export default IoTObjectLogs;
