<template>
    <Sidebar :active="'home'"/>
    <div style="margin-left: 60px;">
        <div class="project-header flex items-center justify-between">
            <div class="project-name flex items-center gap-2">
                <p>Granduation Project</p>
                <p class="text-[14px]">(GRANDUATION KEY)</p>
            </div>
            <div class="project-member">
                <div class="member-list">

                </div>
                <Button label="Mời thành viên" variant="outlined" size="small" class="button"/>
            </div>
        </div>
    </div>
</template>
<script setup>
import Sidebar from '@/components/common/Sidebar.vue';
import { Button } from 'primevue';
</script>