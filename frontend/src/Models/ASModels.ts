
export enum CompileStatus {
  INTERRUPT = 'interrupted',
}

export class CompileDTO {
	backendCompiling?: boolean;

	lines?: string;

	status?: CompileStatus;

	idToken?: string;

	responseData?: string[];

	context?: { [val: string]: any };
}
