<template>
    <Sidebar :active="'home'" :project_key="project.project_key" />
    <div style="margin-left: 60px;">
        <div class="project-header flex items-center justify-between">
            <div class="flex items-center gap-2" v-if="!project.project_name">
                <Skeleton class="mb-2"></Skeleton>
            </div>
            <div class="project-name flex items-center gap-2" v-else>
                <p>{{ project.project_name }}</p>
                <p class="text-[14px]">({{ project.project_key }})</p>
            </div>
            <div class="project-member flex items-center gap-2">
                <div class="member-list flex gap-0.5">
                    <template v-for="(member, index) in project.members" :key="member.id">
                        <template v-if="index < 3">
                            <div class="member-item">
                                <button
                                    class="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                                    :style="{ backgroundColor: stringToColor(member.user.username) }"
                                    v-tooltip.bottom="member.user.username"
                                >
                                    {{ getInitial(member.user.username) }}
                                </button>
                            </div>
                        </template>
                    </template>
                    <div>
                        <Button
                            class="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                            rounded
                            size="small"
                            icon="pi pi-ellipsis-h"
                            v-tooltip.bottom="'Tất cả'"
                        />
                    </div>
                </div>
                <template v-if="userStore.role == 'manager' || userStore.isSystemAdmin">
                    <Button label="Thêm thành viên" variant="outlined" size="small" class="button" @click="openAddMemberDialog"/>
                    <Dialog v-model:visible="addMemberDialog" modal header="Thêm thành viên" :draggable="false" :style="{ width: '25rem' }">
                        <div v-if="isLoadingWorkspaceMember">
                            <Skeleton width="22rem" class="mb-2"></Skeleton>
                        </div>
                        <div v-else>
                            <div class="flex gap-2">
                                <IconField>
                                    <InputIcon class="pi pi-search"/>
                                    <InputText v-model="searchMember" placeholder="Search" :style="{ width: '19rem' }"/>
                                </IconField>
                                <Button icon="pi pi-eraser" @click="searchMember = ''"/>
                            </div>
                            <template v-for="(member, index) in workspaceMember">
                                <div class="flex items-center m-4 justify-between">
                                    <button
                                        class="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                                        :style="{ backgroundColor: stringToColor(member.user.username) }"
                                        v-tooltip.bottom="member.user.username"
                                    >
                                        {{ getInitial(member.user.username) }}
                                    </button>
                                    <div class="flex items-center gap-2">
                                        {{ member.user.username }}
                                        <span class="text-sm">({{ member.role }})</span>
                                    </div>
                                    <Button icon="pi pi-plus" rounded size="small" v-if="!isMemberInProject(member.user.id)" @click="addProjectMember(member.user.id, member.role)"/>
                                    <Button v-else icon="pi pi-check" rounded size="small" disabled/>
                                </div>
                            </template>
                            <Paginator
                                :rows="perPage"
                                :totalRecords="total"
                                :first="(currentPage - 1) * perPage"
                                @page="(event) => onPageChange(event)"
                            />
                        </div>
                    </Dialog>
                </template>
            </div>
        </div>
        <div class="project-content m-8 flex gap-8">
            <div class="project-main w-full border-2 border-gray-200 rounded-md p-4">
                <p>Bảng công việc chính</p>
            </div>
            <div class="project-sidebar w-1/2 border-2 border-gray-200 rounded-md p-4">
                <div class="project-sidebar-item">
                    <p>Bảng trạng thái</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { toastService } from '@/assets/js/toastHelper';
import Sidebar from '@/components/common/Sidebar.vue';
import { useUserStore } from '@/store/user';
import { Button, Tooltip, Skeleton, Dialog, InputText, IconField, InputIcon, useToast, Paginator } from 'primevue';
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const project_key = computed(() => route.params.project_key);

const toast = new toastService(useToast());
const userStore = useUserStore()

const workspace = userStore.workspace;

const project = ref({});
const workspaceMember = ref([]);
const isLoadingWorkspaceMember = ref(false);
const searchMember = ref('');
const addMemberDialog = ref(false);
const total = ref();
const currentPage = ref(1);
const perPage = 10;

//UI
function onPageChange(event) {
    const page = event.page + 1;
    getWorkspaceMembers(page);
}

function getInitial(name) {
  return name
    ?.trim()
    .split(' ')
    .filter(n => n)
    .map(w => w.charAt(0).toUpperCase())
    .slice(0, 1)
    .join('') || '?'
}

function stringToColor(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += ('00' + value.toString(16)).slice(-2)
    }
    return color
}

function isMemberInProject(userId) {
    return project.value.members.some(pm => pm.user_id === userId);
}

function openAddMemberDialog() {
    getWorkspaceMembers();
    addMemberDialog.value = true;
}
 
//api
async function getProject() {
    try {
        const response = await api.get('project/detail', {
            params: {
                project_key: project_key.value
            }
        })

        project.value = response.data.project;
    } catch (error) {
        console.log('Có lỗi xảy ra: ' + error.message);
        
    }
}

async function getWorkspaceMembers(page = 1) {
    try {
        isLoadingWorkspaceMember.value = true;
        const response = await api.get('/workspace/members', {
            params: {
                workspaceId: workspace.id,
                page: page
            }
        })

        const data = response.data;
        workspaceMember.value = data.members.data;
        total.value = data.members.total;
        currentPage.value = data.members.current_page;
        console.log(data);
        
    } catch (error) {
        console.log(error.message);
    } finally {
        isLoadingWorkspaceMember.value = false;
    }
}

async function addProjectMember(userId, userRole) {
    try {
        const role = userRole == 'manager' ? 'PM' : userRole;
        console.log(role);
        const response = await api.post('/project/addMember', {
            project_key: project_key.value,
            user_id : userId,
            role : role,
        })

        const data = response.data;
        console.log(data);
        if (data.success) {
            toast.success('Thêm thành viên thành công', 'Thành công');
            getWorkspaceMembers();
            getProject();
        } else {
            toast.error('Thêm thành viên không thành công', 'Lỗi');
        }
    } catch (error) {
        console.log(error.message);
    }
}

onMounted(() => {
    getProject();
})

watch(project_key, () => {
    getProject();
});

</script>