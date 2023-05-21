import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import xstorymaker from './components/index'
import dwebUI from "dweb-ui/dist_com/es/"
import "dweb-ui/dist_com/es/style.css"

createApp(App).use(xstorymaker).use(dwebUI).mount('#app')
