import { ChallengeExecutor } from '../AbstractChallengeExecutor';
import { typeAskForUserInput } from '../challengeTypes';
import { SupportedLanguagesAS } from '../../../Models/ASModels';

export default class ChallengeCodeExecutor extends ChallengeExecutor {
	constructor(
		public challengeName: string,
		protected askForUserInput: typeAskForUserInput,
		lang?: SupportedLanguagesAS,
	) {
		super(challengeName, lang);

		this.registerActions([
			{
				actionId: 300,
				action: {
					label: 'afficher',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'string') {
							this.cmd?.print(params[0]);
						}
					},
				},
			},
			{
				actionId: 301,
				action: {
					label: 'Wait',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'number') {
							this.wait(() => {
								this.perform_next();
							}, params[0] * 1000);
						} else {
							this.perform_next();
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 500,
				action: {
					label: 'Read Input',
					type: 'GET',
					apply: (params, _, response) => {
						this.askForUserInput(params[1], inputValue => {
							response?.push(inputValue);
							this.perform_next();
						});
					},
					handleNext: true,
				},
			},
		]);
	}
}
