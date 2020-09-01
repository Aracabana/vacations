<template>
  <div class="vacation-wrapper">
    <Spinner v-if="loading"></Spinner>
    <div class="vacation-page">
      <nav class="widget-menu-wrapper">
        <div class="container-fluid">
          <h3 class="text-white">Виджеты</h3>
        </div>
        <InactiveWidgetsSidebar></InactiveWidgetsSidebar>
      </nav>
      <div class="vacation-page-main">
        <div class="container-fluid">

          <div class="vacation-page-header">
            <div class="vacation-page-title-wrapper">
              <div class="vacation-page-title">
                <v-lazy-image
                  :src="vacation.country.getFlag()"
                  :src-placeholder="imgPlaceholder"
                  class="flag"
                />
                <h1 id="vacation-country">{{vacation.countryName}}</h1>
              </div>
              <div class="vacation-btns-bar">
                <VacationEditBtn v-if="isEditable" :vacation="vacation"></VacationEditBtn>
                <VacationRemoveBtn @removed="goBack" :vacation-id="vacation.id"></VacationRemoveBtn>
              </div>
            </div>
            <p id="vacation-page-dates" class="text-black-50">
              {{formattedVacationDates}}
            </p>
          </div>

          <div class="content">
            <Notification v-if="getNotification && getNotification.page === 'Vacation'"></Notification>
            <ActiveWidgetsContainer></ActiveWidgetsContainer>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import Notification from '../components/common/Notification'
  import VacationEditBtn from "../components/VacationEditBtn";
  import VacationRemoveBtn from "../components/VacationRemoveBtn";
  import Spinner from "../components/common/Spinner";
  import ActiveWidgetsContainer from '../components/widgets/ActiveWidgetsContainer';
  import InactiveWidgetsSidebar from '../components/widgets/WidgetsSidebar';
  import VLazyImage from "v-lazy-image";
  import {eventBus} from "../main";

  export default {
    name: "Vacation",
    components: {
      Notification,
      VacationEditBtn,
      VacationRemoveBtn,
      Spinner,
      VLazyImage,
      ActiveWidgetsContainer,
      InactiveWidgetsSidebar
    },
    data() {
      return {
        vacationId: null,
        vacation: {},
        loading: false,
        imgPlaceholder: require('@/assets/img/img-placeholder.png')
      }
    },
    computed: {
      ...mapGetters(['getVacationById', 'getNotification', 'getVacations']),
      formattedVacationDates() {
        const formattedDateFrom = this.$options.filters.formatVacationDates(this.vacation.dateFrom);
        const formattedDateTo = this.$options.filters.formatVacationDates(this.vacation.dateTo);
        return `${formattedDateFrom} - ${formattedDateTo}`;
      },
      isEditable() {
        return this.vacation.status.text !== 'Завершен';
      }
    },
    methods: {
      ...mapActions(['loadWidgets']),
      goBack(removed) {
        if (!removed) return;
        setTimeout(() => this.$router.back(), 300);
      },
      getVacation(id) {
        this.loading = true;
        this.vacation = this.getVacationById(id);
        this.loading = false;
      },
      loadingListener(data) {
        this.loading = data;
      }
    },
    async created() {
      this.vacationId = this.$router.currentRoute.params.id;
      this.getVacation(this.vacationId);
      await this.loadWidgets(this.vacationId);
    },
    async mounted() {
      eventBus.$on('loading', this.loadingListener);
      eventBus.$on('vacationUpdated', () => this.getVacation(this.vacationId));
    },
    beforeDestroy() {
      eventBus.$off('loading', this.loadingListener);
      eventBus.$off('vacationUpdated');
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

  .vacation-page-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .vacation-page-title {
    display: flex;
    align-items: center;
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
