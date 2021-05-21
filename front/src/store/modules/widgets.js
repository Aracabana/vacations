import request from "../../utils/request";
import router from '../../router'
import WidgetFactory from '../../utils/WidgetsFactory';

export default {
  state: {
    widgets: [],
    filteredWidgets: [],
  },
  actions: {
    async loadWidgets({commit}, vacationId) {
      try {
        const {widgets} = await request(`/api/widgets?vacationId=${vacationId}`);
        commit('setWidgets', widgets);
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message});
      }
    },

    async disableWidget({commit, state}, {widgetId, vacationId}) {
      try {
        const requestData = {widgetId, vacationId};
        const response = await request('/api/widgets', 'DELETE', requestData);
        if (response.ok) {
          commit('setWidgets', [...state.widgets.map(widget => {
            if (widget.id === widgetId) {
              widget.isActive = 0;
            }
            return widget;
          })]);
        }
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message});
      }
    },

    async enableWidget({commit, state}, {widgetId, vacationId}) {
      try {
        const requestData = {widgetId, vacationId};
        const response = await request('/api/widgets', 'POST', requestData);
        if (response.ok) {
          commit('setWidgets', [...state.widgets.map(widget => {
            if (widget.id === widgetId) {
              widget.isActive = 1;
            }
            return widget;
          })])
        }
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message})
      }
    }
  },
  mutations: {
    setWidgets: (state, widgets) => state.widgets = widgets
  },
  getters: {
    hasWidgets(state) {
      return state.widgets.length;
    },
    getActiveWidgets(state) {
      return state.widgets
        .filter(widget => widget.isActive)
        .map(WidgetFactory);
    },
    getInactiveWidgets(state) {
      return state.widgets
        .filter(widget => !widget.isActive)
        .map(WidgetFactory)
    }
  }
}
