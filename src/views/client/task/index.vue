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
        <div class="mx-16 mt-8 mb-24 cursor-default">
            <template v-if="task.id">
                <div class="flex justify-between items-center">
                    <div class="flex justify-between items-center gap-2">
                        <p>
                            <span class="px-4 py-1 text-white font-medium rounded-full" 
                                :style="{ backgroundColor: task.issue_type.issue_color }">
                                {{task.issue_type.issue_type}}
                            </span>
                        </p>
                        <span class="text-lg font-medium">-</span>
                        <p class="text-lg font-medium">{{ project_key }}</p>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <p>
                            <span class="px-4 py-1 text-white font-medium rounded-full" 
                                :style="{ backgroundColor: task.status_info.status_color }">
                                {{task.status_info.status_type}}
                            </span>
                        </p>
                    </div>
                </div>
                <div class="my-5">
                    <p class="text-2xl font-medium">{{ task.subject }}</p>
                    <div class="border-1 border-gray-400 p-4 rounded-md my-4">
                        <div class="flex gap-2">
                            <button
                                class="w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                                :style="{ backgroundColor: stringToColor(task.creator.username) }"
                                v-tooltip.bottom="task.creator.username"
                            >
                                {{ getInitial(task.creator.username) }}
                            </button>
                            <div class="flex flex-col gap-1.5">
                                <span class="text-sm font-medium">{{ task.creator.username }}</span>
                                <span class="text-sm text-gray-500 font-medium">Tạo lúc: {{ dayjs(task.created_at).format('DD/MM/YYYY HH:mm') }}</span>
                            </div>
                        </div>
                        <div class="p-4 my-4 border-b border-gray-400">
                            <span v-html="task.description"></span>
                        </div>
                        <div class="grid grid-cols-2 gap-8">
                            <div class="grid grid-cols-[12rem_1fr] items-center gap-2 border-b border-gray-400 p-2">
                                <span>Hạn chót:</span>
                                <p>{{ task.due_date ? dayjs(task.due_date).format('DD/MM/YYYY') : "Không có" }}
                                    <FlameIcon v-if="task.due_date && dayjs(task.due_date).isBefore(dayjs(), 'day')"/>
                                </p>
                            </div>
                            <div class="grid grid-cols-[12rem_1fr] items-center gap-2 border-b border-gray-400 p-2">
                                <span>Người được giao: </span>
                                <div class="flex items-center gap-2">
                                    <button
                                        class="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                                        :style="{ backgroundColor: stringToColor(task.assignee_user.username) }"
                                        v-tooltip.bottom="task.assignee_user.username"
                                        >
                                        {{ getInitial(task.assignee_user.username) }}
                                    </button>
                                    <span>{{ task.assignee_user.username }}</span>  
                                </div>
                            </div>
                            <div class="grid grid-cols-[12rem_1fr] items-center gap-2 border-b border-gray-400 p-2">
                                <span>Mức độ ưu tiên:</span>
                                <p>
                                    {{ task.priority == 'low' ? 'Thấp' : task.priority == 'normal' ? 'Bình thường' : 'Cao' }}
                                    <i class="pi" :class="task.priority == 'low' ? 'pi-arrow-down text-emerald-400' : task.priority == 'normal' ? 'pi-arrow-right text-cyan-400' : 'pi-arrow-up text-red-400'"></i>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="text-lg font-medium">Bình luận <span class="text-sm font-medium text-gray-500">({{ comments.length }})</span></p>
                    <div class="border-1 border-gray-400 p-4 rounded-md my-4">
                        <template v-for="comment in comments">
                            <div class="border-b border-gray-400 p-4">
                                <div class="flex gap-2">
                                    <button
                                        class="w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-semibold uppercase"
                                        :style="{ backgroundColor: stringToColor(comment.creator.username) }"
                                        v-tooltip.bottom="comment.creator.username"
                                    >
                                        {{ getInitial(comment.creator.username) }}
                                    </button>
                                    <div class="flex flex-col gap-1.5">
                                        <span class="text-sm font-medium">{{ comment.creator.username }}</span>
                                        <span class="text-sm text-gray-500 font-medium">Thêm lúc: {{ dayjs(comment.created_at).format('DD/MM/YYYY HH:mm') }}</span>
                                    </div>
                                </div>
                                <div class="p-4">
                                    <span v-html="comment.comment"></span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
        <div class="p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] left-[60px] fixed bottom-0 right-0 bg-white">
            <!-- Trạng thái gọn -->
            <div
                v-if="!expanded"
                class="flex items-center gap-2 cursor-pointer"
                @click="expand"
            >
                <input
                    type="text"
                    readonly
                    class="flex-1 border border-gray-400 rounded px-3 py-2 text-sm text-gray-500 cursor-text"
                    placeholder="Write a comment..."
                />
                <div class="border-l h-6 mx-2"></div>
                <Button label="Đổi trạng thái" icon="pi pi-pencil" rounded variant="outlined"/>
            </div>

            <!-- Trạng thái mở rộng -->
            <transition name="fade">
            <div v-show="expanded" class="space-y-3">
                <!-- Comment box -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div class="md:col-span-2">
                        <Editor v-model="comment" editorStyle="height: 200px" style="width: 100%"/>
                    </div>
                    <div class="md:col-span-1">
                        <div class="grid grid-cols-[8rem_1fr] my-4 gap-2 items-center">
                            <span>Trạng thái:</span>
                            <Select v-model="selectedStatus" :options="statuses" optionLabel="status_type" optionValue="id" placeholder="Chọn trạng thái" class="w-full md:w-56"/>
                        </div>
                        <div class="grid grid-cols-[8rem_1fr] my-4 gap-2 items-center">
                            <span>Chuyển tới:</span>
                            <Select v-model="assignee" :options="members" optionLabel="user.username" optionValue="user.id" placeholder="Chọn " class="w-full md:w-56" />
                        </div>
                        <div class="grid grid-cols-[8rem_1fr] my-4 gap-2 items-center">
                            <span>Hạn chót:</span>
                            <DatePicker v-model="due_date" placeholder="Chọn hạn chót" showIcon  dateFormat="dd/mm/yy" class="w-full md:w-56" />
                        </div>
                    </div>
                </div>
                <!-- Action buttons -->
                <div class="flex justify-center gap-2">
                    <Button @click="collapse" rounded label="Đóng" icon="pi pi-times" variant="outlined"/>
                    <Button @click="addComment" rounded label="Gửi" :loading="isAddCommentLoading" loadingIcon="pi pi-spin pi-spinner" icon="pi pi-send" />
                </div>
            </div>
            </transition>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
