<template>
    <div class="header flex items-center justify-between p-4">
        <RouterLink to="/">
            <img :src="'/logo_rikai.png'" alt="logo" width="80px">
        </RouterLink>
    </div>
    <div style="margin-top: 60px;" class="container py-8">
        <div class="flex flex-col gap-2">
            <label for="workspaceName">Tên Workspace:</label>
            <InputText id="workspaceName" v-model="workspaceName" autocomplete="off" />
            <Message size="small" severity="secondary" variant="simple">Nhập tên workspace bạn muốn tạo</Message>
        </div>
        <div class="flex justify-between items-center mt-4">
            <Button label="Làm mới bản ghi" icon="pi pi-eraser" variant="text" @click="workspaceName = ''"/>
            <Button label="Tạo mới" icon="pi pi-plus" :loading="isCreatingWorkspace" loadingIcon="pi pi-spinner pi-spin" @click="createWorkspace"/>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { toastService } from '@/assets/js/toastHelper';
import { useUserStore } from '@/store/user';
import { Message, InputText, Button, useToast } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const toast = new toastService(useToast());

const workspaceName = ref('');
const isCreatingWorkspace = ref(false);


async function createWorkspace() {
    try {
        isCreatingWorkspace.value = true;
        const response = await api.post('/workspace/create', {
            workspaceName: workspaceName.value,
        })

        const data = response.data;
        
        userStore.workspace = data.workspace;
        userStore.role = data.workspace_member.role; 
        router.push('/workspace/dashboard');
        toast.success(`Tạo workspace ${data.workspace.workspace_name} thành công`, 'Tạo mới thành công');

    } catch (error) {
        toast.error("Tạo mới thất bại", "Lỗi")
        console.log(error.message);
    } finally {
        isCreatingWorkspace.value = false;
    }
}
</script>