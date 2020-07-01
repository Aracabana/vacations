<template>
    <router-view></router-view>
</template>

<style lang="less">
    @import '../assets/less/variables';
    .auth-main {
        position: relative;
        .flex();
        .flex-center();
        .align-items-center();
        height: 100vh;
        background-image: linear-gradient( 0deg, #79F1A4 10%, #0E5CAD 100%);
        h1 {
            color: #ffffff;
        }
    }
    .auth-registration-link {
        position: absolute;
        top: 15px;
        right: 15px;
        text-decoration: underline;
        color: #ffffff;
        &:hover, &:focus, &:active {
            text-decoration: none;
            color: #ffffff;
        }
    }
    .auth-form {
        margin: 0 auto;
        .border-radius(8px);
        padding: 30px;
        max-width: 460px;
        background-color: fade(#ffffff, 60%);
    }
</style>
