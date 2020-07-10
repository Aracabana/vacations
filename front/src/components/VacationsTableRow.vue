<template>
    <tr class="table-row" @click="goToVacationPage">
        <td>
            <img v-if="vacation.flag" :src="vacation.flag" alt="" class="flag">
            <span>{{vacation.countryName}}</span>
        </td>
        <td class="text-center">{{vacation.dateFrom}}</td>
        <td class="text-center">{{vacation.dateTo}}</td>
        <td><span class="badge"></span></td>
        <td></td>
    </tr>
</template>

<script>
export default {
  name: 'VacationTableRow',
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
