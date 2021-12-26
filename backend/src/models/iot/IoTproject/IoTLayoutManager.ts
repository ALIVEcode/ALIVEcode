import { IoTProjectLayout, IOT_COMPONENT_TYPE } from './entities/IoTproject.entity';

class IoTError extends Error {}

export class IoTLayoutManager {
  constructor(private layout: IoTProjectLayout) {}

  getComponent(componentId: string) {
    const component = this.layout.components.find(c => c.id === componentId);
    if (!component) throw new IoTError(`No component with id ${componentId}`);

    return component;
  }

  updateComponent(componentId: string, value: any) {
    const component = this.getComponent(componentId);

    if (component.type === IOT_COMPONENT_TYPE.LOGS) {
      component.value.push({
        text: value,
        date: new Date(),
      });
    } else {
      component.value = value;
    }
  }

  getComponentValue(componentId: string) {
    const component = this.getComponent(componentId);
    return component.value;
  }
}