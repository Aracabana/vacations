<template>
    <section class="auth-main">
        <router-link to="/login" class="auth-registration-link">Уже зарегистрированы?</router-link>
        <div class="container">
            <h1 class="text-center text-uppercase mb-5">Мой отпуск</h1>
            <form id="registration-form" class="auth-form" @submit.prevent="submit">
                <ServerFeedback
                        v-if="showServerFeedback"
                        :ok="serverFeedback.ok"
                        :text="serverFeedback.text"
                ></ServerFeedback>
                <Spinner v-if="showSpinner"></Spinner>
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
    import {required, minLength, email, sameAs} from 'vuelidate/lib/validators';
    import Spinner from '../components/Spinner.vue';
    import ServerFeedback from '../components/ServerFeedback';
    
    export default {
        name: "Registration",
        data() {
            return {
                login: '',
                email: '',
                password: '',
                confirmPassword: '',
                showSpinner: false,
                showServerFeedback: false,
                serverFeedback: {
                    ok: false,
                    text: ''
                }
            }
        },
        components: {
            ServerFeedback, Spinner
        },
        validations: {
            login: {minLength: minLength(4), required},
            email: {email, required},
            password: {minLength: minLength(4), required},
            confirmPassword: {sameAsPassword: sameAs('password'), required},
        },
        methods: {
            async submit() {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }
                const formData = {
                    login: this.login,
                    email: this.email,
                    password: this.password,
                    confirmPassword: this.confirmPassword
                };
                try {
                    // this.showSpinner = true;
                    const response = await fetch('http://localhost:8080/auth/registration', {
                        method: 'POST',
                        // credentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    // setServerFeedback(feedbackElem, data);
                    this.setServerFeedback(data);
                    if (data.ok) {
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 500);
                    }
                } catch (err) {
                    // setServerFeedback(feedbackElem,{ ok: false, caption: err });
                    this.setServerFeedback({ ok: false, caption: err });
                    this.showServerFeedback = true;
                    this.serverFeedback.ok = false;
                    this.serverFeedback.text = err;
                }
                // finally {
                //     setTimeout(() => {
                //         this.showSpinner = false;
                //     }, 500)
                // }
            },
            setServerFeedback(data) {
                this.showServerFeedback = true;
                this.serverFeedback.ok = data.ok;
                this.serverFeedback.text = data.caption;
                setTimeout(() => {
                    this.showServerFeedback = false
                }, 3000);
            }
        }
    }
</script>

<style scoped>

</style>
