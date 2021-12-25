import { CompileStatus, typeAction } from "./ASModels";
import { AsScriptService } from './as-script.service';

export class BackendLevelExecutor {
  private timeouts: Array<NodeJS.Timeout> = [];
  public execution = false;
  public onToggleExecution?: (exec: any) => void;
  private idToken: string;
  private actionsResponse: { p: Array<any>; d: number; id: number }[] = [];
  private registeredActions: { [actionId: number]: typeAction } = {
    0: {
      label: 'Stop Execution',
      type: 'NORMAL',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      apply: () => {},
    },
  };

  public current_execution: {
    next: () => Promise<void>;
    getIndex: () => number;
  } | null;

  /** function called before the exection of the code */
  private _beforeRun: () => void;

  /** function called before the interruption of the execution of the code */
  private _beforeInterrupt: () => void;
  /** function called before the end of the exection of the code */
  private _beforeStop: () => void;
  /** function called after the end or the interruption of the exection of the code */
  private _afterStop: () => void;

  constructor(private asScriptService: AsScriptService, private actions: any) {}

  protected registerActions(actions: { actionId: number; action: typeAction }[]) {
    actions.forEach(action => (this.registeredActions[action.actionId] = action.action));
  }

  public async toggleExecution() {
    this.onToggleExecution && this.onToggleExecution(this);
    this.execution = !this.execution;
    this.execution ? await this.run() : this.interrupt();
  }

  public async run() {
    !this.execution && this.onToggleExecution && this.onToggleExecution(this);
    await this.onRun();
  }

  public stop() {
    this._beforeStop && this._beforeStop();
    this.execution && this.onToggleExecution && this.onToggleExecution(this);
    // Clear all the timouts of the execution
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    this.current_execution = null;
    this._afterStop && this._afterStop();
  }

  public async interrupt() {
    try {
      this._beforeInterrupt && this._beforeInterrupt();
    } finally {
      if (this.idToken) {
        await this.asScriptService.sendDataToAsServer({
          idToken: this.idToken,
          status: CompileStatus.INTERRUPT,
        });
      }
      this.stop();
    }
  }

  public throwError(errorType: string, errorMessage: string, line = 0) {
    this.actionsResponse.push({ id: 400, p: [errorType, errorMessage, line], d: 0 });
  }

  public getActionsResponse() {
    return this.actionsResponse;
  }

  private async executeNext(res: string[], firstTime = false) {
    /*const data = await this.asScriptService.sendDataToAsServer(
      firstTime
        ? {
            lines: this.lineInterfaceContent,
          }
        : {
            idToken: this.idToken,
            responseData: res,
          },
    );

    if (!data || !this.execution) {
      this.interrupt();
      return;
    }
    if (process.env.REACT_APP_DEBUG) console.log(data);
    if (data.status === 'ongoing') {
      this.idToken = data.idToken;
    }
    this.execute(data.result);*/
  }

  public async onRun() {
    this._beforeRun && this._beforeRun();
    try {
      // Envoie le code à exécuter au serveur
      await this.execute(this.actions);
    } catch (err) {
      this.interrupt();
    }
  }

  private perform_actions(actions: { id: number; params: any[]; dodo: number }[]) {
    const response: any[] = [];

    const perform_action = async (index: number) => {
      const action = actions[index];
      const performedAction = this.registeredActions[action.id];
      if (!(action.id in this.registeredActions)) {
        //console.error(`The action id: ${action.id} is not in the registered actions`);
        return await this.perform_next();
      }
      await performedAction.apply(action.params, action.dodo, response);

      if (!performedAction.handleNext && performedAction.type !== 'GET') await this.perform_next();
    };

    let i = -1;
    return {
      next: async () => {
        if (i >= 0) {
          const action = actions[i];
          if (action.id in this.registeredActions) {
            const performedAction = this.registeredActions[action.id];
            if (performedAction.type === 'GET') {
              const data = await this.asScriptService.sendDataToAsServer({
                idToken: this.idToken,
                responseData: response,
              });
              return await this.execute(data.result);
            }
          }
        }
        i++;
        if (i >= actions.length) return;
        await perform_action(i);
      },
      getIndex: () => i,
    };
  }

  public async perform_next() {
    this.current_execution && (await this.current_execution.next());
  }

  private async execute(actions: any[]): Promise<void> {
    const ID = 'id';
    const DODO = 'd';
    const PARAMS = 'p';

    const hasValidDataStructure = (action: any): boolean => {
      return (
        ID in action &&
        typeof action[ID] === 'number' &&
        DODO in action &&
        typeof action[DODO] === 'number' &&
        PARAMS in action &&
        Array.isArray(action[PARAMS])
      );
    };
    const formatedActions = actions.map(action => {
      if (!hasValidDataStructure(action)) {
        this.interrupt();
        throw new Error();
      }
      return {
        id: action[ID] as number,
        params: action[PARAMS] as any[],
        dodo: action[DODO] as number,
      };
    });

    this.current_execution = this.perform_actions(formatedActions);
    await this.current_execution.next();
  }

  public wait(callback: () => void, duration: number) {
    this.timeouts.push(setTimeout(callback, duration));
  }

  public doBeforeRun(callback: () => void): void {
    this._beforeRun = callback;
  }

  public doBeforeInterrupt(callback: () => void): void {
    this._beforeInterrupt = callback;
  }

  public doBeforeStop(callback: () => void): void {
    this._beforeStop = callback;
  }

  public doAfterStop(callback: () => void): any {
    this._afterStop = callback;
  }
}