import { App } from 'vue';
import XstoryPlugin from './XstoryMaker.vue'

XstoryPlugin.install = (app: App)=> {
  app.component(XstoryPlugin.name, XstoryPlugin);
};

export default XstoryPlugin