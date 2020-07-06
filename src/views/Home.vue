<template>
    <section class="main-body">
        <Header :btn="headerBtn"></Header>
        <div class="page-wrapper">
            <div class="container-fluid">
                <h1>Мои отпуска</h1>
                <div class="content">
                    <VacationsFilter></VacationsFilter>
                    <VacationsTable></VacationsTable>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Header from '../components/Header';
    import VacationsFilter from '../components/VacationsFilter';
    import VacationsTable from '../components/VacationsTable';
    export default {
        name: "Home",
        data() {
            return {
                headerBtn: {
                    url: '/create-vacation',
                    title: 'Создать отпуск',
                    class: 'btn-success',
                    icon: 'fa-plus'
                }
            }
        },
        components: {
            Header, VacationsFilter, VacationsTable
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/less/variables';
    
</style>
