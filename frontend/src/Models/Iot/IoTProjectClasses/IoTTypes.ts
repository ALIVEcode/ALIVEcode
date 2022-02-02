
export type IoTObjectTarget = {
  id: string;
}

export type IoTClusterTarget = {
	id: string;
};

export type IoTTarget =
	| IoTObjectTarget
	| IoTClusterTarget
	| Array<IoTObjectTarget | IoTClusterTarget>;