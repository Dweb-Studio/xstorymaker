<template>
  <div id="xstory-script-detail">
    <div v-if="choosed_ScriptIndex == -1" class="row content-tips">尚未选择任何脚本</div>
    <div v-else class="row">
      <div class="role-set detail-item">
        <div class="label">
          <div class="row">
            <div class="text">
              <span>左侧：</span>
            </div>
            <div class="settings">
              <button @click="openRoleLib('left')" class="dweb-btn blue">角色库</button>
              <button v-if="leftRole" @click="clearScriptRole('left')" class="dweb-btn red">删除</button>
            </div>
          </div>
        </div>
        <div class="role-preview">
          <div v-if="leftRole == null" class="role-none">
            <button @click="openNewRole" class="dweb-btn red">新建角色</button>
          </div>
          <div v-else class="role-has">
            <img :src="leftRole?.image?.src" alt="" />
            <div class="role-name">
              {{ leftRole?.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="role-set detail-item">
        <div class="label">
          <div class="row">
            <div class="text">
              <span>右侧：</span>
            </div>
            <div class="settings">
              <button @click="openRoleLib('right')" class="dweb-btn blue">角色库</button>
              <button v-if="rightRole" @click="clearScriptRole('right')" class="dweb-btn red">删除</button>
            </div>
          </div>
        </div>
        <div class="role-preview">
          <div v-if="rightRole == null" class="role-none">
            <button @click="openNewRole" class="dweb-btn red">新建角色</button>
          </div>
          <div v-else class="role-has">
            <img :src="rightRole?.image?.src" alt="" />
            <div class="role-name">
              {{ rightRole?.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-content detail-item">
        <div class="label">文字内容:</div>
        <div class="text-area">
          <textarea cols="30" rows="10" placeholder="输入该脚本文本内容" :value="current_text" @input="inputScriptText($event)"></textarea>
        </div>
      </div>
    </div>

    <div v-show="openai_connect" id="openai-mode-setting" :style="{
      top:openai_setting_top,
    }">
      <div @click="openAiSettingOnoff"
       :style="{
          boxShadow:openai_setting_boxshadow
       }"
       id="openai-setting-onoff">
        OpenAi模型参数
      </div>
      <div class="dweb-form">
        <div class="form-item">
          <div class="label">Mode</div>
          <div class="content">
            <select v-model="openai_setting_from.name" name="" id="">
              <option value="Chat">Chat</option>
              <option value="1">Complate(未接入)</option>
              <option value="2">Insert(未接入)</option>
              <option value="3">Edit(未接入)</option>
            </select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Model</div>
          <div class="content">
            <select v-model="openai_setting_from.model" name="" id="">
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="1">gpt-3.5-turbo-0301</option>
            </select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">Temperature</div>
          <div class="content">
            <input v-model="openai_setting_from.temperature" type="number" max="1" min="0" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Maximum length</div>
          <div class="content">
            <input v-model="openai_setting_from.maximumLength" type="number" max="2048" min="0" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Top P</div>
          <div class="content">
            <input v-model="openai_setting_from.topP" type="number" max="1" min="0" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Frequency penalty</div>
          <div class="content">
            <input v-model="openai_setting_from.frequencyPenalty" type="number" max="2" min="0" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">Presence penalty</div>
          <div class="content">
            <input v-model="openai_setting_from.presencePenalty" type="number" max="2" min="0" />
          </div>
        </div>
      </div>

      <div class="form-submit">
        <button @click="saveNewParams" class="dweb-btn red">提交修改</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef, ref } from "vue";
import { ModeChat, Role, XstoryComponentStoreKey } from "../store";
export default defineComponent({
  name: "xstory-script-detail",
  setup() {
    const store = inject(XstoryComponentStoreKey);
    //openai connect state
    const openai_connect: ComputedRef<boolean | undefined> = computed(() => store?.state.pluginAbilitys.openAi.connect);
    const openai_setting_top = ref<string>("30px");
    const openai_setting_boxshadow = ref<string>("-2px 0px 5px #b638389d, -2px 0px 8px #b638389d")//38a9b69d
    const openai_default_params = ref<ComputedRef<ModeChat | undefined>>(computed(() => store?.state.pluginAbilitys.openAi.mode));
    const openai_setting_from = ref<ModeChat>({
      name: "Chat",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maximumLength: 256,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    })

    const choosed_SceneIndex: ComputedRef<number> = computed(() => store!.state.choosedSceneIndex);
    const choosed_ScriptIndex: ComputedRef<number> = computed(() => store!.state.choosedScriptIndex);

    //当前脚本 文本内容
    const current_text: ComputedRef<string> = computed(() => store!.state.sceneList[choosed_SceneIndex.value].script[choosed_ScriptIndex.value].text);
    //当前脚本 左侧角色
    const leftRole: ComputedRef<Role | null> = computed(() => store!.state.sceneList[choosed_SceneIndex.value].script[choosed_ScriptIndex.value].left);
    //当前脚本 右侧角色
    const rightRole: ComputedRef<Role | null> = computed(() => store!.state.sceneList[choosed_SceneIndex.value].script[choosed_ScriptIndex.value].right);


    const openAiSettingOnoff = () => {
      let setting_top = openai_setting_top.value;
      console.log(setting_top)
      if (setting_top=="30px") {
        openai_setting_top.value = "100%";
        openai_setting_boxshadow.value = "-2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d";
      }else{
        openai_setting_top.value = "30px";
        openai_setting_boxshadow.value = "2px 0px 5px #b638389d, 2px 0px 8px #b638389d";
      }
    };

    const saveNewParams = () => {
      store!.commit("setOpenAiMode", openai_setting_from.value);
    };

    const clearScriptRole = (roleDir: string) => {
      store!.commit("clearScriptRole", roleDir);
      store?.getters.updatePreviewCanvas;
    };

    const inputScriptText = (event: Event) => {
      let text = (event.target as HTMLTextAreaElement).value;
      store!.commit("setScriptText", text);
      store?.getters.updatePreviewCanvas;
    };

    const openRoleLib = (roleDir: string) => {
      const setRoleCallback = (role: Role) => {
        store!.commit("setScriptRole", { role: role, roleDir: roleDir });
        store?.commit("setRoleLibOpen", { open: false, callback: null });
        store?.getters.updatePreviewCanvas;
      };
      store!.commit("setRoleLibOpen", { open: true, callback: setRoleCallback });
    };

    const openNewRole = () => {
      store!.commit("setNewRoleOpen", true);
    };

    return {
      choosed_ScriptIndex: choosed_ScriptIndex,
      current_text: current_text,
      leftRole: leftRole,
      rightRole: rightRole,
      inputScriptText: inputScriptText,
      openRoleLib: openRoleLib,
      openNewRole: openNewRole,
      clearScriptRole: clearScriptRole,

      //openai setting
      openai_connect: openai_connect,
      openai_setting_top:openai_setting_top,
      openai_setting_boxshadow:openai_setting_boxshadow,
      openai_setting_from:openai_setting_from,
      openAiSettingOnoff:openAiSettingOnoff,
      saveNewParams:saveNewParams
    };
  },
});
</script>

<style scoped>
#xstory-script-detail {
  color: #fff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.role-set {
  width: 30%;
}
.role-preview {
  width: 100%;
  height: 250px;
  outline: 2px solid #363636;
}
.label {
  width: 100%;
  padding: 5px;
}
.dialog-content {
  width: 30%;
}
.text-area {
  width: 100%;
  box-sizing: border-box;
}
.detail-item {
  margin: 5px;
}
.settings {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 70%;
}
.text-area textarea {
  width: 100%;
  height: 200px;
  max-height: 250px;
  border: 0;
  color: #fff;
  background: #282c34;
  resize: none;
  outline: 2px solid #363636;
}
.content-tips {
  text-shadow: 0px 0px 2px #38a9b69d, 0px 0px 4px #38a9b69d, 0px 0px 6px #38a9b69d;
}
.role-none {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.role-has {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.role-has img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.role-has .role-name {
  width: 100%;
  height: 30px;
  background: #00000080;
  position: absolute;
  bottom: 0;
  text-align: center;
  line-height: 30px;
}
#openai-mode-setting {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000000d6;
}
#openai-setting-onoff{
  width: 180px;
  height: 30px;
  position: absolute;
  top: -30px;
  right: 0;
  background: #00000080;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
}
.dweb-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
}
.form-item {
  width: 33.33%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
}
.label {
  width: 100%;
}
.content {
  width: 100%;
}
</style>
