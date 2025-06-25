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
                <div class="member-list">
                    <template v-for="member in project.members" :key="member.id">
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
                </div>
                <Button label="Mời thành viên" variant="outlined" size="small" class="button"/>
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
import Sidebar from '@/components/common/Sidebar.vue';
import { Button, Tooltip, Skeleton } from 'primevue';
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const project_key = computed(() => route.params.project_key);

const project = ref({});

//UI
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


//
async function getProject() {
    try {
        const response = await api.get('project/detail', {
            params: {
                project_key: project_key.value
            }
        })

        project.value = response.data.project;
    } catch (error) {
        
    }
}

onMounted(() => {
    getProject();
})

watch(project_key, () => {
    getProject();
});
</script>