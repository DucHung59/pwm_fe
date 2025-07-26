<template>
    <div class="bg-img">
        <div class="header flex items-center justify-between px-4">
            <RouterLink to="/">
                <img :src="'/logo_rikai.png'" alt="logo" width="100px">
            </RouterLink>
        </div>
        <div class="sub-header text-center" style="margin-top: 60px;">
            <p class="text-[40px] font-semibold">Đăng ký tài khoản với PM - Rikai</p>
        </div>
        <div class="login-container">
            <form class="login-form flex flex-col justify-center items-center">
                <p class="font-semibold text-[24px]">Tạo tài khoản</p>
                <div class="mt-4 my-8 w-full">
                    <div class="my-4">
                        <FloatLabel variant="on">
                            <InputText id="username" v-model="username" class="w-full" aria-autocomplete="off"/>
                            <label for="username">Tên người dùng</label>
                        </FloatLabel>
                    </div>
                    <div class="my-4">
                        <FloatLabel variant="on">
                            <InputText id="email" v-model="email" class="w-full" aria-autocomplete="off"/>
                            <label for="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div class="my-4">
                        <FloatLabel variant="on">
                            <InputText id="password" v-model="password" class="w-full" type="password"/>
                            <label for="password">Mật khẩu</label>
                        </FloatLabel>
                    </div>
                </div>
                <Button class="button" @click="signin" loading-icon="pi pi-spin pi-spinner" :loading="isLoading">Đăng ký</Button>
            </form>
            <div class="text-center mt-8">
                <p>Bạn đã có tài khoản? <span class="other-signin"><RouterLink to="login">Đăng nhập</RouterLink></span></p>
            </div>
        </div>
        <Footer/>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import Footer from '@/components/layout/footer.vue'
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router'
import { FloatLabel, Button, InputText, useToast } from 'primevue';
import { toastService } from '@/assets/js/toastHelper';
import { useUserStore } from '@/store/user';
import api from '@/api/axios';

const toast = new toastService(useToast());
const userStore = useUserStore();
const router = useRouter()
const route = useRoute();

const isLoading = ref(false);

const username = ref('');
const email = ref('');
const password = ref('');

async function signin() {
    try {
        isLoading.value = true;
        const response = await api.post('auth/signup', {
            username: username.value,
            email: email.value,
            password: password.value,
        });

        const data = response.data;
        localStorage.setItem('token', data.token);
        userStore.user = data.user;

        const inviteToken = route.query.inviteToken;
        if(inviteToken) {
            try {
                const res = await api.post(`workspace/invite/accept`, {
                    token: inviteToken
                });
                const inviteData = res.data;
                userStore.workspace = inviteData.workspace;
                userStore.role = inviteData.role;
            } catch (error) {
                console.error('Không thể accept lời mời:', error);
            }
        }

        if(userStore.workspace) {
            router.push('/workspace/dashboard');
            toast.success(`Chào mừng ${data.user.username}`, "Đăng ký thành công")
        } else {
            router.push('/profile');
            toast.success(`Chào mừng ${data.user.username}`, "Đăng ký thành công")
        }
    } catch (err) {
        console.log(err.message);
        toast.error("Đăng ký thất bại", "Lỗi")
    } finally {
        isLoading.value = false;
    }
}

</script>