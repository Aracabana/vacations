<template>
  <tr class="table-row" @click="goToVacationPage">
    <td>
      <img :src="vacation.country.flag" alt="" class="flag">
      <span>{{vacation.countryName}}</span>
    </td>
    <td class="text-center">{{vacation.dateFrom | toLocaleDateString}}</td>
    <td class="text-center">{{vacation.dateTo | toLocaleDateString}}</td>
    <td>
      <VacationStatus
        :status="vacation.status"
      ></VacationStatus>
    </td>
    <td class="action-td">
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
  .vacations-table tr td {
    vertical-align: middle;
    cursor: pointer;
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
