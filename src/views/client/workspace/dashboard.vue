<template>
    <div class="px-10 pt-8">
        <div class="flex justify-center items-center gap-4 pt-4 pb-10" v-if="userStore.role === 'manager' || userStore.isSystemAdmin">
            <img :src="'/app_icon.png'" alt="hehee" width="60px"/>
            <p class="text-[24px] font-semibold">{{ workspace.workspace_name }}</p>
            <RouterLink to="settings">
                <Button icon="pi pi-cog" rounded variant="outlined" severity="contrast"/>
            </RouterLink>
        </div>
        <div class="flex gap-8">
            <div>
                <div class="accordion mb-10">
                    <div class="accordion-title flex justify-between">
                        <div class="toggle flex items-center gap-1.5" @click="toggleOpen('prj')">
                            <i class="pi " :class="isPrjOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                            <p>Dự án</p>
                        </div>
                        <div>
                            <Button class="btn-add" size="small" icon="pi pi-plus" rounded variant="outlined" v-tooltip.top="'Thêm Project'" v-if="userStore.role === 'manager' || userStore.isSystemAdmin" v-show="isPrjOpen" @click="addProjectDialog = true"/>
                            <Dialog v-model:visible="addProjectDialog" :style="{width: '50vw'}" @hide="onDialogHide" header="Thêm Dự án mới" :draggable="false" maximizable="true" :modal="true">
                                <div class="flex flex-col gap-2 pt-4">
                                    <label for="project-name" class="pl-4">Tên dự án</label>
                                    <InputText id="project-name" v-model="project_name" aria-describedby="project-name-help" />
                                    <Message severity="error" class="pl-4 italic" size="small" variant="simple" v-if="project_name_error">Tên dự án không được để trống</Message>
                                </div>
                                <div class="flex flex-col gap-2 pt-4">  
                                    <label for="project-key" class="pl-4">Khóa dự án</label>
                                    <InputText id="project-key" v-model="project_key" aria-describedby="project-key-help" @input="toUppercase"/>
                                    <Message :severity="project_key_error ? 'error' : 'secondary'" class="pl-4 italic" size="small" variant="simple">Khóa dự án không được để trống, chỉ bao gồm các chữ cái in hoa, số và gạch dưới</Message>
                                </div>
                                <div class="flex justify-around mt-4 pt-4">
                                    <Button label="Hủy" class="w-75" severity="secondary" size="small" variant="outlined" @click="addProjectDialog = false"/>
                                    <Button label="Thêm" class="w-75" size="small" variant="outlined" @click="addProject" :loading="isAddProjectLoading" loadingIcon="pi pi-spin pi-spinner"/>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                    <div class="accordion-content" v-show="isPrjOpen">
                        <template v-for="project in projects" :key="project.id">
                            <div class="accordion-item">
                                <RouterLink class="relative group w-max" :to="`project/${project.project_key}`">
                                    <div class="project-item gap-2 flex">
                                        <img :src="'/project.png'" width="40px"/>
                                        <div>
                                            <p>{{ project.project_name }}</p>
                                            <p class="text-[12px] project-key absolute group-hover:hidden" style="color: var(--color-gray-500);">
                                                {{ project.project_key }}
                                            </p>
                                            <div class="text-[12px] list-action hidden group-hover:block">
                                                <ul class="flex gap-2">
                                                    <li>
                                                        <RouterLink :to="'/workspace/add/' + project.project_key">
                                                            Thêm Task
                                                        </RouterLink>
                                                    </li>
                                                    <li>
                                                        <RouterLink :to="'/workspace/task/' + project.project_key">
                                                            Tasks
                                                        </RouterLink>
                                                    </li>
                                                    <li>
                                                        <RouterLink :to="'/workspace/settings/' + project.project_key">
                                                            Cài đặt
                                                        </RouterLink>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </RouterLink>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="accordion mb-10">
                    <div class="accordion-title" >
                        <div class="toggle flex items-center gap-1.5" @click="toggleOpen('issue')">
                            <i class="pi " :class="isIssueOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                            <p>Issues</p>
                        </div>
                    </div>
                    <div class="accordion-content" v-show="isIssueOpen">
                        <div class="filter-issue p-4">
                            <div class="flex items-center gap-2">
                                <label for="">Filter:</label>
                                <SelectButton v-model="meFilter" :options="me" optionLabel="label" optionValue="value" @change="onTaskFilterChange"/>
                            </div>
                        </div>
                        <div class="issue-item">
                            <table class="w-full text-sm tr-border">
                                <thead>
                                    <tr>
                                        <th class="px-3 py-2 border">Key</th>
                                        <th class="px-3 py-2 border">Tiêu đề</th>
                                        <th class="px-3 py-2 border">Trạng thái</th>
                                        <th class="px-3 py-2 border">Ngày hạn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="isTasksLoading">
                                        <tr class="">
                                            <td class="py-3 px-2" colspan="4">
                                                <Skeleton class="mb-2"></Skeleton>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <template v-if="tasks.length <= 0">
                                            <tr class="cursor-default hover:bg-cyan-100">
                                                <td colspan="4" class="text-center py-3">Không có task được hiển thị</td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <template v-for="task in tasks">
                                                <tr class="cursor-default hover:bg-cyan-100">
                                                        
                                                            <td class="text-center py-3">
                                                                <RouterLink :to="'/workspace/view/' + task.task_key">
                                                                    {{ task.task_key }}
                                                                </RouterLink>
                                                            </td>
                                                            <td class="text-center py-3">
                                                                <RouterLink :to="'/workspace/view/' + task.task_key">
                                                                    {{ task.subject }}
                                                                </RouterLink>
                                                            </td>
                                                            <td class="text-center py-3">
                                                                <span class="px-4 py-1 text-white font-medium rounded-full" 
                                                                    :style="{ backgroundColor: task.status_info.status_color }">
                                                                    {{task.status_info.status_type}}
                                                                </span>
                                                            </td>
                                                            <td class="text-center py-3">{{ task.due_date ? task.due_date : 'Không có' }}</td>
                                                    </tr>
                                            </template>
                                        </template>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="accordion">
                    <div class="accordion-title flex justify-between" >
                        <div class="toggle flex items-center gap-1.5" @click="toggleOpen('recent')">
                            <i class="pi " :class="isRecentOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                            <p>Gần đây</p>
                        </div>
                        <div>
                            <span>Lọc</span>
                        </div>
                    </div>
                    <div class="accordion-content" v-show="isRecentOpen">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/axios';
