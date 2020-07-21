<template>
  <section class="main-body">
    <Header :btn="headerBtn"></Header>
    <div class="page-wrapper">
      <div class="container-fluid">
        <h1>Создать отпуск</h1>
        <div class="content">
          <Notification v-if="getNotification && getNotification.page === 'CreateVacation'"></Notification>

          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <div class="card">
                <form id="vacation-form" class="card-body" @submit.prevent="submit">
                  <Spinner v-if="loading"></Spinner>
                  <div class="form-group vacation-list-form-group">
                    <label for="country">Выберите страну</label>
                    <input
                      v-model.trim="country"
                      @input="handleSearch"
                      @focus="isOpen = true"
                      @blur="onblur"
                      id="country"
                      type="text"
                      autocomplete="off"
                      placeholder="Начните вводить"
                      class="form-control"
                      :class="{'open': isOpen, 'is-invalid': !isOpen && $v.country.$dirty && !$v.country.required}"
                    >
                    <CountriesList @chooseCountry="handleCountry" v-show="isOpen"></CountriesList>
                    <div
                      v-if="$v.country.$dirty && !$v.country.required"
                      class="invalid-feedback"
                    >
                      Поле обязательно для заполнения
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="form-group">
                        <label for="dateFrom">Дата начала</label>
                        <input
                          v-model.trim="dateFrom"
                          id="dateFrom"
                          type="date"
                          :min="formatDatePicker()"
                          class="form-control"
                          :class="{'is-invalid': $v.dateFrom.$dirty && !$v.dateFrom.required}"
                        >
                        <div
                          v-if="$v.dateFrom.$dirty && !$v.dateFrom.required"
                          class="invalid-feedback"
                        >
                          Поле обязательно для заполнения
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <label for="dateTo">Дата завершения</label>
                        <input
                          v-model.trim="dateTo"
                          id="dateTo"
                          type="date"
                          :min="formatDatePicker(1)"
                          class="form-control"
                          :class="{'is-invalid': $v.dateTo.$dirty && !$v.dateTo.required}"
                        >
                        <div
                          v-if="$v.dateTo.$dirty && !$v.dateTo.required"
                          class="invalid-feedback"
                        >
                          Поле обязательно для заполнения
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="btns text-right">
                    <button type="submit" class="btn btn-success">Создать</button>
                  </div>
                </form>
              </div>
            </div>
            <!--            <div v-if="countryCode" class="col-lg-6 col-md-6 col-sm-12 mt-lg-0 mt-md-0 mt-4">-->
            <!--              <CountryInfo :countryCode="countryCode"></CountryInfo>-->
            <!--            </div>-->
            <div class="col-12">
              <div id="map-wrapper" class="map-wrapper card-img-bottom" hidden>
                <div id="map"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {required} from 'vuelidate/lib/validators'
  import {formatDateForPicker} from '../utils/formatDate';
  import Header from '../components/Header'
  import Notification from '../components/Notification'
  import Spinner from '../components/Spinner'
  import CountriesList from '../components/CountriesList';
  // import CountryInfo from '../components/CountryInfo'
  import request from '../utils/request';

  export default {
    name: 'CreateVacation',
    data() {
      return {
        headerBtn: {
          url: '/',
          title: 'Вернуться к списку отпусков',
          class: 'btn-light',
          icon: 'fa-angle-left'
        },
        showSpinner: false,
        isOpen: false,
        countriesList: [],
        country: '',
        countryCode: false,
        dateFrom: '',
        dateTo: '',
        loading: false
      }
    },
    computed: mapGetters(['getNotification']),
    validations: {
      country: {required},
      dateFrom: {required},
      dateTo: {required}
    },
    components: {
      Header, Notification, Spinner, CountriesList
    },
    methods: {
      ...mapActions(['searchCountry']),
      ...mapMutations(['updateNotification']),
      onblur() {
        setTimeout(() => this.isOpen = false, 150);
      },
      handleCountry(data) {
        this.country = data;
      },
      formatDatePicker(increase) {
        return formatDateForPicker(increase)
      },
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        this.loading = true;
        const formData = {
          country: this.country,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo
        }
        const response = await request('/vacation', 'POST', formData, 'CreateVacation');
        this.loading = false;
        // if (response.ok) {
        //     setTimeout(() => {
        //         window.location.href = '/vacation/' + response.vacationId;
        //         this.$router.push('/vacation/');
        //     }, 200);
        // }
      },
      handleSearch(e) {
        this.searchCountry(e.target.value);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .vacation-list-form-group {
    position: relative;
  }
  .map-wrapper {
    margin-top: 32px;
  }
  #map {
    z-index: 1;
    height: 300px;
  }
  .form-control.open {
    .border-bottom-radius(0);
  }

</style>
