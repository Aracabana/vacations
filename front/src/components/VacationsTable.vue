<template>
    <div class="table-responsive vacation-table-wrapper">
        <ServerFeedback
                v-if="showServerFeedback"
                :ok="serverFeedback.ok"
                :text="serverFeedback.text"
        ></ServerFeedback>
        <Spinner v-if="showSpinner"></Spinner>
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
            <tbody v-if="vacations.length">
            <VacationsTableRow
                    v-for="(vacation, index) in vacations"
                    :key="index"
                    :vacation="vacation"
            ></VacationsTableRow>
            </tbody>
            <tbody  v-else>
            <VacationsTableEmptyRow></VacationsTableEmptyRow>
            </tbody>
        </table>
    </div>
</template>

<script>
import ServerFeedback from './ServerFeedback'
import Spinner from './Spinner'
import VacationsTableEmptyRow from './VacationsTableEmptyRow'
import VacationsTableRow from './VacationsTableRow'
export default {
  name: 'VacationsTable',
  data () {
    return {
      showSpinner: false,
      showServerFeedback: false,
      serverFeedback: {
        ok: false,
        text: ''
      },
      vacations: []
    }
  },
  components: {
    ServerFeedback, Spinner, VacationsTableEmptyRow, VacationsTableRow
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
    .table-row:hover .action-block {
        opacity: 1;
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

</style>
