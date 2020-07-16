<template>
        <table id="vacations-table" class="table table-striped table-bordered table-hover vacations-table">
            <thead class="thead-dark">
            <tr>
                <th scope="col">Страна</th>
                <th scope="col" class="text-center">Дата начала</th>
                <th scope="col" class="text-center">Дата окончания</th>
                <th scope="col">Статус</th>
                <th scope="col" style="width: 100px;"></th>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'VacationsTable',
  components: {
    VacationsTableEmptyRow, VacationsTableRow
  },
  methods: mapActions(['loadVacations']),
  computed: mapGetters(['getVacations']),
  filters: {

  },
  async mounted() {
    await this.loadVacations()
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

</style>
