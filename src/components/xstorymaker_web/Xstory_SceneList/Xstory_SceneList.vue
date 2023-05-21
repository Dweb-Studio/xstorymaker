<template>
  <div id="xstory-scene-list">
    <template v-for="(item, index) in sceneList">
      <div v-if="index == choosed_scene" class="scene-item flex-xy-center choosed">
        <span> 第{{ index+1 }}幕 </span>
        <div v-if="sceneList.length>1" class="scene-delete-icon">
          <img @click="deleteScene(index)" src="../img/cancle.png" alt="">
        </div>
      </div>
      <div v-else @click="selectScene(index)" class="scene-item flex-xy-center">
        <span> 第{{ index+1 }}幕 </span>
      </div>
    </template>
    <div id="add-scene" @click="addScene" class="scene-item flex-xy-center">
        <img src="../img/add.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { compile, computed, ComputedRef, defineComponent, inject, ref } from "vue";
import { XstoryComponentStoreKey,Scene } from "../store/index"
export default defineComponent({
  name: "xstory-scene-list",
  components: {},
  setup() {
    const store = inject(XstoryComponentStoreKey);
    const sceneList: ComputedRef<Scene[]> = computed(() => store!.state.sceneList);
    const choosed_scene: ComputedRef<number> = computed(() => store!.state.choosedSceneIndex);
    const selectScene = (index: number) => {
      store?.commit("setChoosedSceneIndex", index);
    };
    const addScene = ()=>{
      // console.log("add scene");
      let new_scene = { name:"",bgImgSrc:"",script:[] } as Scene
      store?.commit("addScene",new_scene)
    }
    const deleteScene = (id:number)=>{
      // console.log("delete scene");
      store?.commit("deleteScene",id)
    }
    return {
      sceneList: sceneList,
      choosed_scene: choosed_scene,

      // methods
      addScene:addScene,
      selectScene: selectScene,
      deleteScene:deleteScene
    };
  },
});
</script>

<style scoped>
#xstory-scene-list {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  flex-wrap: wrap;
  /* display: flex; */
}
.scene-item {
  width: 30px;
  height: 60px;
  min-width: 60px;
  background: linear-gradient(45deg, #272f39, #3a3c49);
  border-radius: 10px;
  margin: 5px 5px;
  box-shadow: 2px 4px 5px 0px #00000060;
  font-size: 12px;
  color: #fff;
  position: relative;
}
.scene-item .choosed {
  background: linear-gradient(45deg, #272f39, #d95050) !important;
}
.flex-xy-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.scene-item.choosed {
  background: linear-gradient(45deg, #272f39, #D95050)!important;
}
.scene-item.choosed .scene-delete-icon{
  background: #fff;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 0;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scene-item.choosed .scene-delete-icon img {
  width: 24px;
  height: 24px;
}
#add-scene img {
  width: 30px;
  height: 30px;
}
</style>
