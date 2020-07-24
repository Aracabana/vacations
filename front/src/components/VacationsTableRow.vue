<template>
  <tr class="table-row" @click="goToVacationPage">
    <td style="width: 30%;">
      <v-lazy-image
        :src="vacation.country.flag"
        :src-placeholder="require('@/assets/img/img-placeholder.png')"
        class="flag"
      />
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
  import {mapActions} from "vuex";
  import VLazyImage from "v-lazy-image";

  export default {
    name: 'VacationTableRow',
    components: {VacationStatus, VacationEditBtn, VacationRemoveBtn, VLazyImage},
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
      // if ("IntersectionObserver" in window) {
      //   this.observer = new IntersectionObserver((entries) => {
      //     const row = entries[0];
      //     console.log(entries[0].target);
      //     if (row.isIntersecting) {
      //       this.increaseVacationsCount();
      //       this.observer.disconnect();
      //     }
      //   }, {});
      //   this.observer.observe(this.$el);
      // }
    },
    beforeDestroy() {
      // if ("IntersectionObserver" in window) {
      //   this.observer.disconnect();
      // }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .v-lazy-image {
    filter: blur(2px);
    transition: filter 0.3s;
  }
  .v-lazy-image-loaded {
    filter: blur(0);
  }
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
