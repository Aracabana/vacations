<template>
  <div class="popup-bg">
    <div class="popup">
      <div class="popup-content">
        <button class="btn popup-close" type="button" @click="hidePopup">
          <i class="fas fa-times"></i>
        </button>
        <h3 id="js-popup-title" class="popup-title">{{getPopup.countryName}}</h3>
        <form id="form-edit" @submit.prevent="submit">
          <div class="form-group">
            <label for="dateFrom">Дата начала</label>
            <input
              id="dateFrom"
              type="date"
              :min="setDateFromMinValue()"
              :value="formatDate(getPopup.dateFrom)"
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
          <div class="form-group">
            <label for="dateTo">Дата завершения</label>
            <input
              id="dateTo"
              type="date"
              :min="setDateToMinValue()"
              :value="formatDate(getPopup.dateTo)"
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
          <div class="btns text-right">
            <button id="popup-submit" type="submit" class="btn btn-success">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {required} from 'vuelidate/lib/validators'
  import {formatDate} from '../assets/js/formatDate'

  export default {
    name: "VacationEditPopup",
    validations: {
      dateFrom: {required},
      dateTo: {required}
    },
    computed: mapGetters(['getPopup']),
    methods: {
      ...mapActions(['editVacation']),
      ...mapMutations(['updatePopup']),
      hidePopup() {
        this.updatePopup(null);
      },
      formatDate: function (value) {
        return new Date(value).toLocaleDateString().split('.').reverse().join('-');
      },
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        // const updatedVacation = {
        //   id: this.getPopup.id,
        //   countryName: this.getPopup.countryName,
        //   countryCode: this.getPopup.countryCode,
        //   dateFrom: '',
        //   dateTo: '',
        //   flag: this.getPopup.flag
        // }
        // await this.editVacation(updatedVacation);
      },
      setDateFromMinValue() {
        const now = new Date()
        return formatDate(now)
      },
      setDateToMinValue() {
        const minForDateTo = new Date()
        minForDateTo.setDate(minForDateTo.getDate() + 1)
        return formatDate(minForDateTo)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
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