import { toastService } from '@/assets/js/toastHelper';
import { useUserStore } from '@/store/user';
import { Button, Dialog, InputText, Message, SelectButton, useToast, Skeleton } from 'primevue';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();
const workspace = ref(userStore.workspace);
const toast = new toastService(useToast());

const isPrjOpen = ref(true);
const isIssueOpen = ref(true);
const isRecentOpen = ref(true);
const addProjectDialog = ref(false);

//data project
const project_name = ref('');
const project_key = ref('');
const project_name_error = ref(false);
const project_key_error = ref(false);

const projects = ref([]);
const meFilter = ref("AssignTo");

//data task
const tasks = ref({});

//Paginate
const perPage = 10;
const total = ref(0);
const currentPage = ref(1);

//handle UI
const isAddProjectLoading = ref(false);
const isTasksLoading = ref(false)
const me = [
    { label: "Dành cho tôi", value: "AssignTo"},
    { label: "Tạo bởi tôi", value: "CreatedBy" }
]

function toUppercase(e) {
  project_key.value = e.target.value.toUpperCase()
}

function checkValidated() {
    const project_key_regex = /^[A-Z0-9_]+$/;

    let isValid = true;

    if(!project_key_regex.test(project_key.value)) {
        project_key_error.value = true;
        isValid = false;
    }
    if(project_name.value.length === 0) {
        project_name_error.value = true;
        isValid = false;
    }
    return isValid;
}

function onDialogHide() {
  project_key.value = '';
  project_name.value = '';
  // reset các biến khác nếu có
}

function toggleOpen(cate) {
    if(cate === 'prj') isPrjOpen.value = !isPrjOpen.value;
    else if(cate === 'issue') isIssueOpen.value = !isIssueOpen.value;
    else if (cate === 'recent') isRecentOpen.value = !isRecentOpen.value;
}

function onTaskFilterChange() {
    if(meFilter.value == 'AssignTo') {
        getTasksByAssginee();
    } else if (meFilter.value == 'CreatedBy') {
        getTasksByCreator();
    }
}

//add project
async function addProject() {
    if(!checkValidated()) return;
    try {
        isAddProjectLoading.value = true;
        const response = await api.post('/project/create', {
            workspace_id: workspace.value.id,
            project_name: project_name.value,
            project_key: project_key.value,
        })

        console.log(response);
        toast.success('Thêm dự án thành công');
        addProjectDialog.value = false;
        getProject();
    } catch (error) {
        console.log(error);
        toast.error('Thêm dự án thất bại');
    } finally {
        isAddProjectLoading.value = false;
    }
}

async function getProject() {
    try {
        const response = await api.get('/project/get');
    
        projects.value = response.data.projects;
        console.log(projects.value);
        
    } catch (error) {
        console.log(error);
    }
}

async function getTasksByAssginee() {
    try {
        isTasksLoading.value = true;
        const response = await api.get('task/getByAssignee')

        const result = response.data;
        if(result.success) {
            tasks.value = result.task.data;
            total.value - result.total;
            currentPage.value = result.current_page;
            console.log(tasks.value);
        }
        
    } catch (error) {
        console.log(error.message);
    } finally {
        isTasksLoading.value = false;
    }
}


async function getTasksByCreator() {
    try {
        isTasksLoading.value = true;
        const response = await api.get('task/getByCreator')

        const result = response.data;
        if(result.success) {
            tasks.value = result.task.data;
            total.value - result.total;
            currentPage.value = result.current_page;
            console.log(tasks.value);
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        isTasksLoading.value = false;
    }
}

onMounted(() => {
    getProject();
    getTasksByAssginee();
})

watch(project_key, (newVal) => {
    project_key_error.value = false;
})

watch(project_name, (newVal) => {
    project_name_error.value = false;
})

</script>