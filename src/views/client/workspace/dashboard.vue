<template>
    <div class="px-10 pt-8">
        <div class="flex justify-center items-center gap-4 pt-4 pb-10" v-if="userStore.role === 'admin'">
            <img src="https://placehold.co/400x400" alt="hehee" width="60px"/>
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
                            <p>Project</p>
                        </div>
                        <div>
                            <Button class="btn-add" size="small" icon="pi pi-plus" rounded variant="outlined" v-tooltip.top="'Thêm Project'" v-show="isPrjOpen"/>
                        </div>
                    </div>
                    <div class="accordion-content" v-show="isPrjOpen">
                        <div class="accordion-item">
                            <RouterLink class="relative group w-max">
                                <div class="project-item gap-2 flex">
                                    <img src="https://placehold.co/400x400" width="40px"/>
                                    <div>
                                        <p>Graduation Project</p>
                                        <p class="text-[12px] project-key absolute group-hover:hidden" style="color: var(--color-gray-500);">GRADUATION</p>
                                        <div class="text-[12px] list-action hidden group-hover:block">
                                            <ul class="flex gap-2">
                                                <li>Thêm Issue</li>
                                                <li>Issues</li>
                                                <li>Cài đặt</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </RouterLink>
                        </div>
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
                                <Button class="btn-filter button" size="small" variant="outlined" label="Assignee cho tôi"/>
                                <Button class="btn-filter button" size="small" variant="outlined" label="Tạo bởi tôi"/>
                            </div>
                        </div>
                        <div class="issue-item">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th class="px-3 py-2 border">Key</th>
                                        <th class="px-3 py-2 border">Subject</th>
                                        <th class="px-3 py-2 border">Status</th>
                                        <th class="px-3 py-2 border">Due</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="accordion">
                    <div class="accordion-title" >
                        <div class="toggle flex items-center gap-1.5" @click="toggleOpen('recent')">
                            <i class="pi " :class="isRecentOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                            <p>Gần đây</p>
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
import { useUserStore } from '@/store/user';
import { Button } from 'primevue';
import { ref } from 'vue';

//data
const userStore = useUserStore();
const workspace = ref(userStore.workspace);

const isPrjOpen = ref(true);
const isIssueOpen = ref(true);
const isRecentOpen = ref(true);


function toggleOpen(cate) {
    if(cate === 'prj') isPrjOpen.value = !isPrjOpen.value;
    else if(cate === 'issue') isIssueOpen.value = !isIssueOpen.value;
    else if (cate === 'recent') isRecentOpen.value = !isRecentOpen.value;
}
</script>