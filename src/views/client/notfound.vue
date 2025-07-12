<template>
     <div id="clouds">
            <div class="cloud x1"></div>
            <div class="cloud x1_5"></div>
            <div class="cloud x2"></div>
            <div class="cloud x3"></div>
            <div class="cloud x4"></div>
            <div class="cloud x5"></div>
    </div>
    <div class='c'>
        <div class='_404'>404</div>
        <hr>
        <div class='_1'>TRANG NÀY</div>
        <div class='_2'>KHÔNG TỒN TẠI</div>
        <a class='btn' @click="goBack">QUAY LẠI TRANG CHỦ</a>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const router = useRouter();

function goBack() {
    router.push('/');
}

let styleEl
onMounted(() => {
  styleEl = document.createElement('link')
  styleEl.rel = 'stylesheet'
  styleEl.href = '/src/assets/css/notfound.css'
  document.head.appendChild(styleEl)
  console.log(styleEl);
})

onUnmounted(() => {
  if (styleEl && document.head.contains(styleEl)) {
    document.head.removeChild(styleEl)
  }
})
</script>
  