<template>
  <div class="popup-content">
    <Notification v-if="getNotification && getNotification.page === 'Popup'"></Notification>
    <Spinner v-if="loading"></Spinner>
    <form id="form-edit" @submit.prevent="submit">

      <div class="form-group" :class="{'is-invalid' : $v.dateFrom.$error}">
        <label for="dateFrom">Дата начала</label>
        <input
          id="dateFrom"
          type="date"
          v-model="dateFrom"
          class="form-control"
          :min="new Date() | formatDatePicker"
        >
        <div v-if="$v.dateFrom.$dirty" class="invalid-feedback">
          <span v-if="!$v.dateFrom.required">Поле обязательно для заполнения</span>
          <span v-if="!$v.dateFrom.isValid">Не корректная дата</span>
        </div>
      </div>

      <div class="form-group" :class="{'is-invalid' : $v.dateFrom.$error}">
        <label for="dateTo">Дата завершения</label>
        <input
          id="dateTo"
          type="date"
          v-model="dateTo"
          class="form-control"
          :min="new Date() | formatDatePicker(1)"
        >
        <div v-if="$v.dateFrom.$dirty" class="invalid-feedback">
          <span v-if="!$v.dateFrom.required">Поле обязательно для заполнения</span>
          <span v-if="!$v.dateFrom.isValid">Не корректная дата</span>
        </div>
      </div>

      <div class="btns text-right">
        <button id="popup-submit" type="submit" class="btn btn-success">Сохранить</button>
      </div>

    </form>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {required} from 'vuelidate/lib/validators'
  import Spinner from './common/Spinner'
  import Notification from './common/Notification'
  import {eventBus} from '../main';

  export default {
    name: "VacationEditPopup",
    props: ['props'],
    validations: {
      dateFrom: {required},
      dateTo: {required}
    },
    components: {Spinner, Notification},
    data() {
      return {
        dateFrom: '',
        dateTo: '',
        loading: false,
        vacation: this.props.vacation
      }
    },
    computed: mapGetters(['getNotification']),
    methods: {
      ...mapActions(['editVacation']),

      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        const updatedVacation = {
          ...this.vacation,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
        }
        this.loading = true;
        const result = await this.editVacation(updatedVacation);
        if (result) {
          this.$modal.close();
          eventBus.$emit('vacationUpdated');
        }
        this.loading = false;
      }

    },
    created() {
      this.dateFrom = this.$options.filters.formatDatePicker(this.vacation.dateFrom);
      this.dateTo = this.$options.filters.formatDatePicker(this.vacation.dateTo);
    }
  }
</script>

<style lang="less" scoped>
  .popup-content {
    min-width: 400px;
  }
</style>
