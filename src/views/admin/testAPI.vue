<template>
    <div>
        <h1>Test API</h1>
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { toastService } from '@/assets/js/toastHelper';

const toast = new toastService(useToast());

const message = ref([]);

async function getTestAPI() {
    axios.get('http://localhost:8000/api/test')
    .then(response => {
        message.value = response.data.message;
        toast.info(message.value, "Huy răm");
    })
    .catch(error => {
        console.log(error);
    });
}
onMounted(() => {
    getTestAPI();
});
</script>
