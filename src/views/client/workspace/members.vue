<template>
    <div class="flex flex-col items-center pt-8">
        <div class="flex flex-col items-center">
            <img :src="'/app_icon.png'" alt="logo" width="80px">
            <p class="text-[24px] font-semibold pt-4">Thành viên của {{ workspace.workspace_name }}</p>
        </div>
        <div class="grid grid-cols-6 gap-4 mt-12" v-if="!isLoading">
            <template v-for="member in members" :key="member.userId">
                <div class="user-items group">
                    <div class="flex flex-col items-center p-4">
                        <i class="pi pi-user" style="font-size: 40px;"></i>
                        <div class="text-center mt-4">
                            <p>{{ member.user.username }}</p>
                            <div class="relative w-max">
                                <div class="group-hover:hidden">
                                    <p class="text-[14px] font-light">({{ member.role }})</p>
                                    <p class="text-sm text-center break-all max-w-[180px]" :title="member.user.email">
                                        {{ member.user.email.split('@')[0] }}
                                    </p>
                                </div>
                                <RouterLink :to="`/workspace/activity/${member.user.id}/${member.user.username}`">
                                    <div class="activity-link px-8 py-2 hidden group-hover:block">
                                        Hoạt động
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="mt-12" v-else>
            <i class="pi pi-spin pi-spinner-dotted" style="font-size: 30px;"></i>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { toastService } from '@/assets/js/toastHelper';
import { useUserStore } from '@/store/user';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const toast = new toastService(useToast())
const workspace = ref(userStore.workspace);

const isLoading = ref(false)
const members = ref();

async function getAllMembers() {
    try {
        isLoading.value = true;
        const res = await api(`/workspace/members`, {
            params: {
                workspaceId: workspace.value.id
            }
        })

        const data = res.data;
        members.value = data.members.data;
    } catch (error) {
        toast.error(error.message, "Lỗi");
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getAllMembers();
})
</script>