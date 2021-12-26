import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';
import { typeAskForUserInput } from '../levelTypes';

export default class LevelIoTExecutor extends LevelCodeExecutor {
	constructor(
		public levelName: string,
		protected askForUserInput: typeAskForUserInput,
	) {
		super(levelName, askForUserInput);

		this.setBackendContext({
			backendCompiling: true,
		});
	}
}
