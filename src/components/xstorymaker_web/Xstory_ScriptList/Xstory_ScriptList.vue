<template>
  <div id="xstory-script-list">
    <div v-for="(item, index) in scriptList" @click="selectScript(index)" class="script-item flex-xy-center">
      <div class="row">
        <div class="roler left">人物</div>
        <div v-if="index == choosedScriptIndex" class="script-text choosed">
          <div v-if="item.text.length > 0" class="span">{{ item.text }}</div>
          <div v-else class="span">选择并编辑</div>
          <div @click="deleteScript(index)" class="delete-icon">
            <img src="../img/cancle.png" alt="" />
          </div>
        </div>
        <div v-else class="script-text">
          <div v-if="item.text.length > 0" class="span">{{ item.text }}</div>
          <div v-else class="span">选择并编辑</div>
        </div>
        <div class="roler right">人物</div>
      </div>
    </div>

    <div @click="addScript" class="addbtn script-item flex-xy-center">
      <div class="flex-xy-center">
        <img src="../img/add.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject } from "vue";
import { XstoryComponentStoreKey, Script } from "../store";
export default defineComponent({
  name: "xstory-script-list",
  setup() {
    const store = inject(XstoryComponentStoreKey);
    const choosedSceneIndex: ComputedRef<number> = computed(() => store!.state.choosedSceneIndex);
    const choosedScriptIndex: ComputedRef<number> = computed(() => store!.state.choosedScriptIndex);
    const scriptList: ComputedRef<Script[]> = computed(() => store!.state.sceneList[choosedSceneIndex.value].script);

    const addScript = () => {
      // console.log('add script')
      let new_script = { right: null, left: null, text: "" } as Script;
      store?.commit("addScript", new_script);
    };

    const selectScript = (index: number) => {
      // console.log('select script')
      store?.commit("setChoosedScriptIndex", index);
    };

    const deleteScript = (index:number)=>{
      store?.commit("deleteScript",index)
    }

    return {
      scriptList: scriptList,
      choosedScriptIndex: choosedScriptIndex,
      addScript: addScript,
      selectScript: selectScript,
      deleteScript:deleteScript
    };
  },
});
</script>

<style scoped>
#xstory-script-list {
  color: #fff;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -webkit-scrollbar: none;
}
.script-item {
  width: 100%;
  height: 30px;
  margin: 10px auto;
  border-radius: 15px;
  box-shadow: 2px 2px 2px 0px #00000060;
}
.script-item.addbtn {
  border-radius: 15px;
  width: 30%;
  background: #3a3c49;
  padding: 5px;
}
.script-item img {
  width: 30px;
  height: 30px;
}
.roler.left {
  border-radius: 15px 0 0 15px;
}
.roler.right {
  border-radius: 0 15px 15px 0;
}
.roler.has {
  background-color: #d88050;
}
.roler {
  width: 20%;
  height: 100%;
  text-align: center;
  line-height: 30px;
  background-color: #4fb7c3;
  color: #fff;
  box-shadow: 2px 4px 5px 0px #00000060;
}
.script-text {
  width: 60%;
  height: 100%;
  line-height: 30px;
  text-align: center;
  background: linear-gradient(45deg, #272f39, #3a3c49);
  position: relative;
}
.delete-icon {
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
.script-text .span {
  width: 80%;
  margin: 0 auto;
  max-height: 30px;
  padding: 0;
  max-lines: 1;
  text-overflow: ellipsis;
  overflow: hidden;
}
.script-text.choosed {
  background: linear-gradient(45deg, #272f39, #d64f4f) !important;
}
</style>
