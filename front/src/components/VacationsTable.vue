<template>
  <table id="vacations-table" class="table table-striped table-bordered table-hover vacations-table">
    <thead class="thead-dark">
    <tr>
      <th scope="col">
        <div>
          <span>Страна</span>
          <VacationsSortBtn :sortField="'countryName'"></VacationsSortBtn>
        </div>
      </th>
      <th scope="col">
        <div>
          <span>Дата начала</span>
          <VacationsSortBtn :sortField="'dateFrom'"></VacationsSortBtn>
        </div>
      </th>
      <th scope="col">
        <div>
          <span>Дата окончания</span>
          <VacationsSortBtn :sortField="'dateTo'"></VacationsSortBtn>
        </div>
      </th>
      <th scope="col">
        <div>
          <span>Статус</span>
        </div>
      </th>
      <th scope="col" style="width: 100px;">
      </th>
    </tr>
    </thead>
    <tbody v-if="getVacations.length">
    <VacationsTableRow
      v-for="(vacation, index) in getVacations"
      :key="index"
      :vacation="vacation"
    ></VacationsTableRow>
    </tbody>
    <tbody v-else>
    <VacationsTableEmptyRow></VacationsTableEmptyRow>
    </tbody>
  </table>
</template>

<script>
  import VacationsTableEmptyRow from './VacationsTableEmptyRow'
  import VacationsTableRow from './VacationsTableRow'
  import VacationsSortBtn from './VacationsSortBtn'
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    name: 'VacationsTable',
    components: {
      VacationsTableEmptyRow, VacationsTableRow, VacationsSortBtn
    },
    methods: {
      ...mapState(['filterOptions']),
      ...mapActions(['loadVacations']),
    },
    computed: mapGetters(['getVacations', 'getOptions']),
    filters: {},
    async mounted() {
      await this.loadVacations();
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';

  .vacation-table-wrapper {
    max-height: 600px;
  }
  .vacations-table {
    overflow: hidden;
  }
  th {
    div {
      .flex();
      .space-between();
      .align-items-center();
    }
  }

</style>
