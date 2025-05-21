<script setup>
defineProps({
  currentDirectory: {
    type: Array,
    default: [],
  },
});
</script>
<template>
  <div class="py-2 px-2">
    <ol class="flex items-center">
      <li class="text-sm breadcrumb-item">
        <a
          class=""
          href="/"
          ><i class="pi pi-home"></i> Pages</a
        >
      </li>
      <i class="pi pi-angle-right breadcrumb-item"></i>
      <template v-for="(item, index) in currentDirectory">
        <li v-if="item != null"
          class="text-sm breadcrumb-item"
          :class="index == currentDirectory.length-1 ? 'active' : ''"
          aria-current="page"
        >
          {{ item }}
        </li>
        <i class="pi pi-angle-right breadcrumb-item" v-if="index < currentDirectory.length-1"></i>
      </template>
    </ol>
  </div>
</template>
