<template>
    <div class="bg-img">
        <div class="header flex items-center justify-between px-4">
            <RouterLink to="/">
                <img :src="'/logo_rikai.png'" alt="logo" width="100px">
            </RouterLink>
        </div>
        <div class="sub-header text-center" style="margin-top: 60px;">
            <p class="text-[40px] font-semibold">Đăng nhập vào Dashboard PM - Rikai</p>
        </div>
        <div class="login-container mx-4">
            <form class="login-form flex flex-col justify-center items-center">
                <p class="font-semibold text-[24px]">Đăng nhập</p>
                <p class="font-stretch-75%">hoặc</p>
                <p class="other-signin"><RouterLink to="/signup">đăng ký tài khoản</RouterLink></p>
                <div class="mt-4 w-full">
                    <div class="my-4">
                        <FloatLabel variant="on">
                            <InputText id="email" v-model="email" class="w-full" aria-autocomplete="off"/>
                            <label for="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div class="my-4">
                        <FloatLabel variant="on">
                            <InputText id="password" v-model="password" class="w-full" type="password"/>
                            <label for="password">Password</label>
                        </FloatLabel>
                    </div>
                </div>
                <Button class="button" @click="signin" :loading="isLoading" loadingIcon="pi pi-spinner pi-spin" :class="isLoading ? 'loading' : ''" label="Đăng nhập"/>
                <div class="flex flex-col items-center mt-10">
                    <div>
                        <p>Hoặc</p>
                    </div>
                    <div class="flex gap-4 justify-center mt-4">
                        <Button label="Google" icon="pi pi-google" variant="outlined"/>
                        <Button label="Github" icon="pi pi-github" variant="outlined"/>
                    </div>
                </div>
            </form>
        </div>
        <Footer/>
    </div>
</template>
<script setup>
import Footer from '@/components/layout/footer.vue'
import { FloatLabel, Button, InputText } from 'primevue';

import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { toastService } from '@/assets/js/toastHelper';
import { useUserStore } from '@/store/user';
import api from '@/api/axios';

const toast = new toastService(useToast());
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isLoading = ref(false);

function validated() {
    if(email.value == '' || password.value == '') {
        toast.info("Vui lòng nhập thông tin đăng nhập", "Thông báo");
        return true;
    }
    if(!emailRegex.test(email.value)) {
        toast.info("Không đúng định dạng email", "Thông báo")
        return true;
    }
    return false;
}

async function signin() {
    if(validated()) {
        return;
    }
    try {
        isLoading.value = true;
        const response = await api.post('/auth/signin', {
            email: email.value,
            password: password.value,
        })

        const data = response.data;
        
        localStorage.setItem('token', data.token);
        userStore.user = data.user;
        userStore.workspace = data.workspace;
        userStore.role = data.role;

        const inviteToken = route.query.inviteToken;
        if(inviteToken) {
            try {
                const res = await api.post(`workspace/invite/accept`, {
                    token: inviteToken
                });
                const inviteData = res.data;
                userStore.workspace = inviteData.workspace;
                userStore.role = inviteData.role;

                toast.success(`Lời mời được chấp nhận!`, 'Thành công');
                router.push(`/workspace/dashboard`);
                return;
            } catch (inviteError) {
                console.error('Không thể accept lời mời:', inviteError);
                toast.error('Không thể chấp nhận lời mời.', 'Lỗi');
            }
        }

        if(userStore.workspace) {
            router.push('/workspace/dashboard');
            toast.success(`Chào mừng ${data.user.username}`, "Đăng nhập thành công")
        } else {
            router.push('/profile');
            toast.success(`Chào mừng ${data.user.username}`, "Đăng nhập Thành công")
        }
    } catch (error) {
        if (error.response && error.response.status === 422) {
            toast.error("Thông tin đăng nhập không đúng", "Lỗi")
        } else {
            toast.error("Đăng nhập thất bại", "Lỗi")
        }
        console.log(error.message);
    } finally {
        isLoading.value = false;
    }
}
</script>