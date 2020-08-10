<template>
  <div class="table-responsive vacation-table-wrapper">
    <Spinner v-if="loading"/>
    <table id="vacations-table" class="table table-striped table-bordered table-hover vacations-table">
      <thead class="thead-dark">
      <tr>
        <th scope="col" style="width: 30%;">
          <div>
            <span>Страна</span>
            <VacationsSortBtn :sortField="'countryName'"/>
          </div>
        </th>
        <th scope="col" style="width: 23.5%;">
          <div>
            <span>Дата начала</span>
            <VacationsSortBtn :sortField="'dateFrom'"/>
          </div>
        </th>
        <th scope="col" style="width: 23.5%;">
          <div>
            <span>Дата окончания</span>
            <VacationsSortBtn :sortField="'dateTo'"/>
          </div>
        </th>
        <th scope="col" style="width: 15%;">
          <div>
            <span>Статус</span>
          </div>
        </th>
        <th scope="col" style="width: 100px;"></th>
      </tr>
      </thead>
      <tbody v-if="getVacations.length">
      <VacationTableRow v-for="(vacation, index) in getVacations" :key="index" :vacation="vacation"/>
      </tbody>
      <tbody v-else>
      <VacationsTableEmptyRow/>
      </tbody>
    </table>
  </div>
</template>

<script>
  import VacationsTableEmptyRow from './VacationsTableEmptyRow'
  import VacationTableRow from './VacationsTableRow'
  import VacationsSortBtn from './VacationsSortBtn'
  import Spinner from '../components/Spinner'
  import { mapActions, mapGetters } from 'vuex'
  import { eventBus } from "../main";

  export default {
    name: 'VacationsTable',
    components: {
      VacationsTableEmptyRow, VacationTableRow, VacationsSortBtn, Spinner
    },
    data() {
      return {
        loading: false
      }
    },
    methods: {
      ...mapActions(['loadVacations'])
    },
    computed: mapGetters(['getVacations', 'countriesIsExist']),
    created() {
      eventBus.$on('loading', (data) => {
        this.loading = data;
      });
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .vacation-table-wrapper {
    position: relative;
    max-height: 350px;
    border: 1px solid #dee2e6;
    table {
      margin-bottom: 0;
    }
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
