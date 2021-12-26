interface PlaySocketDeclaration extends WebSocket {
	compile_callback: (data: any) => void;
	robot_connect_callback: (data: any) => void;
	robot_callback: (data: any) => void;
}

export type CallbackData = {
	event: string;
	data?: any;
	error?: any;
};

export interface PlaySocket {
	compile: (
		lines: Array<string>,
		callback?: (data: CallbackData) => void,
	) => void;
	stopCompile: () => void;
	response: (resp?: Array<any>) => void;
	robotConnect: (id: string, callback: (data: CallbackData) => void) => void;
	onRobotReceive: (callback: (data: CallbackData) => void) => void;
}

const openPlaySocket = (): PlaySocket => {
	if (!process.env.REACT_APP_CAR_URL)
		throw new Error('REACT_APP_CAR_URL .env variable not set');
	let socket: WebSocket = new WebSocket(process.env.REACT_APP_CAR_URL);

	const playSocketConstructor = (socket: PlaySocketDeclaration) => {
		socket.compile_callback = () => {};
		socket.robot_connect_callback = () => {};
		socket.robot_callback = () => {};
		socket.onopen = e => {};
		socket.onclose = e => {
			setTimeout(() => {
				openPlaySocket();
			}, 2000);
		};
		socket.onmessage = e => {
			let parsed;
			try {
				parsed = JSON.parse(e['data']);
			} catch (exception) {
				return;
			}
			if ('event' in parsed && 'data' in parsed) {
				let event = parsed['event'];
				let data = parsed['data'];
				switch (event) {
					case 'compiled':
						console.log(data);
						socket.compile_callback(data);
						break;
					case 'robot-data':
						socket.robot_callback(data);
						break;
					case 'connect-success':
						socket.robot_connect_callback({
							event: 'success',
						});
						break;
					case 'connect-error':
						if (typeof data === 'string') {
							socket.robot_connect_callback({
								event: 'error',
								error: data,
							});
						}
						break;
					default:
						if (process.env.DEBUG) console.log(data);
				}
			}
		};
		socket.onerror = e => {
			if (process.env.DEBUG) console.log('error:', e);
		};

		const compile = (
			executionResult: any,
			callback: (data: any) => void = () => {},
		) => {
			executionResult = executionResult.filter((act: any) => act.id !== 0);
			let data = {
				event: 'execute',
				data: { executionResult },
			};
			socket.compile_callback = callback;
			socket.send(JSON.stringify(data));
		};

		const stopCompile = () => {
			let data = {
				event: 'execute',
				data: { executionResult: [{ id: 0, d: 0, p: [] }] },
			};
			socket.send(JSON.stringify(data));
		};

		const response = (resp: Array<any> = []) => {
			if (Array.isArray(resp)) {
				let data = {
					event: 'response',
					data: resp,
				};
				socket.send(JSON.stringify(data));
				console.log(data);
			}
		};

		const robotConnect = (id: string, callback: (data: any) => void) => {
			if (id != null && typeof id === 'string') {
				let data = {
					event: 'connect_watcher',
					data: { targets: [{ id }] },
				};
				socket.send(JSON.stringify(data));
			}
			socket.robot_connect_callback = callback;
		};

		const onRobotReceive = (callback: (data: any) => void) => {
			socket.robot_callback = callback;
		};

		return {
			compile,
			stopCompile,
			response,
			robotConnect,
			onRobotReceive,
		};
	};
	return playSocketConstructor(socket as PlaySocketDeclaration);
};

export default openPlaySocket;