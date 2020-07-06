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
                                                id="country"
                                                type="text"
                                                placeholder="Начните вводить"
                                                list="countries-list"
                                                class="form-control"
                                                :class="{'is-invalid': $v.country.$dirty && !$v.country.required}"
                                        >
                                        <datalist id="countries-list">
                                            <!--                                            {{#each countriesWithCode}}-->
                                            <!--                                            <option class="comment" data-code="{{this.code}}">{{this.name}}</option>-->
                                            <!--                                            {{/each}}-->
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
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 mt-lg-0 mt-md-0 mt-4">
                        <div id="country-info" hidden class="card country-info">
                            <div class="card-body">
                                <h5 id="name" class="card-title"></h5>
                                <div class="row">
                                    <div class="col-lg-8 col-md-7 col-sm-12">
                                        <p>
                                            <strong>Столица: </strong>
                                            <span id="capital"></span>
                                        </p>
                                        <p>
                                            <strong>Площадь: </strong>
                                            <span id="area"></span>
                                        </p>
                                        <p>
                                            <strong>Население: </strong>
                                            <span id="population"></span>
                                        </p>
                                    </div>
                                    <div class="col-lg-4 col-md-5 col-sm-12">
                                        <p id="languages-wrapper" hidden>
                                            <strong>Языки: </strong>
                                            <span id="languages"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="map-wrapper" class="map-wrapper card-img-bottom" hidden>
                            <div id="map"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';
    import {formatDate} from '../assets/js/formatDate'
    import Header from '../components/Header';
    import ServerFeedback from '../components/ServerFeedback';
    import Spinner from '../components/Spinner';
    
    export default {
        name: "CreateVacation",
        data() {
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
                country: '',
                dateFrom: '',
                dateTo: '',
            }
        },
        validations: {
            country: {required},
            dateFrom: {required},
            dateTo: {required},
        },
        components: {
            Header, ServerFeedback, Spinner
        },
        methods: {
            setDateFromMinValue() {
                const now = new Date();
                return formatDate(now);
            },
            setDateToMinValue() {
                const minForDateTo = new Date();
                minForDateTo.setDate(minForDateTo.getDate() + 1);
                return formatDate(minForDateTo);
            },
            submit() {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }
                //this.showSpinner = true;
                const formData = {
                    country: this.country,
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo
                };
                console.log(formData);
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/less/variables';
    
    .country-info {
        height: 100%;
        p {
            .flex();
            .flex-start();
            > strong {
                margin-right: 8px;
            }
        }
        span span {
            display: block;
        }
    }
    .map-wrapper {
        margin-top: 32px;
    }
    #map {
        z-index: 1;
        height: 300px;
    }

</style>
