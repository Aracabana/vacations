<template>
  <section class="auth-main">
    <router-link to="/registration" class="auth-registration-link">Зарегистрироваться</router-link>
    <div class="container">
      <h1 class="text-center text-uppercase mb-5">Мой отпуск</h1>
      <form id="login-form" class="auth-form" @submit.prevent="submit">
        <Notification v-if="getNotification && getNotification.page === 'Login'"></Notification>
        <Spinner v-if="loading"></Spinner>
        <div class="form-group">
          <label for="authLogin">Логин</label>
          <input
            v-model.trim="login"
            id="authLogin"
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
          <label for="authPassword">Пароль</label>
          <input
            v-model.trim="password"
            id="authPassword"
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
          <div class="row">
            <div class="col" hidden>
              <a href="">Забыли пароль?</a>
            </div>
            <div class="col">
              <div class="form-check text-right">
                <input v-model="setSession"
                       type="checkbox"
                       class="form-check-input"
                       id="authRememberMe">
                <label class="form-check-label" for="authRememberMe">Запомнить меня</label>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-success btn-block">Войти</button>
      </form>
    </div>
  </section>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {required, minLength} from 'vuelidate/lib/validators'
  import Notification from '../components/Notification'
  import Spinner from '../components/Spinner'
  import request from '../utils/request';

  export default {
    name: 'Login',
    data() {
      return {
        loading: false,
        login: 'yuliya',
        password: '1111',
        setSession: false
      }
    },
    computed: mapGetters(['getNotification']),
    components: {
      Notification, Spinner
    },
    validations: {
      login: {minLength: minLength(4), required},
      password: {minLength: minLength(4), required}
    },
    methods: {
      ...mapMutations(['updateNotification', 'updateUser']),
      async submit() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
        this.loading = true;
        const formData = {
          login: this.login,
          password: this.password,
          setSession: this.setSession
        }
        const data = await request('/auth/login', 'POST', formData, 'Login');
        if (data && data.ok) {
          this.updateUser(data.user);
          data.page = 'Login';
          this.updateNotification(data);
          setTimeout(() => this.$router.push('/'), 1050);
        }
        this.loading = false;
      }
    }
  }
</script>

<style scoped>

</style>
