<template>
    <div class="sidebar" style="margin-top: 60px;">
        <div class="nav-icon">
            <i class="pi pi-bars"></i>
        </div>
        <RouterLink
            v-for="item in items"
            :key="item.name"
            :to="item.to"
            class="nav-icon"
            :class="{ active: item.name.toLowerCase() === active }"
            v-tooltip.right="item.name"
            >
            <i :class="item.icon"></i>
        </RouterLink> 
    </div>
</template>
<style src="../../assets/css/sidebar.css"></style>
<script setup>
const props = defineProps({
  active: String,
});

const items = [
  { name: 'Home', icon: 'pi pi-home', to: '/workspace/project' },
  { name: 'Add', icon: 'pi pi-plus', to: '/workspace/project/add' },
  { name: 'Issue', icon: 'pi pi-list', to: '/workspace/project/issue' },
  { name: 'File', icon: 'pi pi-folder-open', to: '/workspace/project/file' },
  { name: 'Wiki', icon: 'pi pi-file-word', to: '/workspace/project/wiki' },
  { name: 'Settings', icon: 'pi pi-cog', to: '/workspace/project/settings' },
];
</script>