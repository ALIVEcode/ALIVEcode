export class WebServerClient {
	webSocket: WebSocket | null;

	constructor(
		private protocol: string,
		private hostname: string,
		private port: number,
		private endpoint: string,
	) {
		this.webSocket = null;

		this.protocol = protocol;
		this.hostname = hostname;
		this.port = port;
		this.endpoint = endpoint;
	}

	getServerUrl() {
		return (
			this.protocol + '://' + this.hostname + ':' + this.port + this.endpoint
		);
	}

	connect() {
		try {
			this.webSocket = new WebSocket(this.getServerUrl());

			//
			// Implement WebSocket event handlers!
			//
			this.webSocket.onopen = function (event) {
				if (process.env.DEBUG)
					console.log('onopen::' + JSON.stringify(event, null, 4));
			};

			this.webSocket.onmessage = function (event) {
				var msg = event.data;
				if (process.env.DEBUG)
					console.log('onmessage::' + JSON.stringify(msg, null, 4));
			};
			this.webSocket.onclose = function (event) {
				if (process.env.DEBUG)
					console.log('onclose::' + JSON.stringify(event, null, 4));
			};
			this.webSocket.onerror = function (event) {
				if (process.env.DEBUG)
					console.log('onerror::' + JSON.stringify(event, null, 4));
			};
		} catch (exception) {
			if (process.env.DEBUG) console.error(exception);
		}
	}

	getStatus() {
		return this.webSocket?.readyState;
	}

	send(message: string) {
		if (this.webSocket?.readyState === WebSocket.OPEN) {
			this.webSocket.send(message);
		} else {
			if (process.env.DEBUG)
				console.error(
					'webSocket is not open. readyState=' + this.webSocket?.readyState,
				);
		}
	}

	disconnect() {
		if (this.webSocket?.readyState === WebSocket.OPEN) {
			this.webSocket.close();
		} else {
			if (process.env.DEBUG)
				console.error(
					'webSocket is not open. readyState=' + this.webSocket?.readyState,
				);
		}
	}
}
