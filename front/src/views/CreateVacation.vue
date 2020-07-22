<template>
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
                      v-model.trim="countryName"
                      @input="handleSearch"
                      @focus="countriesListIsOpen = true"
                      @blur="onblur"
                      id="country"
                      type="text"
                      autocomplete="off"
                      placeholder="Начните вводить"
                      class="form-control"
                      :class="{
                        'open': countriesListIsOpen,
                        'is-invalid': !countriesListIsOpen && $v.countryName.$dirty && !$v.countryName.required
                      }"
                    >
                    <CountriesList v-show="countriesListIsOpen"></CountriesList>
                    <div
                      v-if="$v.countryName.$dirty && !$v.countryName.required"
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
            <div class="col-lg-6 col-md-6 col-sm-12 mt-lg-0 mt-md-0 mt-4">
              <CountryInfo></CountryInfo>
            </div>
            <div class="col-12">
              <div id="map-wrapper" class="map-wrapper card-img-bottom" hidden>
                <div id="map"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {required} from 'vuelidate/lib/validators'
  import {formatDateForPicker} from '../utils/formatDate';
  import Notification from '../components/Notification'
  import Spinner from '../components/Spinner'
  import CountriesList from '../components/CountriesList';
  import CountryInfo from '../components/CountryInfo'
  import request from '../utils/request';

  export default {
    name: 'CreateVacation',
    data() {
      return {
        countriesListIsOpen: false,
        loading: false,
        countryName: '',
        dateFrom: '',
        dateTo: ''
      }
    },
    computed: mapGetters(['getNotification', 'getSelectedCountry']),
    validations: {
      countryName: {required},
      dateFrom: {required},
      dateTo: {required}
    },
    components: {
      Notification, Spinner, CountriesList, CountryInfo
    },
    methods: {
      ...mapActions(['searchCountry']),
      ...mapMutations(['updateNotification']),
      onblur() {
        setTimeout(() => this.countriesListIsOpen = false, 150);
      },
      formatDatePicker(increase) {
        return formatDateForPicker(increase)
      },
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        const formData = {
          countryName: this.countryName,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo
        }
        this.loading = true;
        const response = await request('/vacation', 'POST', formData, 'CreateVacation');
        if (response.ok) {
          this.updateNotification({...response, page: 'CreateVacation'});
        }
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
      },
    },
    watch: {
      getSelectedCountry(newVal, oldVal) {
        this.countryName = newVal.countryName
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
