<template>
  <button
    class="sort-btn"
    @click="sortBy(sortField)"
  >
    <i
      class="fas fa-sort-up"
      :class="isActive && order === 'DECK' ? 'text-primary' : 'text-muted'"
    ></i>
    <i
      class="fas fa-sort-down"
      :class="isActive && order === 'ASC' ? 'text-primary' : 'text-muted'"
    ></i>
  </button>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "VacationsSortBtn",
    props: ['sortField'],
    data() {
      return {
        order: 'ASC'
      }
    },
    computed: {
      ...mapGetters(['getSortField']),
      isActive() {
        return this.getSortField === this.sortField
      }
    },
    methods: {
      ...mapActions(['sort']),
      sortBy(sortField) {
        this.order = (this.order === 'ASC') ? 'DECK' : 'ASC';
        this.sort({
          sortField,
          sortOrder: this.order
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .sort-btn {
    border: none;
    padding: 10px;
    background-color: transparent;
    &:focus {
      outline: none;
    }
    .fas {
      display: block;
      line-height: 0.3;
    }
  }
</style>
