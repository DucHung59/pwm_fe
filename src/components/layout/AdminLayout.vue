<template>
    <Card class="m-4 block px-0">
      <template #title>
        <div class="flex items-center justify-between"> 
          <h6>E-commerce</h6>
          <Configurator />
        </div>
      </template>
      <template #subtitle>
        <Breadcumbs :currentDirectory="currentDirectory"/>
      </template>
      <router-view />
    </Card>
</template>
<script setup>
import Breadcumbs from '@/components/common/Breadcumbs.vue';
import Card from 'primevue/card';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Configurator from '../../components/common/Configurator.vue'

const route = useRoute();

const isLogin = ref(false)

const currentDirectory = computed(() => {
  let dir = route.path;
  
  if (dir == null) {
    dir = ['','Trang chủ'];
  } else {
    dir =  dir.split("/");
  }
  return dir.slice(1);
});
</script>