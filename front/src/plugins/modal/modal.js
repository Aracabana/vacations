export default class Modal {
  constructor() {
    this.container = null;
  }

  show(component, componentProps, modalProps = null) {
    if (!component) {
      return;
    }
    this.container.show(component, componentProps, modalProps);
  }

  close() {
    this.container.destroyModal();
  }

}
