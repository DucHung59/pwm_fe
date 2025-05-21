<template>
    <div class="header px-4 py-2 flex items-center justify-between gap-4">
        <div class="left-header flex items-center gap-4">
            <img src="https://placehold.co/400x400" alt="" width="40px">
            <div class="navbar">
                <ul class="flex gap-2">
                    <li>
                        <Button class="button" variant="text">
                            <RouterLink to="dashboard">Dashboard</RouterLink>
                        </Button>
                    </li>
                    <li>
                        <Button class="button btn-project-list" variant="text" label="Project" @click="toggleProject"/>
                        <ul class="action-container" :class="{active : isProject}">
                            <div class="search-project flex items-center gap-2">
                                <IconField>
                                    <InputIcon class="pi pi-search" />
                                    <InputText v-model="searchPrj" placeholder="Search" />
                                </IconField>
                                <div>
                                    <Button icon="pi pi-eraser" rounded variant="outlined" size="small" @click="searchPrj = ''"/>
                                </div>
                            </div>
                            <li class="action-item">
                                <RouterLink to="project">
                                    <div class="flex items-center gap-2">
                                        <div>Granduation Project </div>
                                        <p class="text-[12px]">(GRANDUATION KEY)</p>
                                    </div>
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-header">
            <ul class="flex gap-2">
                <li>
                    <Button class="icon-button btn-user-action" icon="pi pi-ellipsis-h" variant="text" rounded @click="toggleWorkspaceAction"/>
                    <ul class="action-container " :class="{active : isUserAction}">
                        <li class="action-item">
                            <RouterLink to="members">
                                Members
                            </RouterLink>
                        </li>
                        <li class="action-item">
                            <RouterLink>
                                Issues
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <Button class="icon-button" icon="pi pi-bell" variant="text" rounded/>
                </li>
                <li class="flex items-center">
                    <div v-if="!userStore.isLoading">
                        <Button class="icon-button btn-user-profile" :label="userStore.user.username" icon="pi pi-user" variant="text" @click="toggleUserAction"/>
                        <ul class="action-container " :class="{active : isUserProfile}">
                            <li class="action-item has-paragraph"><p class="text-[12px]">Hello, {{userStore.user.username}}</p></li>
                            <li class="action-item">
                                <RouterLink>    
                                    Hoạt động
                                </RouterLink>
                            </li> 
                            <li class="action-item">
                                <RouterLink to="/profile">
                                    Thông tin cá nhân
                                </RouterLink>
                            </li>
                            <li class="action-item specials" v-if="userStore.role == 'admin'">
                                <RouterLink to="settings">
                                    Không gian làm việc
                                </RouterLink>
                            </li>
                            <li class="action-item specials">
                                <a href="#" @click.prevent="signout">
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem"></i>
                    </div>
                </li>
                <li>
                    <div class="workspace flex gap-4">
                        <button class="flex items-center gap-2">
                            <img src="https://placehold.co/400x400" alt="" width="40px">
                            <p style="color: var(--color-gray-500);">{{ userStore.workspace.workspace_name }}</p> 
                        </button>
                        <Configurator/>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { Button, IconField, InputIcon, InputText } from 'primevue';
import { ref, onMounted } from 'vue';
import Configurator from '../common/Configurator.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const router = useRouter();

const isUserAction = ref(false);
const isUserProfile = ref(false);
const isProject = ref(false);
const searchPrj = ref('');

function toggleWorkspaceAction() {
    isUserAction.value = !isUserAction.value;
}
function toggleUserAction() {
    isUserProfile.value = !isUserProfile.value;
}
function toggleProject() {
    isProject.value = !isProject.value;
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.btn-user-action')) {
    isUserAction.value = false
  }
  if (!e.target.closest('.btn-user-profile')) {
    isUserProfile.value = false
  }
  if (
    !e.target.closest('.btn-project-list') &&
    !e.target.closest('.search-project')
  ) {
    isProject.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

async function signout() {
    try {
        userStore.logout();
        router.push('/'); // Chuyển hướng về trang đăng nhập
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

</script>