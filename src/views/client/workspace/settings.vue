<template>
    <div>
        <div class="settings-sidebar">
            <ul>
                <li class="sidebar-items">
                    <p>{{ workspace.workspace_name }}</p>
                </li>
                <li class="sidebar-items">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-cog"></i>
                        <p>Cài đặt Space</p>
                    </div>
                    <div class="detail-settings">
                        <ul>
                            <li :class="{ active: activeSetting === 'space' }"
                                @click="setActive('space')"
                            >
                                Space
                            </li>
                            <li :class="{ active: activeSetting === 'info' }"
                                @click="setActive('info')"
                            >Thông tin</li>
                            <li :class="{ active: activeSetting === 'email' }"
                                @click="setActive('email')"
                            >Thông báo email</li>
                        </ul>
                    </div>
                </li>
                <li class="sidebar-items">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users"></i>
                        <p>Cài đặt người dùng</p>
                    </div>
                    <div class="detail-settings">
                        <ul>
                            <li :class="{ active: activeSetting === 'member' }"
                                @click="setActive('member')"
                            >Thành viên</li>
                        </ul>
                        <ul>
                            <li :class="{ active: activeSetting === 'invite-member' }"
                                @click="setActive('invite-member')"
                            >Thành viên được mời</li>
                        </ul>
                    </div>
                </li>
                <li class="sidebar-items">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users"></i>
                        <p>Cài đặt dự án</p>
                    </div>
                    <div class="detail-settings">
                        <ul>
                            <li :class="{ active: activeSetting === 'project' }"
                                @click="setActive('project')"
                            >Danh sách</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="content">
            <div v-if="!isLoading">
                <div class="space" v-if="activeSetting == 'space'">
                    Space page
                </div>
                <div class="info" v-if="activeSetting == 'info'">
                    Info page
                </div>
                <div class="email" v-if="activeSetting == 'email'">
                    Email page
                </div>
                <div class="member" v-if="activeSetting == 'member'">
                    <p class="text-2xl font-semibold">Danh sách thành viên <span class="text-sm text-gray-500">({{ members.length }} Người)</span></p>
                    <div class="flex items-center gap-4 my-4">
                        <Button label="Thêm thành viên" icon="pi pi-plus" variant="outlined" rounded size="small" @click="openAddMemberDialog = true"/>
                        <Button label="Quản lý thành viên" icon="pi pi-users" variant="outlined" rounded size="small"/>
                    </div>
                    <Dialog v-model:visible="openAddMemberDialog" header="Thêm thành viên" maximizable modal draggable="false" resizable="false" :style="{ width: '50vw' }">
                        <div>
                            <p class="text-1xl font-semibold">Thêm thành viên</p>
                            <div class="flex flex-col items-center gap-2">
                                <div class="flex flex-wrap gap-4">
                                    <label class="font-semibold">Vai trò:</label>
                                    <div class="flex items-center gap-2">
                                        <RadioButton v-model="role" inputId="admin" name="role" value="admin" />
                                        <label for="admin">Admin</label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <RadioButton v-model="role" inputId="member" name="role" value="member" />
                                        <label for="member">Member</label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <RadioButton v-model="role" inputId="guest" name="role" value="guest" />
                                        <label for="guest">Guest</label>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <p v-if="role == 'admin'" class="text-sm text-gray-600">Quản lý cài đặt Workspace: người dùng, thành viên, dự án</p>
                                    <p v-if="role == 'member'" class="text-sm text-gray-600">Tham gia vào Workspace chỉnh sửa, triển khai tiến độ dự án</p>
                                    <p v-if="role == 'guest'" class="text-sm text-gray-600">Xem các dự án, tiến độ dự án</p>
                                </div>
                                <div class="my-4">
                                    <InputText v-model="newMemberEmail" placeholder="Nhập email" class="w-2xl" :invalid="emailValid"/>
                                    <Message v-if="emailValid" severity="error" variant="simple" size="small" class="mt-2 ml-2">Email is not valid</Message>
                                </div>
                            </div>
                                <Button label="Thêm" icon="pi pi-plus" :loading="isInviteMemberLoading" loadingIcon="pi pi-spin pi-spinner" variant="outlined" rounded size="small" @click="inviteMember"/>
                        </div>
                    </Dialog>
                    <div>
                        <table class="w-full text-sm tr-border">
                            <thead>
                                <tr>
                                    <th class="px-3 py-2 border">#</th>
                                    <th class="px-3 py-2 border">Tên</th>
                                    <th class="px-3 py-2 border">Email</th>
                                    <th class="px-3 py-2 border">Vai trò</th>
                                    <th class="px-3 py-2 border">Ngày tham gia</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                                <template v-for="(member, index) in members" :key="member.id">
                                    <tr class="hover:bg-gray-100 cursor-default">
                                        <td class="px-3 py-2">{{ index + 1 }}</td>
                                        <td class="px-3 py-2">{{ member.user.username }}</td>
                                        <td class="px-3 py-2">{{ member.user.email }}</td>
                                        <td class="px-3 py-2">{{ member.role }}</td>
                                        <td class="px-3 py-2">{{ dayjs(member.created_at).format('DD/MM/YYYY HH:mm') }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="invite-member" v-if="activeSetting == 'invite-member'">
                    <div class="flex items-center gap-4 my-4">
                        <p class="text-2xl font-semibold">Danh sách thành viên được mời</p>
                        <Button></Button>
                    </div>
                    <div>
                        <table class="w-full text-sm tr-border">
                            <thead>
                                <tr>
                                    <th class="px-3 py-2 border">#</th>
                                    <th class="px-3 py-2 border">Email</th>
                                    <th class="px-3 py-2 border">Người mời</th>
                                    <th class="px-3 py-2 border">Vai trò (Role)</th>
                                    <th class="px-3 py-2 border">Trạng thái</th>
                                    <th class="px-3 py-2 border">Ngày mời</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                                <template v-for="(invite, index) in inviteMembers" :key="invite.id">
                                    <tr class="hover:bg-gray-100 cursor-default">
                                        <td class="px-3 py-2">{{ index + 1 }}</td>
                                        <td class="px-3 py-2">{{ invite.email }}</td>
                                        <td class="px-3 py-2">{{ invite.inviter.username }}</td>
                                        <td class="px-3 py-2">{{ invite.role }}</td>
                                        <td class="px-3 py-2">
                                            <span v-if="invite.status == 'pending'" class="block px-2 py-1 rounded-md bg-yellow-500 text-white">
                                                Chờ xác nhận
                                            </span>
                                            <span v-if="invite.status == 'accepted'" class="block px-2 py-1 rounded-md bg-green-500 text-white">
                                                Đã chấp nhận
                                            </span>
                                            <span v-if="invite.status == 'rejected'" class="block px-2 py-1 rounded-md bg-red-500 text-white">
                                                Đã từ chối
                                            </span>
                                        </td>
                                        <td class="px-3 py-2">{{ dayjs(invite.created_at).format('DD/MM/YYYY HH:mm') }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="project" v-if="activeSetting == 'project'">
                    Project page
                </div>
            </div>
            <div v-else>
                <div class="loading">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { ref, watch } from 'vue';
import { useUserStore } from '@/store/user';
import { Button, Dialog, InputText, Message, RadioButton, useToast } from 'primevue';
import dayjs from 'dayjs';
import { toastService } from '@/assets/js/toastHelper';

//Store
const userStore = useUserStore();
const workspace = ref(userStore.workspace);

//Handle UI
const activeSetting = ref('space');
const isLoading = ref(false);
const toast = new toastService(useToast());
const isInviteMemberLoading = ref(false);
const openAddMemberDialog = ref(false);
const emailValid = ref(false);

//Data
const members = ref();
const newMemberEmail = ref('');
const role = ref('');

const inviteMembers = ref([]);

//Function Handle UI
function setActive(setting) {
    if (activeSetting.value === setting) return
    activeSetting.value = setting
    switch (setting) {
        case 'space':
            //call api
            break;
        case 'info':
            break;
        case 'email':
            break;
        case 'member':
            getMembers();
            break;
        case 'invite-member':
            getInviteMembers();
            break;
        case 'project':

            break;
        default:
            break;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//Function handle api
async function getMembers() {
    try {
        isLoading.value = true;
        const response = await api.get('/workspace/members', {
            params: {
                workspaceId: workspace.value.id
            }
        })

        const data = response.data;
        members.value = data.members;
    } catch (error) {
        console.log(error.message);
                
    } finally {
        isLoading.value = false;
    }
}

async function getInviteMembers() {
    try {
        isLoading.value = true;
        const response = await api.get('/workspace/invites/get', {
            params: {
                workspace_id: workspace.value.id
            }
        })

        const data = response.data;
        inviteMembers.value = data.invites;
        console.log(data);
    } catch (error) {
        console.log(error.message);
    } finally {
        isLoading.value = false;
    }
}

async function inviteMember() {
    if (!validateEmail(newMemberEmail.value)) {
        emailValid.value = true;
        return;
    }
    try {
        isInviteMemberLoading.value = true;
        const response = await api.post('/workspace/invite', {
            workspaceId: workspace.value.id,
            email: newMemberEmail.value,
            role: role.value
        });

        const data = response.data;
        console.log(data);

        toast.success('Thành viên đã được mời', 'Thành công');
        openAddMemberDialog.value = false;
        newMemberEmail.value = '';
        role.value = '';
    } catch (error) {
        console.log(error.message);
    } finally {
        isInviteMemberLoading.value = false;
    }
}

watch(newMemberEmail, (newVal) => {
    emailValid.value = false;
})

</script>