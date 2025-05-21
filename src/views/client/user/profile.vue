<template>
    <div class="header flex items-center justify-between p-4">
        <div class="flex items-center gap-4">
            <div v-if="!workspace">
                <RouterLink to="/">
                    <img src="https://placehold.co/600x400" alt="logo" width="80px">
                </RouterLink>
            </div>
            <div v-else>
                <RouterLink to="/workspace/dashboard">
                    <img src="https://placehold.co/600x400" alt="logo" width="80px">
                </RouterLink>
            </div>
            <p class="text-[24px] font-semibold text-primary">Cài đặt cá nhân</p>
        </div>
        <Button icon="pi pi-sign-out" variant="outlined" rounded @click="signout"/>
    </div>
    <div style="margin-top: 60px;">
        <Tabs value="0">
            <div class="flex justify-center">
                <TabList>
                    <Tab value="0">Cá nhân</Tab>
                    <Tab value="1">Bảo mật</Tab>
                    <Tab value="2">Workspace</Tab>
                </TabList>
            </div>
            <div class="container">
                <TabPanels>
                    <TabPanel value="0">
                        <div class="mt-4">
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="username">Username</label>
                                <InputText id="username" v-model="username" autocomplete="off"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="email">Email</label>
                                <InputText id="email" v-model="email" autocomplete="off" disabled/>
                                <Message size="small" severity="secondary" variant="simple">
                                    <div class="flex items-center gap-2">
                                        <i class="pi" :class="verify ? 'pi-check' : 'pi-times'"></i>
                                        {{ verify ? 'Verified' : 'Unverified' }}
                                    </div>
                                </Message>
                            </div>
                            <div class="button-feild flex justify-between mt-4">
                                <Button icon="pi pi-trash" label="Xóa tài khoản" variant="text"/>
                                <Button label="Chỉnh sửa"/>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                    </TabPanel>
                    <TabPanel value="2">
                        <div v-if="!workspace" class="m-4">
                            Bạn chưa có Workspace
                            <RouterLink to="create_workspace">
                                <Button label="Tạo mới" icon="pi pi-plus" variant="text"/>
                            </RouterLink>
                        </div>
                        <div class="flex gap-4 items-center" v-else>
                            <div>{{ workspace.workspace_name }}</div>
                            <RouterLink to="/workspace/dashboard">
                                <Button label="Đi tới Dasboard" icon="pi pi-arrow-up-right"/>
                            </RouterLink>
                        </div>
                    </TabPanel>
                </TabPanels>
            </div>
        </Tabs>
    </div>
</template>
<script setup>
import { useUserStore } from '@/store/user';
import { Tabs, Tab, TabList, TabPanels, TabPanel, Button, InputText, Message } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const workspace = userStore.workspace;
const user = userStore.user;
const username = user.username;
const email = user.email;
const verify = user.verify;

console.log(userStore);

async function signout() {
    try {
        userStore.logout();
        router.push('/'); // Chuyển hướng về trang đăng nhập
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

</script>