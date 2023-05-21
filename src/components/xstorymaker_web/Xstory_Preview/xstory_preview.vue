<template>
  <div id="xstory-preview" ref="parentDom">
    <canvas ref="canvasDom" :width="canvasSize.width" :height="canvasSize.height"></canvas>
    <img ref="canvasBg" src="../img/sence-bg.jpg" style="display:none" alt="">

    <RoleLib v-if="roleLibData.open"></RoleLib>
    <NewRole v-if="newRole.open" :canvasSize="canvasSize"></NewRole>
    <Controller></Controller>
    <OpenAiPlayGround v-if="openai_connect"></OpenAiPlayGround>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, onMounted, ref, watch } from "vue";
import { Role, XstoryComponentStoreKey } from "../store";
import { DwebCanvas } from "./dwebcanvas/DwebCanvas";
import RoleLib from "./Xstory_roleLib.vue";
import NewRole from "./Xstory_newRole.vue";
import Controller from "./Xstory_previewController.vue";
import OpenAiPlayGround from "./Xstory_openAiChatPreview.vue";
export default defineComponent({
  name: "xstory-preview",
  components: {
    RoleLib: RoleLib,
    NewRole: NewRole,
    Controller:Controller,
    OpenAiPlayGround:OpenAiPlayGround
  },
  setup() {
    const parentDom = ref<HTMLElement>();
    const canvasBg = ref<HTMLImageElement>();
    const canvasDom = ref<HTMLCanvasElement>();
    const canvasSize = ref<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });
    const dwebCanvas = ref<DwebCanvas>();
    const store = inject(XstoryComponentStoreKey);
    const openai_connect: ComputedRef<boolean | undefined> = computed(() => store?.state.pluginAbilitys.openAi.connect);
    const choosed_SceneIndex: ComputedRef<number> = computed(() => store!.state.choosedSceneIndex);
    const choosed_ScriptIndex: ComputedRef<number> = computed(() => store!.state.choosedScriptIndex);

    const roleLibData: ComputedRef<{
      open: boolean;
      roleList: Role[];
    }> = computed(() => store!.state.roleLibData);
    const newRole: ComputedRef<{ open: boolean }> = computed(() => store!.state.newRole);

    const watchList: any[] = [
      () => choosed_SceneIndex.value, 
      () => choosed_ScriptIndex.value
    ];

    watch(watchList, (newV, oldV) => {
      if (newV) {
        // console.log(newV);
        const script_index = newV[1];
        if (script_index!=-1) {
          store?.getters.updatePreviewCanvas
        }else{
          dwebCanvas.value?.clearCanvas();
        }
      }
    });

    onMounted(() => {
      canvasSize.value.width = parentDom.value!.offsetWidth;
      canvasSize.value.height = (canvasSize.value.width / 16) * 9;
      let bg_img = canvasBg.value!;
      bg_img.onload = () => {
        dwebCanvas.value = new DwebCanvas({
          canvas: canvasDom.value!,
          width: canvasSize.value.width,
          height: canvasSize.value.height,
          canvasDefaultBg: bg_img,
        });
        dwebCanvas.value.clearCanvas();
        store?.commit("setInitScreenData", {
        width: canvasSize.value.width,
        height: canvasSize.value.height,
        dwebcanvas: dwebCanvas.value,
      });
      };
    });

    const updatePreview = (role: Role) => {
      // console.log("updatePreview");
      // console.log(role);
      if (dwebCanvas.value) {
        dwebCanvas.value.renderImage(role.image!, {
          x: role.imgX,
          y: role.imgY,
          width: role.image!.width * role.scale,
          height: role.image!.height * role.scale,
        });
      }
    };

    return {
      parentDom: parentDom,
      canvasDom:canvasDom,
      canvasSize: canvasSize,
      canvasBg:canvasBg,
      roleLibData: roleLibData,
      newRole: newRole,
      updatePreview: updatePreview,

      //openai
      openai_connect: openai_connect,
    };
  },
});
</script>

<style scoped>
#xstory-preview {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
