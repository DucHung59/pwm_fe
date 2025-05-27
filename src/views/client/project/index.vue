<template>
    <Sidebar :active="'home'" :project_key="project.project_key" />
    <div style="margin-left: 60px;">
        <div class="project-header flex items-center justify-between">
            <div class="project-name flex items-center gap-2">
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
    </div>
</template>
<script setup>
import api from '@/api/axios';
import Sidebar from '@/components/common/Sidebar.vue';
import { Button, Tooltip } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const project_key = route.params.project_key;

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
                project_key: project_key
            }
        })

        project.value = response.data.project;
    } catch (error) {
        
    }
}

onMounted(() => {
    getProject();
})
</script>