<script setup>
import api from '@/api/axios';
import Sidebar from '@/components/common/Sidebar.vue';
import FlameIcon from '@/components/icons/FlameIcon.vue';
import dayjs from 'dayjs';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Select, DatePicker, useToast } from 'primevue';
import Editor from 'primevue/editor';
import { toastService } from '@/assets/js/toastHelper';

const route = useRoute();
const task_key = computed(() => route.params.task_key);
const project_key = computed(() => {
  const key = task_key.value;
  return key.substring(0, key.lastIndexOf('-'));
});


const project = ref({});
const statuses = ref([]);
const issues = ref([]);
const members = ref([]);

const task = ref([]);
const comments = ref({});

const selectedStatus = ref(null);
const assignee = ref();
const due_date = ref();
const comment = ref(null);

const toast = new toastService(useToast());
const isTaskLoading = ref(false);
const isAddCommentLoading = ref(false);
const expanded = ref(false);

//UI function
const expand = () => {
  expanded.value = true;
};

const collapse = () => {
  expanded.value = false;
  comment.value = '';
};

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
        members.value = response.data.project.members;
    } catch (error) {
        console.log('Có lỗi xảy ra: ' + error.message);
    }
}

async function getTask() {
    try {
        isTaskLoading.value = true;
        const response = await api.get('/task/detail', {
            params: {
                task_key: task_key.value
            }
        })

        const result = response.data;
        task.value = result.task;
        comments.value = result.comments.data;
        selectedStatus.value = task.value.status;
        assignee.value = task.value.assignee;
        due_date.value = task.value.due_date;
        
    } catch (error) {
        console.log(error.message);
    } finally {
        isTaskLoading.value = false;
    }
}

async function addComment() {
    const date = due_date.value ? dayjs(due_date.value).format('DD-MM-YYYY HH:mm:ss') : null;
    try {
        isAddCommentLoading.value = true
        console.log(
            `id: ${task.value.id} \n
            comment: ${comment.value} \n
            status: ${selectedStatus.value} \n
            asignee: ${assignee.value} \n
            due_date: ${date}
            ` 
        );
        
        const response = await api.post('task/addComment', {
            id: task.value.id,
            comment: comment.value,
            status: selectedStatus.value,
            assignee: assignee.value,
            due_date: date,
        })

        const result = response.data;
        if(result.success) {
            toast.success('Thêm bình luận thành công', 'Thông báo');
            getTask();
            collapse();
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        isAddCommentLoading.value = false
    }
}

onMounted(() => {
    getProject();
    getTask();
})

watch(project_key, () => {
    getProject();
});
</script>