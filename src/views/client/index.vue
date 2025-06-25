<template>
    <Tabs value="0">
        <div class="header flex items-center justify-between px-4">
            <div class="ml-4 flex">
                <img src="https://placehold.co/600x400" alt="logo" width="80px">
                <TabList class="ml-4">
                    <Tab value="0">Feature</Tab>
                    <Tab value="1">Demo</Tab>
                </TabList>
            </div>
            <div class="" v-if="!userStore.isLoggedIn">
                <Button class="mx-2 button">
                    <RouterLink to="/login">
                        Đăng nhập
                    </RouterLink>
                </Button>
                <Button class="mx-2 button" variant="outlined">
                    <RouterLink to="/signup">
                        Đăng ký
                    </RouterLink>
                </Button>
            </div>
            <div v-else>
                <Button class="button" variant="outlined">
                    <RouterLink to="/workspace/dashboard">
                        Tới Dashboard
                    </RouterLink>
                </Button>
            </div>
        </div>
        <div style="margin-top: 60px;">
            <TabPanels>
                <TabPanel value="0">
                    <div class="item-content">
                        <div class="flex flex-col items-center justify-center  py-24">
                            <p class="text-[36px] font-semibold">Tất cả trong MỘT</p>
                            <p class="text-[24px] mt-4">Quản lý dự án, nhiệm vụ, mã nguồn, lỗi, và nhiều hơn nữa...</p>
                            <Button class="mt-4 button" v-if="!isLogin">
                                <RouterLink to="signup">
                                    Thử ngay
                                </RouterLink>
                            </Button>
                        </div>
                        <div class="flex flex-col items-center justify-center py-24">
                            <div class="text-content flex flex-col items-center justify-center">
                                <p style="color:var(--p-primary-400)" class="text-[14px] font-semibold">QUẢN LÝ DỰ ÁN</p>
                                <p class="text-[24px] font-semibold">Lên kế hoạch & thực hiện chúng tốt nhất</p>
                                <p class="mt-4">Nhanh chóng đánh giá tiến độ và chỉnh sửa kế hoạch</p>
                            </div>
                            <img src="https://placehold.co/600x400" alt="hehehe" class="mt-4">
                            <div class="grid grid-cols-3 gap-4 mt-4">
                                <Card>
                                    <template #title>Biểu đồ Gantt</template>
                                    <template #content>
                                        <p>Nhanh chóng chỉnh sửa, kiểm tra thời gian dự án.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Bảng công việc (Boards)</template>
                                    <template #content>
                                        <p>Quản lý các nhiệm vụ theo quy trình làm việc của bạn bằng bảng công việc.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Biểu đồ Burndown</template>
                                    <template #content>
                                        <p>Xem nhanh khối lượng công việc còn lại và thời gian còn lại để hoàn thành.</p>
                                    </template>
                                </Card>
                            </div>
                        </div>
                        <div class="flex flex-col items-center justify-center py-24">
                            <div class="text-content flex flex-col items-center justify-center">
                                <p style="color:var(--p-primary-400)" class="text-[14px] font-semibold">THEO DÕI BUGS & ISSUE</p>
                                <p class="text-[24px] font-semibold">Ghi lại mọi chi tiết</p>
                                <p class="mt-4">Dễ dàng tùy chỉnh luồng công việc</p>
                            </div>
                            <img src="https://placehold.co/600x400" alt="hehehe" class="mt-4">
                            <div class="grid grid-cols-3 gap-4 mt-4">
                                <Card>
                                    <template #title>Phân cấp nhiệm vụ</template>
                                    <template #content>
                                        <p>Lồng các nhiệm vụ con vào trong nhiệm vụ cha để giữ cho công việc được tổ chức gọn gàng.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Tùy chỉnh danh mục</template>
                                    <template #content>
                                        <p>Tạo các danh mục tùy chỉnh phù hợp với quy trình làm việc của nhóm bạn.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Mẫu ISSUE</template>
                                    <template #content>
                                        <p>Chuẩn hóa việc tạo ISSUE bằng cách tạo các mẫu.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Thêm ISSUE thông qua email</template>
                                    <template #content>
                                        <p>Thiết lập tự động tạo ISSUE thông qua địa chỉ email.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Phiên bản & cột mốc</template>
                                    <template #content>
                                        <p>Tổ chức và theo dõi mọi bản phát hành và cập nhật.</p>
                                    </template>
                                </Card>
                                <Card>
                                    <template #title>Thông báo</template>
                                    <template #content>
                                        <p>Thông báo cho đúng người về các cập nhật mà họ cần biết.</p>
                                    </template>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div class="bg-primary flex flex-col items-center p-10">
                        <p class="text-[36px] font-semibold">Một nơi đáp ứng mọi nhu cầu của bạn</p>
                        <p>Lên kế hoạch công việc, theo dõi tiến độ và nhiều chức năng hơn <span class="underline underline-offset-1"><RouterLink to="/signup">tại đây</RouterLink></span></p>
                        
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <p class="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
            </TabPanels>
        </div>
        <Footer/>
    </Tabs>
</template>
<script setup>
import { useUserStore } from '@/store/user';

import Button from 'primevue/button';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card'
import Footer from '@/components/layout/footer.vue'

const userStore = useUserStore();
const isLogin = userStore.isLoggedIn;

</script>
