import { BackendLevelExecutor } from "./BackendLevelExecutor";
import { AsScriptService } from './as-script.service';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';

export default class LevelIoTBackendExecutor extends BackendLevelExecutor {
  constructor(asScriptService: AsScriptService, iotProjectService: IoTProjectService, actions: any) {
    super(asScriptService, actions);

    this.registerActions([
      {
        actionId: 900,
        action: {
          label: 'update',
          type: 'NORMAL',
          apply: async params => {
            if (params.length >= 3 && typeof params[0] === 'string' && typeof params[1] === 'string') {
              const [projectId, id, value] = params;
              try {
                await iotProjectService.updateComponent(projectId, id, value, true);
              } catch (err) {
                console.log(err);
                return this.throwError('InvalidProjectIdError', 'Invalid project id');
              }
            }
          },
        },
      },
      {
        actionId: 400,
        action: {
          label: 'erreur',
          type: 'NORMAL',
          apply: async params => {
            if (params.length >= 3) {
              console.log('Ligne#' + params[2] + ' | ' + params[0] + ': ' + params[1]);
            }
          },
        },
      },
    ]);
  }
}
