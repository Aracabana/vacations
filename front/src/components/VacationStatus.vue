<template>
  <span
    class="badge"
    :class="'badge-'"
  >
<!--    {{status.text}}-->
    {{status}}
  </span>
</template>

<script>
  export default {
    name: "VacationStatus",
    props: ['dateFrom', 'dateTo'],
    computed: {
      status() {
        console.log(this.dateFrom);
        // console.log(new Intl.DateTimeFormat('en-US').format(this.dateFrom))
      //   const dateFrom = new Date(new Intl.DateTimeFormat('en-US').format(this.dateFrom));
      //   const dateTo = new Date(new Intl.DateTimeFormat('en-US').format(this.dateTo));
      //   console.log(this.dateFrom)
      //   const now = new Date();
      //   const fromMs = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0, 0).valueOf();
      //   const toMs = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0, 0).valueOf();
      //   const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).valueOf();
      //   return (nowMs < fromMs) ? { text: 'Ожидание', class: 'success' } :
      //          (nowMs >= fromMs && nowMs < toMs) ? { text: 'В процессе', class: 'warning' } :
      //          { text: 'Завершен', class: 'danger' };
      }
    }
  }
</script>

<style scoped>

</style>
