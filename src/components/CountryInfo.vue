<template>
    <div class="card country-info">
        <div class="card-body">
            <h5 class="card-title">{{data.countryName}}</h5>
            <div class="row">
                <div class="col-lg-8 col-md-7 col-sm-12">
                    <p>
                        <strong>Столица: </strong>
                        <span>{{data.capital}}</span>
                    </p>
                    <p>
                        <strong>Площадь: </strong>
                        <span>{{data.areaInSqKm}} км<sup>2</sup></span>
                    </p>
                    <p>
                        <strong>Население: </strong>
                        <span>{{data.population}}</span>
                    </p>
                </div>
                <div v-if="data.additional" class="col-lg-4 col-md-5 col-sm-12">
                    <p>
                        <strong>Языки: </strong>
                        <span>
                    <span v-for="(language, index) in data.additional.languages" :key="index">{{language.name}}</span>
                </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Country} from '../mixins/Country';
    
    export default {
        name: "CountryInfo",
        props: ['countryCode'],
        data() {
            return {
                code: this.countryCode,
                data: {}
                // countryName: ''
            }
        },
        mixins: [Country],
        watch: {
            countryCode: function(newVal, oldVal) {
                console.log(this.code);
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                this.code = newVal;
                console.log(this.code);
            }
        },
        mounted() {
            this.loadData(['latlng', 'languages']);
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/less/variables';
    
    .country-info {
        height: 100%;
    }
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
</style>
