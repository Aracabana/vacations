<template>
  <section class="auth-main">
    <router-link to="/login" class="auth-registration-link">Уже зарегистрированы?</router-link>
    <div class="container">
      <h1 class="text-center text-uppercase mb-5">Мой отпуск</h1>
      <form id="registration-form" class="auth-form" @submit.prevent="submit">
        <Notification v-if="getNotification"></Notification>
        <Spinner v-if="getSpinner"></Spinner>
        <div class="form-group">
          <label for="regLogin">Логин</label>
          <input
            v-model.trim="login"
            id="regLogin"
            type="text"
            class="form-control"
            :class="{'is-invalid': ($v.login.$dirty && !$v.login.required) || ($v.login.$dirty && !$v.login.minLength)}"
          >
          <small class="form-text text-muted">
            Логин должен содержать не менее {{$v.login.$params.minLength.min}} символов
          </small>
          <div
            v-if="$v.login.$dirty && !$v.login.required"
            class="invalid-feedback"
          >
            Поле обязательно для заполнения
          </div>
          <div
            v-else-if="$v.login.$dirty && !$v.login.minLength"
            class="invalid-feedback"
          >
            Логин должен содержать не менее {{$v.login.$params.minLength.min}} символов
          </div>
        </div>
        <div class="form-group">
          <label for="regEmail">E-mail</label>
          <input
            v-model.trim="email"
            id="regEmail"
            type="email"
            class="form-control"
            :class="{'is-invalid': ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
          >
          <div
            v-if="$v.email.$dirty && !$v.email.required"
            class="invalid-feedback"
          >
            Поле обязательно для заполнения
          </div>
          <div
            v-else-if="$v.email.$dirty && !$v.email.email"
            class="invalid-feedback"
          >
            Некорректный E-mail
          </div>
        </div>
        <div class="form-group">
          <label for="regPassword">Пароль</label>
          <input
            v-model.trim="password"
            id="regPassword"
            type="password"
            class="form-control"
            :class="{'is-invalid': ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          >
          <small class="form-text text-muted">
            Пароль должен содержать не менее {{$v.password.$params.minLength.min}} символов
          </small>
          <div
            v-if="$v.password.$dirty && !$v.password.required"
            class="invalid-feedback"
          >
            Поле обязательно для заполнения
          </div>
          <div
            v-else-if="$v.password.$dirty && !$v.password.minLength"
            class="invalid-feedback"
          >
            Пароль должен содержать не менее {{$v.password.$params.minLength.min}} символов
          </div>
        </div>
        <div class="form-group">
          <label for="regConfirmPassword">Подтверждение пароля</label>
          <input
            v-model.trim="confirmPassword"
            id="regConfirmPassword"
            type="password"
            class="form-control"
            :class="{'is-invalid': ($v.confirmPassword.$dirty && !$v.confirmPassword.required) || ($v.confirmPassword.$dirty && !$v.confirmPassword.sameAsPassword)}"
          >
          <div
            v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.required"
            class="invalid-feedback"
          >
            Поле обязательно для заполнения
          </div>
          <div
            v-else-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAsPassword"
            class="invalid-feedback"
          >
            Пароли не совпадают
          </div>
        </div>
        <button type="submit"
                class="btn btn-success btn-block">
          Зарегистрироваться
        </button>
      </form>
    </div>
  </section>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {required, minLength, email, sameAs} from 'vuelidate/lib/validators'
  import Spinner from '../components/Spinner.vue'
  import Notification from '../components/Notification'
  import request from '../utils/request';

  export default {
    name: 'Registration',
    data() {
      return {
        login: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    computed: mapGetters(['getNotification', 'getSpinner']),
    components: {
      Notification, Spinner
    },
    validations: {
      login: {minLength: minLength(4), required},
      email: {email, required},
      password: {minLength: minLength(4), required},
      confirmPassword: {sameAsPassword: sameAs('password'), required}
    },
    methods: {
      ...mapMutations(['updateNotification', 'updateSpinner']),
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        const formData = {
          login: this.login,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        }
        try {
          this.updateSpinner(true);
          const data = await request('/auth/registration', 'POST', formData);
          this.updateNotification(data)
          if (data.ok) {
            setTimeout(() => {
              this.$router.push('/login')
            }, 1050)
          }
        } catch (err) {
          this.updateNotification({ok: false, caption: err})
        } finally {
          this.updateSpinner(false);
        }
      }
    }
  }
</script>

<style scoped>

</style>
