<template>
    <Button icon="pi pi-cog" @click="configLayout = true" rounded></Button>
    <Drawer v-model:visible="configLayout" header="Settings" position="right">
        <div class="flex justify-between items-center">
            <span>Light/Dark</span>
            <Button @click="toggleDarkMode" class="px-2 py-1" rounded variant="outlined">
                <i id="dark-mode-icon" class="pi pi-sun"></i>
            </Button>
        </div>
        <div class="flex justify-between items-center mt-4"> 
            <span>Chọn ngôn ngữ</span>
            <ToggleButton v-model="checked" onLabel="En-Us" offLabel="Vi-Vn" />
        </div>
    </Drawer>
</template>
<script setup>
import { ref } from 'vue';
import { Button, Drawer, ToggleButton } from 'primevue'

const configLayout = ref(false);

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const darkIcon = document.getElementById('dark-mode-icon');
    if(darkIcon.classList.contains('pi-moon')) {
        darkIcon.classList.replace('pi-moon', 'pi-sun');
    } else {
        darkIcon.classList.replace('pi-sun', 'pi-moon');
    }
}
</script>

