<template>
  <section class="main-body">
    <Header :btn="headerBtn"></Header>
    <div class="page-wrapper">
      <div class="container-fluid">
        <h1>Мои отпуска</h1>
        <div class="content">
          <Notification v-if="getNotification && getNotification.page === 'Home'"></Notification>
          <VacationsFilter></VacationsFilter>
          <VacationsTable></VacationsTable>
        </div>
      </div>
    </div>
    <VacationEditPopup v-if="getPopup"></VacationEditPopup>
  </section>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Notification from '../components/Notification'
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
      Notification, Header, VacationsFilter, VacationsTable, VacationEditPopup
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
</style>
