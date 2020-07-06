<template>
    <div class="filter">
        <div id="filter-buttons">
            <span class="filter-label">Сортировать по:</span>
            <button id="byName" type="button" class="btn btn-sm btn-info">Страна</button>
            <button id="byDateTo" type="button" class="btn btn-sm btn-info">Дата прибытия</button>
            <button id="byStatus" type="button" class="btn btn-sm btn-info">Статус</button>
        </div>
        <div class="filter-search">
            <span class="filter-label">Найти</span>
            <input id="search" type="text" class="form-control">
        </div>
    </div>
</template>

<script>
    export default {
        name: "Filter"
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
    }
</style>
