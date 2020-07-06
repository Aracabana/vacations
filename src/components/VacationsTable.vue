<template>
    <div class="table-responsive vacation-table-wrapper">
        <ServerFeedback
                v-if="showServerFeedback"
                :ok="serverFeedback.ok"
                :text="serverFeedback.text"
        ></ServerFeedback>
        <Spinner v-if="showSpinner"></Spinner>
        <table id="vacations-table" class="table table-striped table-bordered table-hover vacations-table">
            <thead class="thead-dark">
            <tr>
                <th scope="col">Страна</th>
                <th scope="col" class="text-center">Дата начала</th>
                <th scope="col" class="text-center">Дата окончания</th>
                <th scope="col">Статус</th>
                <th scope="col" style="width: 100px;"></th>
            </tr>
            </thead>
            <tbody>
            
            </tbody>
        </table>
    </div>
</template>

<script>
    import ServerFeedback from '../components/ServerFeedback';
    import Spinner from '../components/Spinner';
    export default {
        name: "VacationsTable",
        data() {
            return {
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
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/less/variables';

    .vacation-table-wrapper {
        max-height: 600px;
    }
    .vacations-table {
        overflow: hidden;
    }
    .vacations-table tr td {
        cursor: pointer;
    }
    .table-responsive {
        position: relative;
    }
    .table-row:hover .action-block {
        opacity: 1;
    }
    .action-block {
        .flex();
        .space-around();
        .align-items-center();
        height: 100%;
        width: 100px;
        background-color: transparent;
        opacity: 0;
        .transition();
    }

</style>
