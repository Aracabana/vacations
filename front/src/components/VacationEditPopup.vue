<template>
  <transition name="modal-fade">
    <div class="popup-bg" @click.self="hidePopup">
      <div class="popup">
        <div class="popup-content">
          <Notification v-if="getNotification && getNotification.page === 'Popup'"></Notification>
          <Spinner v-if="loading"></Spinner>
          <button class="btn popup-close" type="button" @click="hidePopup">
            <i class="fas fa-times"></i>
          </button>
          <h3 id="js-popup-title" class="popup-title">{{getPopup.countryName}}</h3>
          <form id="form-edit" @submit.prevent="submit">
            <div class="form-group">
              <label for="dateFrom">Дата начала</label>
              <input
                v-model="dateFrom"
                id="dateFrom"
                type="date"
                :min="formatDatePicker()"
                class="form-control"
                :class="{'is-invalid': ($v.dateFrom.$dirty && !$v.dateFrom.required) || ($v.dateFrom.$dirty && !$v.dateFrom.isValid)}"
              >
              <div
                v-if="$v.dateFrom.$dirty && !$v.dateFrom.required"
                class="invalid-feedback"
              >
                Поле обязательно для заполнения
              </div>
              <div
                v-if="$v.dateFrom.$dirty && !$v.dateFrom.isValid"
                class="invalid-feedback"
              >
                Не корректная дата
              </div>
            </div>
            <div class="form-group">
              <label for="dateTo">Дата завершения</label>
              <input
                v-model="dateTo"
                id="dateTo"
                type="date"
                :min="formatDatePicker(1)"
                class="form-control"
                :class="{'is-invalid':  ($v.dateTo.$dirty && !$v.dateTo.required) || ($v.dateTo.$dirty && !$v.dateTo.isValid)}"
              >
              <div
                v-if="$v.dateTo.$dirty && !$v.dateTo.required"
                class="invalid-feedback"
              >
                Поле обязательно для заполнения
              </div>
              <div
                v-if="$v.dateTo.$dirty && !$v.dateTo.isValid"
                class="invalid-feedback"
              >
                Не корректная дата
              </div>
            </div>
            <div class="btns text-right">
              <button id="popup-submit" type="submit" class="btn btn-success">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {required} from 'vuelidate/lib/validators'
  import {formatDateForPicker} from '../utils/formatDate';
  import Spinner from './Spinner'
  import Notification from '../components/Notification'

  export default {
    name: "VacationEditPopup",
    validations: {
      dateFrom: {required},
      dateTo: {required}
    },
    components: {Spinner, Notification},
    data() {
      return {
        dateFrom: '',
        dateTo: '',
        loading: false
      }
    },
    computed: mapGetters(['getNotification', 'getPopup']),
    methods: {
      ...mapActions(['editVacation']),
      ...mapMutations(['updatePopup']),
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        const updatedVacation = {
          id: this.getPopup.id,
          countryName: this.getPopup.countryName,
          countryCode: this.getPopup.countryCode,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo
        }
        this.loading = true;
        await this.editVacation(updatedVacation);
        this.loading = false;
      },
      formatDatePicker(increase) {
        return formatDateForPicker(increase)
      },
      hidePopup() {
        this.updatePopup(null);
      },
      formatDate: function (value) {
        return value.toLocaleDateString().split('.').reverse().join('-');
      }
    },
    mounted() {
      this.dateFrom = this.formatDate(this.getPopup.dateFrom)
      this.dateTo = this.formatDate(this.getPopup.dateTo)
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease
  }
  .popup-bg {
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 110;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
  }
  .popup {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 475px;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .popup-content {
    position: relative;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin: 0 auto;
    padding: 40px 32px 32px;
    background-color: #ffffff;
  }
  .popup-close {
    position: absolute;
    top: 16px;
    right: 16px;
    .flex();
    .flex-center();
    .align-items-center();
    padding: 0;
    width: 32px;
    height: 32px;
    color: #343a40;
    cursor: pointer;
    .transition();
    &:hover, &:active, &:focus {
      color: #007bff;
    }
  }
  .popup-title {
    margin-bottom: 32px;
  }
</style>
