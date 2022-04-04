import { IoTLog, IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import Cmd from '../../../ChallengeComponents/Cmd/Cmd';
import { useRef, useEffect } from 'react';
import $ from 'jquery';
import {
	dangerLogs,
	IOT_EVENT,
	infoLogs,
	orangeLogs,
	successLogs,
} from '../../../../Models/Iot/IoTProjectClasses/IoTTypes';

const IoTObjectLogs = ({ object }: { object: IoTObject }) => {
	const cmd = useRef<HTMLDivElement>(null);

	const make_safe = (msg: string) =>
		msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const printLog = ({ event, date, text }: IoTLog) => {
		if (!cmd.current) return;
		const $cmd = $(cmd.current);

		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		const seconds = ('0' + date.getSeconds()).slice(-2);

		const getLogColor = () => {
			if (dangerLogs.includes(event)) return 'var(--danger-color)';
			if (orangeLogs.includes(event)) return 'orange';
			if (successLogs.includes(event)) return 'green';
			if (infoLogs.includes(event)) return 'var(--fg-shade-four-color)';
			return 'var(--foreground-color)';
		};

		text = make_safe(text);
		const entry = Object.entries(IOT_EVENT).find(entry => entry[1] === event);
		if (!entry) return;
		const eventStr = make_safe(entry[0]);
		$cmd.append(
			`<div style="color:${getLogColor()}"><u><i>${hours}:${minutes}:${seconds}:</i></u><strong> ${eventStr}</strong></div><div style="margin-bottom:0.40rem">${text}</div>`,
		);
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
			printLog(log);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

	return (
		<div className="h-[500px]">
			<Cmd ref={cmd} />;
		</div>
	);
};

export default IoTObjectLogs;
