<template>
  <div v-packery-item class="widget-item" :class="getContainerSize">
    <div class="widget" :class="{'expanded': expanded}">
      <div class="widget-header">
        <span class="widget-name">{{$attrs.name}}</span>
        <div class="widget-controls">
          <button class="btn btn-sm" disabled @click="toggleExpand()">
            <i class="fas fa-expand-alt text-secondary"></i>
          </button>
          <button class="btn btn-sm">
            <i class="fas fa-cog text-secondary"></i>
          </button>
          <button class="btn btn-sm" @click="removeFromContainer()">
            <i class="fas fa-trash-alt text-danger"></i>
          </button>
        </div>
      </div>
      <div class="widget-body">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: "widget",
    data() {
      return {
        visible: false,
        expanded: false
      }
    },
    computed: {
      getContainerSize() {
        const size = this.$attrs.containerSize;
        return [`width-${size}`];
      }
    },
    methods: {
      ...mapActions(['disableWidget']),

      toggleExpand() {
        this.expanded = !this.expanded;
      },

      async removeFromContainer() {
        const vacationId = this.$router.currentRoute.params.id;
        const widgetId = this.$attrs.id;
        await this.disableWidget({widgetId, vacationId});
      }
    }
  }
</script>

<style scoped>

  .widget-item {
    border-radius: .25rem;
  }

  .widget-item.is-dragging,
  .widget-item.is-positioning-post-drag {
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 2;
  }

  .widget {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, .125);
    border-radius: .25rem;
  }

  .expanded {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .60rem 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, .03);
    border-bottom: 1px solid rgba(0, 0, 0, .125);
  }

  .widget-header:hover {
    cursor: move;
  }

  .widget-body {
    position: relative;
    padding: 20px;
  }

  .width-1 {
    width: calc((1 / 12) * 1000px);
  }

  .width-2{
    width: calc((2 / 12) * 1000px);
  }

  .width-3{
    width: calc((3 / 12) * 1000px);
  }

  .width-4 {
    width: calc((4 / 12) * 1000px);
  }

  .width-5{
    width: calc((5 / 12) * 1000px);
  }

  .width-6{
    width: calc((6 / 12) * 1000px);
  }

  .width-7{
    width: calc((7 / 12) * 1000px);
  }

  .width-8 {
    width: calc((8 / 12) * 1000px);
  }

  .width-9 {
    width: calc((9 / 12) * 1000px);
  }

  .width-10 {
    width: calc((10 / 12) * 1000px);
  }

  .width-11 {
    width: calc((11 / 12) * 1000px);
  }

  .width-12 {
    width: calc((12 / 12) * 1000px);
  }

  @media (max-width: 1320px) {
    .width-12 {
      width: 100%;
    }
  }

  @media (max-width: 1235px) {
    .width-11 {
      width: 100%;
    }
  }

  @media (max-width: 1150px) {
    .width-10 {
      width: 100%;
    }
  }

  @media (max-width: 1070px) {
    .width-9 {
      width: 100%;
    }
  }

  @media (max-width: 992px) {
    .width-8 {
      width: 100%;
    }
  }

  @media (max-width: 900px) {
    .width-7 {
      width: 100%;
    }
  }

  @media (max-width: 820px) {
    .width-6 {
      width: 100%;
    }
  }

  @media (max-width: 736px) {
    .width-5 {
      width: 100%;
    }
  }

  @media (max-width: 650px) {
    .width-4, .width-3, .width-2, .width-1 {
      width: 100%;
    }
  }

</style>
