<template>
    <Sidebar :active="'add'" :project_key="project.project_key" />
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
        <div class="m-16">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-2xl font-semibold">Thêm Issue</p>
                </div>
                <div>
                    <Button label="Thêm Issue" />
                </div>
            </div>
            <div class="mt-4">
                <div class="flex flex-col gap-2">
                    <div>
                        <Select v-model="selectedIssue" :options="issues" optionLabel="issue_type" optionValue="issue_type" placeholder="Chọn kiểu issue" class="w-full md:w-56" />
                    </div>
                    <InputText v-model="issue_name" placeholder="Tên issue (bắt buộc)" class="w-full" />
                </div>
                <div class="mt-4 border border-gray-300 rounded-md p-4">
                    <div class="flex flex-col gap-2 my-4">
                        <Editor v-model="description" editorStyle="height: 320px" />
                    </div>
                    <div class="grid grid-cols-2 gap-8">
                        <div class="flex items-center justify-around gap-2 border-b border-gray-400 p-4">
                            <p>Trạng thái</p>
                            <Select v-model="status" :options="statuses" optionLabel="status_name" placeholder="Chọn trạng thái" class="w-full md:w-56" />
                        </div>
                        <div class="flex items-center justify-around gap-2 border-b border-gray-400 p-4">
                            <p>Assignee</p>
                            <Select v-model="assignee" :options="members.user" optionLabel="name" placeholder="Chọn assignee" class="w-full md:w-56" />
                        </div>
                        <div class="flex items-center justify-around gap-2 border-b border-gray-400 p-4">
                            <p>Hạn chót</p>
                            <DatePicker v-model="due_date" placeholder="Chọn hạn chót" showIcon  dateFormat="dd/mm/yy" class="w-full md:w-56" />
                        </div>
                    </div>
                </div>
                <div class="my-4">
                    <InputText v-model="notify_to" placeholder="Thông báo tới" class="w-full" />
                </div>
                <div class="flex justify-end">
                    <Button label="Thêm Issue" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import Sidebar from '@/components/common/Sidebar.vue';
import { Button, Select, InputText, DatePicker } from 'primevue';
import Editor from 'primevue/editor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const project_key = computed(() => route.params.project_key);

const project = ref({});
const issues = ref([]);
const status = ref(null);
const assignee = ref(null);
const due_date = ref(null);
const notify_to = ref(null);

const statuses = ref([
    {
        status_name: 'Open',
        status_color: '#FF0000'
    },
    {
        status_name: 'Progress',
        status_color: '#00FF00'
    },
    {
        status_name: 'Review',
        status_color: '#0000FF'
    },
    {
        status_name: 'Resolved',
        status_color: '#0000FF'
    },
    {
        status_name: 'Closed',
        status_color: '#000000'
    }
]);
const members = ref([]);
const selectedIssue = ref(null);
const description = ref('');

async function getProject() {
    try {
        const response = await api.get('project/detail', {
            params: {
                project_key: project_key.value
            }
        })

        project.value = response.data.project;
        issues.value = response.data.issues;
        members.value = response.data.project.members;
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