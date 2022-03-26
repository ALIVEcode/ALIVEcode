
export enum CompileStatus {
  INTERRUPT = 'interrupted',
}

export type SupportedLanguagesAS = "fr" | "en" | "es"

export class CompileDTO {
	lang?: SupportedLanguagesAS;


	backendCompiling?: boolean;

	lines?: string;

	status?: CompileStatus;

	idToken?: string;

	responseData?: string[];

	context?: { [val: string]: any };
}
