<template>
  <nav class="navbar navbar-dark bg-dark header">
    <div class="avatar-wrapper">
      <div class="avatar">
        <i class="fas fa-user"></i>
      </div>
      <p class="avatar-name text-white text-center">{{getUserLogin}}</p>
      <p class="logout">
        <span>|</span>
        <button type="button" class="logout-btn" @click="logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </p>
    </div>
    <router-link
      :to="btn.url"
      class="btn"
      :class="btn.class"
    >
      <i class="fas" :class="btn.icon"></i>
      {{btn.title}}
    </router-link>
  </nav>
</template>

<script>
  import request from '../utils/request';
  import {mapMutations, mapGetters} from 'vuex';

  export default {
    name: 'Header',
    data() {
      return {
        btn: {}
      }
    },
    computed: mapGetters(['getUserLogin']),
    methods: {
      ...mapMutations(['updateNotification']),
      async logout() {
        try {
          await request('/auth/logout', 'GET');
        } catch (err) {
          this.updateNotification({ok: false, caption: err});
        }
        finally {
          await this.$router.push('/login');
        }
      },
      changeBtn() {
        this.btn = this.$route.meta.headerBtn;
      }
    },
    mounted() {
      this.changeBtn();
    },
    watch: {
      $route () {
        this.changeBtn();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 100;
  }
  .avatar {
    margin-right: 8px;
    .border-radius(50%);
    height: 32px;
    width: 32px;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    background-color: #ffffff;
    &-wrapper {
      .flex();
      .align-items-center();
      .flex-start();
    }
    &-name {
      margin-bottom: 0;
      font-size: 14px;
    }
  }
  .logout {
    margin-left: 12px;
    margin-bottom: 0;
    font-size: 14px;
    color: #ffffff;
    &-btn {
      margin-left: 8px;
      border: none;
      background: none;
      color: #ffffff;
    }
  }
</style>
