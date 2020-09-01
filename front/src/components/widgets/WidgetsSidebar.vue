<template>
  <div class="widgets-sidebar">
    <Spinner v-if="!hasWidgets"></Spinner>
    <div class="widgets-sidebar-wrapper">
      <transition-group name="list" tag="ul" class="list-unstyled" appear>
        <li
          v-for="widget in getInactiveWidgets"
          :key="widget.props.id"
          class="widget-menu-item text-white"
        >
          <span>{{widget.props.name}}</span>
          <button class="btn btn-light btn-sm" @click="addWidgetToContainer(widget.props.id)">
            <i class="fa fa-plus"></i>
          </button>
        </li>
      </transition-group>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import Spinner from '../common/Spinner';

  export default {
    name: "InactiveWidgetsContainer",
    components: {Spinner},
    computed: mapGetters(['getInactiveWidgets', 'hasWidgets']),
    methods: {
      ...mapActions(['enableWidget']),
      async addWidgetToContainer(id) {
        const vacationId = this.$router.currentRoute.params.id;
        const widgetId = id;
        await this.enableWidget({widgetId, vacationId});
      }
    }
  }
</script>

<style scoped>

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(300px);
  }

  .list-leave-active {
    position: absolute;
  }

  .widget-menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ffffff;
    padding: 8px 15px;
    transition: all .3s;
  }

  .widget-menu-item:hover {
    background-color: #343a40;
  }

</style>
