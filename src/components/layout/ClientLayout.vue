<template>
  <Header/>
  <div style="margin-top: 60px;">
      <router-view />
  </div>
</template>
<style src="../../assets/css/clientStyle.css"></style>
<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './header.vue';


const route = useRoute();

const currentDirectory = computed(() => {
  let dir = route.path;
  
  if (dir == '/') {
    dir = ['','Trang chủ'];
  } else {
    dir =  dir.split("/");
  }
  
  return dir.slice(1);
});
</script>
