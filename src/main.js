import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import 'primeicons/primeicons.css';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import './assets/css/style.css'
import Tooltip from 'primevue/tooltip';
import piniaPersist from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist)

app.use(pinia);
app.use(router);

app.directive('tooltip', Tooltip);
const color = "cyan";

const MyPresent = definePreset(Aura, {
    semantic: {
        primary: {
            50: `{${color}.50}`,
            100: `{${color}.100}`,
            200: `{${color}.200}`,
            300: `{${color}.300}`,
            400: `{${color}.400}`,
            500: `{${color}.500}`,
            600: `{${color}.600}`,
            700: `{${color}.700}`,
            800: `{${color}.800}`,
            900: `{${color}.900}`,
            950: `{${color}.950}`
        },
    },
    colorScheme: {
        light: {
            primary: {
                color: '{zinc.950}',
                inverseColor: '#ffffff',
                hoverColor: '{zinc.900}',
                activeColor: '{zinc.800}'
            },
            highlight: {
                background: '{zinc.950}',
                focusBackground: '{zinc.700}',
                color: '#ffffff',
                focusColor: '#ffffff'
            },
            root: {
                background: '{surface.0}',
                color: '{surface.700}'
            },
            subtitle: {
                color: '{surface.500}'
            }
        },
        dark: {
            primary: {
                color: '{zinc.50}',
                inverseColor: '{zinc.950}',
                hoverColor: '{zinc.100}',
                activeColor: '{zinc.200}'
            },
            highlight: {
                background: 'rgba(250, 250, 250, .16)',
                focusBackground: 'rgba(250, 250, 250, .24)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)'
            },
            root: {
                background: '{surface.900}',
                color: '{surface.0}'
            },
            subtitle: {
                color: '{surface.400}'
            }
        }
    }
})

app.use(PrimeVue, {
    theme: {
        preset: MyPresent,
        options: {
            darkModeSelector: '.dark',
        }
    }
});


app.use(ToastService);
app.component('Toast', Toast);

app.mount('#app')
