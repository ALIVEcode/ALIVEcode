export enum CompileStatus {
  INTERRUPT = 'interrupted',
}

export type typeAction = {
  label: string;
  type: 'NORMAL' | 'GET' | 'SET' | 'ERROR';
  apply: (params: any[], dodo?: number, response?: any[]) => any;
  handleNext?: boolean;
};