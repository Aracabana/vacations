<template>
    <section class="main-body">
        <Header :btn="headerBtn"></Header>
        <div class="page-wrapper">
            <div class="container-fluid">
                <h1>Создать отпуск</h1>
                <div class="content">
                    <ServerFeedback
                            v-if="showServerFeedback"
                            :ok="serverFeedback.ok"
                            :text="serverFeedback.text"
                    ></ServerFeedback>

                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-12">
                            <div class="card">
                                <form id="vacation-form" class="card-body" @submit.prevent="submit">
                                    <Spinner v-if="showSpinner"></Spinner>
                                    <div class="form-group">
                                        <label for="country">Выберите страну</label>
                                        <input
                                                v-model.trim="country"
                                                @input="getCountryCode"
                                                id="country"
                                                type="text"
                                                placeholder="Начните вводить"
                                                list="countries-list"
                                                class="form-control"
                                                :class="{'is-invalid': $v.country.$dirty && !$v.country.required}"
                                        >
                                        <datalist id="countries-list">
                                            <option v-for="country in countriesList"
                                                    :key="country.code"
                                                    class="comment">
                                                {{country.name}}
                                            </option>
                                        </datalist>
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
                                                        :min="setDateFromMinValue()"
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
                                                        :min="setDateToMinValue()"
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
                        <div v-if="countryCode" class="col-lg-6 col-md-6 col-sm-12 mt-lg-0 mt-md-0 mt-4">
                            <CountryInfo :countryCode="countryCode"></CountryInfo>
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
    </section>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { formatDate } from '../assets/js/formatDate'
import Header from '../components/Header'
import ServerFeedback from '../components/ServerFeedback'
import Spinner from '../components/Spinner'
import CountryInfo from '../components/CountryInfo'

export default {
  name: 'CreateVacation',
  data () {
    return {
      headerBtn: {
        url: '/',
        title: 'Вернуться к списку отпусков',
        class: 'btn-light',
        icon: 'fa-angle-left'
      },
      showSpinner: false,
      showServerFeedback: false,
      serverFeedback: {
        ok: false,
        text: ''
      },
      countriesList: [],
      country: '',
      countryCode: false,
      dateFrom: '',
      dateTo: ''
    }
  },
  validations: {
    country: { required },
    dateFrom: { required },
    dateTo: { required }
  },
  components: {
    Header, ServerFeedback, Spinner, CountryInfo
  },
  methods: {
    async getCountriesForSelect () {
      const response = await fetch('http://localhost:8080/api/getCountriesForSelect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      this.countriesList = await response.json()
    },
    setDateFromMinValue () {
      const now = new Date()
      return formatDate(now)
    },
    setDateToMinValue () {
      const minForDateTo = new Date()
      minForDateTo.setDate(minForDateTo.getDate() + 1)
      return formatDate(minForDateTo)
    },
    getCountryCode () {
      for (let i = 0; i < this.countriesList.length; i++) {
        if (this.country === this.countriesList[i].name) {
          this.countryCode = this.countriesList[i].code
          i = this.countriesList.length
        }
      }
      // console.log(this.countryCode);
    },
    async submit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      // this.showSpinner = true;
      const formData = {
        country: this.country,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      }
      try {
        const response = await fetch('http://localhost:8080/vacation', {
          method: 'POST',
          // credentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        const data = await response.json()
        this.setServerFeedback(data)
        // if (response.ok) {
        //     setTimeout(() => {
        //         window.location.href = '/vacation/' + response.vacationId;
        //         this.$router.push('/vacation/');
        //     }, 200);
        // }
      } catch (err) {
        this.setServerFeedback({ ok: false, caption: err })
      } finally {
        // this.showSpinner = false;
      }
    },
    setServerFeedback (data) {
      this.showServerFeedback = true
      this.serverFeedback.ok = data.ok
      this.serverFeedback.text = data.caption
      setTimeout(() => {
        this.showServerFeedback = false
      }, 3000)
    }
  },
  created () {
    this.getCountriesForSelect()
  }
}
</script>

<style lang="less" scoped>
    @import '../assets/less/variables';
    .map-wrapper {
        margin-top: 32px;
    }
    #map {
        z-index: 1;
        height: 300px;
    }

</style>
