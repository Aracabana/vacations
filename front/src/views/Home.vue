<template>
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
</template>

<script>
  import {mapGetters} from 'vuex'
  import Notification from '../components/Notification'
  import VacationsFilter from '../components/VacationsFilter'
  import VacationsTable from '../components/VacationsTable'

  export default {
    name: 'Home',
    computed: mapGetters(['getNotification']),
    components: {
      Notification, VacationsFilter, VacationsTable
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
</style>
