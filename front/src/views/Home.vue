<template>
  <section class="main-body">
    <Header :btn="headerBtn"></Header>
    <div class="page-wrapper">
      <div class="container-fluid">
        <h1>Мои отпуска</h1>
        <div class="content">
          <div class="table-responsive vacation-table-wrapper">
            <ServerFeedback v-if="getNotification"></ServerFeedback>
            <Spinner v-if="showSpinner"></Spinner>

            <VacationsFilter></VacationsFilter>
            <VacationsTable></VacationsTable>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ServerFeedback from '../components/Notification'
  import Spinner from '../components/Spinner'
  import Header from '../components/Header'
  import VacationsFilter from '../components/VacationsFilter'
  import VacationsTable from '../components/VacationsTable'

  export default {
    name: 'Home',
    data() {
      return {
        headerBtn: {
          url: '/create-vacation',
          title: 'Создать отпуск',
          class: 'btn-success',
          icon: 'fa-plus'
        },
        showSpinner: false
      }
    },
    computed: mapGetters(['getNotification']),
    components: {
      ServerFeedback, Spinner, Header, VacationsFilter, VacationsTable
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';

</style>
