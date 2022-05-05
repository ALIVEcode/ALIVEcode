import ChallengeCodeExecutor from '../ChallengeCode/ChallengeCodeExecutor';
import { typeAskForUserInput } from '../challengeTypes';
import { CompileDTO } from '../../../Models/ASModels';

export default class ChallengeIoTExecutor extends ChallengeCodeExecutor {
	constructor(
		public challengeName: string,
		protected askForUserInput: typeAskForUserInput,
	) {
		super(challengeName, askForUserInput);

		this.setBackendContext({
			backendCompiling: true,
		});
	}
}
