<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ScrollTop from 'primevue/scrolltop';
import { onMounted } from 'vue';
import { useUserStore } from './store/user';
import axios from 'axios';

const userStore = useUserStore();

onMounted(() => {
  axios.defaults.withCredentials = true; // nhớ config axios gửi cookie
  userStore.fetchUser();
});

</script>

<template>
  <Toast />
  <RouterView />
  <ScrollTop />
</template>

