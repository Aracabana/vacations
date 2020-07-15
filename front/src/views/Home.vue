<template>
  <section class="main-body">
    <Header :btn="headerBtn"></Header>
    <div class="page-wrapper">
      <div class="container-fluid">
        <h1>Мои отпуска</h1>
        <div class="content">
          <div class="table-responsive vacation-table-wrapper">
            <ServerFeedback v-if="getNotification"></ServerFeedback>
            <Spinner v-if="getSpinner"></Spinner>

            <VacationsFilter></VacationsFilter>
            <VacationsTable></VacationsTable>
          </div>
        </div>
      </div>
    </div>
    <VacationEditPopup v-if="getPopup"></VacationEditPopup>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ServerFeedback from '../components/Notification'
  import Spinner from '../components/Spinner'
  import Header from '../components/Header'
  import VacationsFilter from '../components/VacationsFilter'
  import VacationsTable from '../components/VacationsTable'
  import VacationEditPopup from '../components/VacationEditPopup';

  export default {
    name: 'Home',
    data() {
      return {
        headerBtn: {
          url: '/create-vacation',
          title: 'Создать отпуск',
          class: 'btn-success',
          icon: 'fa-plus'
        }
      }
    },
    computed: mapGetters(['getNotification', 'getSpinner', 'getPopup']),
    components: {
      ServerFeedback, Spinner, Header, VacationsFilter, VacationsTable, VacationEditPopup
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .vacation-table-wrapper {
    position: relative;
  }
</style>
