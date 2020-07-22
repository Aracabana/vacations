<template>
  <tr class="table-row" @click="goToVacationPage">
    <td style="width: 30%;">
      <img :src="vacation.country.flag" alt="" class="flag">
      <span>{{vacation.countryName}}</span>
    </td>
    <td class="text-center" style="width: 23.5%;">{{vacation.dateFrom | toLocaleDateString}}</td>
    <td class="text-center" style="width: 23.5%;">{{vacation.dateTo | toLocaleDateString}}</td>
    <td style="width: 15%;">
      <VacationStatus
        :status="vacation.status"
      ></VacationStatus>
    </td>
    <td class="action-td" style="width: 100px;">
      <div class="action-block">
        <VacationEditBtn :vacation="vacation" v-if="vacation.status.text !== 'Завершен'"></VacationEditBtn>
        <VacationRemoveBtn :vacationId="vacation.id"></VacationRemoveBtn>
      </div>
    </td>
  </tr>
</template>

<script>
  import VacationStatus from './VacationStatus';
  import VacationEditBtn from './VacationEditBtn';
  import VacationRemoveBtn from './VacationRemoveBtn';
  import {mapActions, mapMutations} from "vuex";

  export default {
    name: 'LazyVacationTableRow',
    components: {VacationStatus, VacationEditBtn, VacationRemoveBtn},
    props: ['vacation'],
    data() {
      return {
        observer: null
      }
    },
    methods: {
      ...mapActions(['increaseVacationsCount']),
      goToVacationPage() {
        // this.$router.push('/');
      }
    },
    filters: {
      toLocaleDateString: function (value) {
        return value.toLocaleDateString();
      }
    },
    mounted() {
      if ("IntersectionObserver" in window) {
        this.observer = new IntersectionObserver((entries) => {
          const row = entries[0];
          if (row.isIntersecting) {
            this.increaseVacationsCount();
            this.observer.disconnect();
          }
        }, {});
        this.observer.observe(this.$el);
      }
    },
    beforeDestroy() {
      if ("IntersectionObserver" in window) {
        this.observer.disconnect();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .vacations-table tr {
    td {
      vertical-align: middle;
      cursor: pointer;
      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
    }
    &:last-child {
      td {
        border-bottom: 0;
      }
    }
  }
  .action-block {
    .flex();
    .space-around();
    .align-items-center();
    height: 100%;
    width: 100px;
    background-color: transparent;
    opacity: 0;
    .transition();
  }
  .table-row:hover .action-block {
    opacity: 1;
  }
</style>
