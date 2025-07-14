<template>
    <Sidebar :active="'tasks'" :project_key="project.project_key" />
    <div style="margin-left: 60px;">
        <div class="project-header flex items-center justify-between">
            <div class="flex items-center gap-2" v-if="!project.project_name">
                <Skeleton class="w-10 h-10 rounded-full" />
            </div>
            <div class="project-name flex items-center gap-2" v-else>
                <p>{{ project.project_name }}</p>
                <p class="text-[14px]">({{ project.project_key }})</p>
            </div>
        </div>
        <div class="mt-4">
            <div class="my-4 p-4">
                <label class="font-medium text-2xl">Tìm kiếm</label>
                <div class="flex items-center gap-2 m-4">
                    <label class="font-medium" for="selectStatus">Trạng thái:</label>
                    <SelectButton id="selectStatus" v-model="statusFilter" :options="statuses" optionLabel="status_type" optionValue="id" @change="onStatusChange" />
                </div>
                <div class="m-4 flex items-center justify-between">
                    <div class="m-4 flex items-center gap-2">
                        <div class="flex flex-col gap-1 mx-4">
                            <label for="" class="font-medium">Danh mục</label>
                            <Select v-model="categoryFilter" :options="issues" optionLabel="issue_type" optionValue="id" class="w-40" />
                        </div>
                        <div class="flex flex-col gap-1 mx-4">
                            <label for="" class="font-medium">Assignee</label>
                            <Select v-model="assigneeFilter" :options="project.members" optionLabel="user.username" optionValue="user.id" class="w-40" />
                        </div>
                        <div class="flex flex-col gap-1 mx-4">
                            <label for="" class="font-medium">Từ khóa</label>
                            <InputText type="text" v-model="keyword" class="w-60" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <Button icon="pi pi-filter-slash" label="Đặt lại" size="small" @click="clearFilter"/>
                        <Button icon="pi pi-search" label="Tìm kiếm" size="small"/>
                    </div>
                </div>
            </div>
            <div class="my-4 p-4">
                <div>
                    <table class="w-full text-sm tr-border">
                        <thead>
                            <tr>
                                <th class="px-3 py-2 border">Danh mục</th>
                                <th class="px-3 py-2 border">Key</th>
                                <th class="px-3 py-2 border">Tiêu đề</th>
                                <th class="px-3 py-2 border">Trạng thái</th>
                                <th class="px-3 py-2 border">Ngày hạn</th>
                                <th class="px-3 py-2 border">Ngày tạo</th>
                                <th class="px-3 py-2 border">Người tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <Paginator/>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import Sidebar from '@/components/common/Sidebar.vue';
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Paginator, SelectButton, Select, Button, InputText  } from 'primevue';


const route = useRoute();
const project_key = computed(() => route.params.project_key);

const project = ref({});
const statuses = ref({});
const issues = ref({});

const statusFilter = ref();
const categoryFilter = ref();
const assigneeFilter = ref();
const keyword = ref();
function onStatusChange() {
    
}

function clearFilter() {
    statusFilter.value = null;
    categoryFilter.value = null;
    assigneeFilter.value = null;
    keyword.value = null;
}

async function getProject() {
    try {
        const response = await api.get('project/detail', {
            params: {
                project_key: project_key.value
            }
        })

        project.value = response.data.project;
        statuses.value = response.data.statuses;
        issues.value = response.data.issues;
    } catch (error) {
        console.log('Có lỗi xảy ra: ' + error.message);
    }
}

onMounted(() => {
    getProject();
})

watch(project_key, () => {
    getProject();
});
</script>