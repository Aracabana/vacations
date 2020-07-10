<template>
  <nav class="navbar navbar-dark bg-dark header">
    <div class="avatar-wrapper">
      <div class="avatar">
        <i class="fas fa-user"></i>
      </div>
      <p class="avatar-name text-white text-center">Login</p> <!--request.session.login-->
      <p class="logout">
        <span>|</span>
        <a href="/auth/logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
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
  export default {
    name: 'Header',
    props: ['btn'],
    methods: {
      logout() {
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
    a {
      margin-left: 8px;
      color: #ffffff;
    }
  }
</style>
