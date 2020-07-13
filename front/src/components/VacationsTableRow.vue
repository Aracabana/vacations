<template>
    <tr class="table-row" @click="goToVacationPage">
        <td>
            <img v-if="vacation.flag" :src="vacation.flag" alt="" class="flag">
            <span>{{vacation.countryName}}</span>
        </td>
        <td class="text-center">{{vacation.dateFrom}}</td>
        <td class="text-center">{{vacation.dateTo}}</td>
        <td>
          <VacationStatus
          :dateFrom="vacation.dateFrom"
          :dateTo="vacation.dateTo"
          ></VacationStatus>
        </td>
        <td></td>
    </tr>
</template>

<script>
  import VacationStatus from './VacationStatus';
export default {
  name: 'VacationTableRow',
  components: {VacationStatus},
  props: {
    vacation: {}
  },
  data () {
    return {
    }
  },
  methods: {
    goToVacationPage () {
      // this.$router.push('/');
    }
  }
}
</script>

<style lang="less" scoped>
    .vacations-table tr td {
        cursor: pointer;
    }
</style>
