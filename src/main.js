import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import CKEditor from '@ckeditor/ckeditor5-vue';
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'

createApp(App)
    .use(CKEditor)
    .use(VueFire, { firebaseApp })
    .mount('#app')
