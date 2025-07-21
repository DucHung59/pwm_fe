<template>
    <div class="header flex items-center justify-between p-4">
        <div class="flex items-center gap-4">
            <div v-if="!workspace">
                <RouterLink to="/">
                    <img :src="'/logo_rikai.png'" alt="logo" width="80px">
                </RouterLink>
            </div>
            <div v-else>
                <RouterLink to="/workspace/dashboard">
                    <img :src="'/logo_rikai.png'" alt="logo" width="80px">
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
                                <InputText id="username" v-model="username" autocomplete="off" :disabled="userStore.isSystemAdmin"/>
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
                            <template v-if="!userStore.isSystemAdmin">
                                <div class="button-feild flex justify-between mt-4">
                                    <Button icon="pi pi-trash" label="Xóa tài khoản" variant="text"/>
                                    <Button label="Chỉnh sửa"/>
                                </div>
                            </template>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <template v-if="userStore.isSystemAdmin">
                            Bạn đang đăng nhập với tài khoản Admin, không thể chỉnh sửa thông tin này
                        </template>
                        <template v-else>

                        </template>
                    </TabPanel>
                    <TabPanel value="2">
                        <template v-if="userStore.isSystemAdmin">
                            Bố mày là admin
                            <div class="my-4 flex justify-between items-center">
                                <label for="">Lựa chọn Workspace</label>
                                <RouterLink to="/create_workspace">
                                    <Button label="Tạo workspace" icon="pi pi-plus" rounded variant="outlined"/>
                                </RouterLink>
                            </div>
                            <div class="my-4 flex justify-between items-center">
                                <Select v-model="selectedWorkspace" :options="workspaces" optionLabel="workspace_name" optionValue="id" placeholder="Lựa chọn Workspace" class="w-lg" @change="onWorkspaceChange"/>
                                <RouterLink to="/workspace/dashboard">
                                    <Button label="Đi tới Dasboard" icon="pi pi-arrow-up-right"/>
                                </RouterLink>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="workspace == null" class="m-4">
                                <div class="flex justify-around items-center gap-2">
                                    <p>
                                        Bạn chưa có Workspace, vui lòng liên hệ quản lý để thêm vào workspace
                                    </p>
                                </div>
                            </div>
                            <div v-else>
                                <p class="text-center text-2xl font-semibold">Thông tin workspace</p>
                                <div class="flex justify-around items-center gap-2 mt-4">
                                    <div class="text-lg">Workspace: <span class="font-semibold">{{ workspace.workspace_name }}</span></div>
                                    <RouterLink to="/workspace/dashboard">
                                        <Button label="Đi tới Dasboard" icon="pi pi-arrow-up-right"/>
                                    </RouterLink>
                                </div>
                            </div>
                        </template>
                    </TabPanel>
                </TabPanels>
            </div>
        </Tabs>
    </div>
</template>
<script setup>
import { useUserStore } from '@/store/user';
import { Tabs, Tab, TabList, TabPanels, TabPanel, Button, InputText, Message, Select } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const workspace = userStore.workspace;
const workspaces = userStore.workspaces;

const user = userStore.user;
const username = user.username;
const email = user.email;
const verify = user.verify;

const selectedWorkspace = ref(workspaces[0]?.id);

console.log(userStore);

function onWorkspaceChange() {
    console.log(selectedWorkspace.value);
    userStore.getWorkspaceById(selectedWorkspace.value);
}

async function signout() {
    try {
        userStore.logout();
        router.push('/'); // Chuyển hướng về trang đăng nhập
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

</script>