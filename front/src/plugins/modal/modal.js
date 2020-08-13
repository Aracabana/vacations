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

// const PluginCore = (Vue, options = {}) => {
//   const subscription = new Vue()
//
//   const context = {
//     root: null,
//     componentName: options.componentName || 'Modal'
//   }
//
//   const showStaticModal = (name, params) => {
//     subscription.$emit('toggle', name, true, params)
//   }
//
//   const showDynamicModal = (
//     component,
//     componentProps,
//     modalProps = {},
//     modalEvents
//   ) => {
//     const container = context.root?.__modalContainer
//     const defaults = options.dynamicDefaults || {}
//
//     container?.add(
//       component,
//       componentProps,
//       { ...defaults, ...modalProps },
//       modalEvents
//     )
//   }
//
//   const setDynamicModalContainer = parent => {
//     context.root = parent
//
//     const element = document.createElement('div');
//     document.body.appendChild(element);
//
//     new Vue({
//       parent,
//       render: h => h(ModalContainer)
//     }).$mount(element)
//   }
//
//   const show = (component) => {
//     context.root.__modalContainer.show(component);
//   }
//
//   return {
//     context,
//     subscription,
//     show,
//     setDynamicModalContainer
//   }
// }
// export default PluginCore;
