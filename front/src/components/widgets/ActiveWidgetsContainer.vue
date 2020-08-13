<template>
  <div class="widgets-container">
    <div v-packery:options="packeryOptions" class="widgets-wrapper">
      <widget
        v-for="(widget, index) in getActiveWidgets"
        :key="index"
        v-bind="widget.props"
      >
        <component :is="widget.component"></component>
      </widget>
    </div>
    <div v-if="!hasWidgets" class="widgets-container-empty">Виджеты не выбраны</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Spinner from '../common/Spinner';
  import widget from './widget';

  export default {
    name: "ActiveWidgetsContainer",
    props: ['containerProps'],
    components: {widget, Spinner},
    data() {
      return {
        packery: null,
        packeryOptions: {
          itemSelector: '.widget-item',
          gutter: 10,
          columnWidth: 10
        },
        containerWidth: 0,
      }
    },
    computed: mapGetters(['getActiveWidgets', 'hasWidgets']),
    methods: {}
  }
</script>

<style scoped>

  .widgets-container {
    padding: 10px;
    border: 1px solid #00000017;
    background-color: #fcfcfc;
    border-radius: .25rem;
    overflow: hidden;
  }

</style>
