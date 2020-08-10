import ModalContainer from "../../components/ModalContainer";

export default class Modal {
  constructor(Vue, options) {
    this.subscription = new Vue();
    this.container = null;
  }

  // setWrapper() {
  //   const div = document.createElement('div');
  //   div.classList.add('test');
  //   document.body.appendChild(div);
  //   return div;
  // }

  // setContainer(root) {
  //   this.root = root;
  //   const elem = this.setWrapper();
  //
  //   new Vue({
  //     root,
  //     render: h => h(ModalContainer)
  //   }).$mount(elem);
  // }

  show(component) {
    if (!component) {
      console.log('component not provided');
      return;
    }
    this.container.show(component);
  }

  hide() {
    this.subscription.$emit('toggle', name, false);
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
