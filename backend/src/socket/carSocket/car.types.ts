import { WebSocket } from "ws";

export type CarClient = {
  id: string;
  socket: WebSocket;
};

export type WatcherClient = {
  socket: WebSocket;
  targets: ExecutionTarget[];
};

export type CarTarget = {
  id: string;
};

export type LightTarget = {
  id: string;
};

export type ExecutionTarget = CarTarget | LightTarget;

export type WatcherConnectPayload = {
  targets: ExecutionTarget[];
};

export type ExecutionCommand = {
  d: number;
  id: number;
  p: any[];
};

export type ExecutionPayload = {
  executionResult: ExecutionCommand[];
};

const byteRepresentation = {
  0: 88, // X
  100: 115, // s
  101: 102, // f
  102: 98, // b
  103: 116, // t
  107: 84, // T
  301: 119, // w
  601: 118, // v
  negative: 110, // n
  positive: 112, // p
};

const numberToBytes = (num: number, my_bytes: number[]) => {
  if (num < 0) my_bytes.push(byteRepresentation.negative);
  else my_bytes.push(byteRepresentation.positive);

  const absNum = Math.abs(num);
  if (absNum >= 256) {
    my_bytes.push(4); // Number of bytes

    my_bytes.push((absNum >> 24) % 256);
    my_bytes.push((absNum >> 16) % 256);
    my_bytes.push((absNum >> 8) % 256);
    console.log(my_bytes);
    my_bytes.push(absNum % 256);
    console.log(my_bytes);
  } else {
    my_bytes.push(1);
    my_bytes.push(absNum);
  }
  //return my_bytes.decode('ISO-8859-1')
};

export const convertExecutionToBytes = (
  executionResult: ExecutionCommand[],
): { bufArray: ArrayBuffer; bufView: any } => {
  const validDataStructure = (action: any) => {
    const ID = 'id';
    const DODO = 'd';
    const PARAMS = 'p';
    return (
      ID in action &&
      typeof action[ID] === 'number' &&
      DODO in action &&
      typeof action[DODO] === 'number' &&
      PARAMS in action &&
      Array.isArray(action[PARAMS])
    );
  };

  const bytes: number[] = [];
  executionResult.forEach(action => {
    if (!validDataStructure(action)) return;

    if (action.id in byteRepresentation) {
      bytes.push(byteRepresentation[action.id]);

      if (action.p.length > 0 && action.id != 0 && action.id != 100) {
        if (typeof action.p[0] !== 'number') return;
        numberToBytes(action.p[0], bytes);
      } else if (action.id === 106) {
        // TODO : Motor forces
      }
    }
  });

  const bufArray = new ArrayBuffer(bytes.length);
  const bufView = new Uint8Array(bufArray);

  for (let i = 0; i < bytes.length; i++) {
    bufView[i] = bytes[i];
  }

  return { bufArray, bufView };
};