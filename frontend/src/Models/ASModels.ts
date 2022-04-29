import { SUPPORTED_LANG } from './Challenge/challenge.entity';

export enum CompileStatus {
	INTERRUPT = 'interrupted',
}

export type SupportedLanguagesAS = SUPPORTED_LANG;

export class CompileDTO {
	lang?: SupportedLanguagesAS;

	backendCompiling?: boolean;

	lines?: string;

	status?: CompileStatus;

	idToken?: string;

	responseData?: string[];

	context?: { [val: string]: any };
}
