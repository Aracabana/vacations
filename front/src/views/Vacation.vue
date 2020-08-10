<template>
  <div class="vacation-wrapper">
    <Spinner v-if="loading"></Spinner>
    <div class="vacation-page">
      <nav class="widget-menu-wrapper">
        <div class="container-fluid">
          <h3 class="text-white">Виджеты</h3>
        </div>
        <ul id="widgets-sidebar" class="widget-menu list-unstyled"></ul>
      </nav>
      <div class="vacation-page-main">
        <div class="container-fluid">
          <h1 id="vacation-country" class="vacation-page-title">{{vacation.countryName}}</h1>
          <p id="vacation-dates" class="text-black-50">
            {{formattedVacationDates}}
          </p>
          <div class="vacation-btns-bar">
            <VacationEditBtn v-if="isEditable" :vacation="vacation"></VacationEditBtn>
            <VacationRemoveBtn @removed="goBack" :vacation-id="vacation.id"></VacationRemoveBtn>
          </div>

          <div class="content">
            <Notification v-if="getNotification && getNotification.page === 'Vacation'"></Notification>
            <div id="widgets-wrapper" class="row">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import Notification from '../components/Notification'
  import VacationEditBtn from "../components/VacationEditBtn";
  import VacationRemoveBtn from "../components/VacationRemoveBtn";
  import Spinner from "../components/Spinner";
  import {eventBus} from "../main";

  export default {
    name: "Vacation",
    components: {Notification, VacationEditBtn, VacationRemoveBtn, Spinner},
    data() {
      return {
        vacation: {},
        loading: false
      }
    },
    computed: {
      ...mapGetters(['getVacationById', 'getNotification', 'getVacations']),
      formattedVacationDates() {
        const formatter = new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric"
        });
        const formattedDateFrom = formatter.format(this.vacation.dateFrom);
        const formattedDateTo = formatter.format(this.vacation.dateTo);
        return `${formattedDateFrom} - ${formattedDateTo}`;
      },
      isEditable() {
        return this.vacation.status.text !== 'Завершен';
      }
    },
    methods: {
      goBack(removed) {
        if (removed) {
          setTimeout(() => this.$router.back(), 300);
        }
      }
    },
    created() {
      this.loading = true;
      this.vacationId = this.$router.currentRoute.params.id;
      this.vacation = this.getVacationById(this.vacationId);
      this.loading = false;
    },
    async mounted() {
      eventBus.$on('loading', (data) => {
        this.loading = data;
      })
    },
    watch: {
      getVacations(oldVal, newVal) {
        console.log(oldVal);
        console.log(newVal);
      }
    }
  }
</script>

<style scoped>
  .vacation-page {
    padding-top: 54px;
  }

  .vacation-page-main {
    position: relative;
    padding: 16px 0 16px 250px;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }

  .vacation-btns-bar {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .vacation-page-title .flag {
    max-width: 50px;
  }

  .widget-menu-wrapper {
    position: fixed;
    top: 54px;
    left: 0;
    z-index: 90;
    padding-top: 16px;
    width: 250px;
    height: 100%;
    background-color: #3c4146;
  }

  .time-sun-info p {
    margin-right: 24px;
  }

  .empty-widget i,
  .empty-map i {
    display: block;
    margin-bottom: 24px;
  }

  .empty-widget span,
  .empty-map span {
    display: block;
  }
</style>
