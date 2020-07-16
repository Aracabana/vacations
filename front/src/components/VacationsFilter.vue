<template>
  <div class="filter">
    <div id="filter-buttons">
      <span class="filter-label">Сортировать по:</span>
      <button type="button" class="btn btn-sm btn-info" @click="sort('countryName')">Страна</button>
      <button type="button" class="btn btn-sm btn-info" @click="sort('dateFrom')">Дата прибытия</button>
      <button type="button" class="btn btn-sm btn-info" @click="sort('dateTo')">Статус</button>
    </div>
    <div class="filter-search">
      <span class="filter-label">Найти</span>
      <input id="search" type="text" class="form-control" @input="handleSearch">
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: 'VacationsFilter',
    methods: {
      ...mapActions(['search', 'sort']),
      handleSearch(e) {
        this.search(e.target.value);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .filter {
    .flex();
    .space-between();
    .align-items-center();
    margin-bottom: 24px;
    &-label {
      margin-right: 16px;
    }
    &-search {
      .flex();
      .align-items-center();
    }
    .form-control {
      max-width: 300px;
    }
    .btn {
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
