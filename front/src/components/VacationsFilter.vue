<template>
  <div class="filter">
    <div id="filter-buttons">
      <span class="filter-label">Фильтровать по статусу:</span>
      <button type="button" class="btn btn-sm btn-light" @click="filterVacation('')">Все</button>
      <button type="button" class="btn btn-sm btn-success" @click="filterVacation('Ожидание')">Ожидание</button>
      <button type="button" class="btn btn-sm btn-warning" @click="filterVacation('В процессе')">В процессе</button>
      <button type="button" class="btn btn-sm btn-danger" @click="filterVacation('Завершен')">Завершен</button>
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
      ...mapActions(['searchVacation', 'filterVacation']),
      handleSearch(e) {
        this.searchVacation(e.target.value);
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
