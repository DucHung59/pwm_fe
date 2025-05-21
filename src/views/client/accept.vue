<template>
    <div class="header flex items-center justify-between px-4">
        <img src="https://placehold.co/600x400" alt="logo" width="80px">
        <div class="" v-if="!userStore.isLoggedIn">
            <Button class="mx-2 button">
                <RouterLink :to="{ path: '/login', query: { inviteToken: inviteToken } }">
                    Đăng nhập
                </RouterLink>
            </Button>
            <Button class="mx-2 button" variant="outlined">
                <RouterLink :to="{ path: '/signup', query: { inviteToken: inviteToken } }">
                    Đăng ký
                </RouterLink>
            </Button>
        </div>
        <div v-else>
            <Button class="mx-2 button" variant="outlined">
                <RouterLink :to="{ path: '/workspace/dashboard' }">
                    tới Dashboard
                </RouterLink>
            </Button>
        </div>
    </div>
    <div class="container mx-auto">
        <div class="flex items-center justify-center">
            <div class="w-1/2" v-if="userStore.workspace">
                <h1 class="text-2xl font-bold">Chào mừng bạn đến với {{ userStore.workspace?.workspace_name }}</h1>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { useUserStore } from '@/store/user';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const inviteToken = route.params.inviteToken;

const userStore = useUserStore();

async function acceptInvite() {
    try {
        const res = await api.post(`workspace/invite/accept`, {
            token: inviteToken
        });
        const inviteData = res.data;
        console.log(inviteData);
        userStore.workspace = inviteData.workspace;
        userStore.role = inviteData.role;
    } catch (error) {
        console.error('Không thể accept lời mời:', error);
    }
}

onMounted(() => {
    acceptInvite();
})

</script>