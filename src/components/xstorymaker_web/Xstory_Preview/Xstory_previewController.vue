<template>
  <div
    id="xstory-preview-controller"
    ref="ctrlDom"
    :style="{
      right: ctrlPos + 'px',
    }"
  >
    <div class="ctrl-row">
      <div
        @click="ctrlBtnClick('arrow')"
        @mousedown="onMouseDown('arrow')"
        @mouseup="onMouseUp('arrow')"
        @mouseleave="onMouseUp('arrow')"
        id="ctrl-arrow"
        :style="{
          opacity: iconStyle[0],
        }"
      >
        <img src="../img/openclose_arrow.png" alt="" />
      </div>

      <!-- 上一条 -->
      <div
        @mousedown="onMouseDown('toPre')"
        @mouseup="onMouseUp('toPre')"
        @mouseleave="onMouseUp('toPre')"
        :style="{
          opacity: iconStyle[1],
        }"
        class="ctrl-item"
      >
        <div @click="ctrlBtnClick('toPre')" class="dweb-icon">
          <img src="../img/pre-next.png" alt="" />
        </div>
      </div>
      <!-- 播放暂停 -->
      <div
        @mousedown="onMouseDown('play')"
        @mouseup="onMouseUp('play')"
        @mouseleave="onMouseUp('play')"
        :style="{
          opacity: iconStyle[2],
        }"
        class="ctrl-item"
      >
        <div @click="ctrlBtnClick('play')" class="dweb-icon">
          <img v-if="previewPlay == false" src="../img/play.png" alt="" />
          <img v-else src="../img/pause.png" alt="" />
        </div>
      </div>
      <!-- 下一条 -->
      <div
        @mousedown="onMouseDown('toNext')"
        @mouseup="onMouseUp('toNext')"
        @mouseleave="onMouseUp('toNext')"
        :style="{
          opacity: iconStyle[3],
        }"
        class="ctrl-item"
      >
        <div @click="ctrlBtnClick('toNext')" class="dweb-icon">
          <img src="../img/pre-next.png" alt="" style="transform: rotateY(180deg)" />
        </div>
      </div>

      <!-- 提示文字 -->
      <div class="ctrl-text">
        <div v-if="choosed_ScriptIndex!>-1" class="play-time">
          <span>第 {{ choosed_SceneIndex! + 1 }} 幕</span>
          <span> / </span>
          <span>第 {{ choosed_ScriptIndex! + 1 }} 条</span>
        </div>
        <div v-else class="tips">
          <span>{{ playTypeTip }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, onMounted, ref } from "vue";
import { XstoryComponentStoreKey } from "../store";
export default defineComponent({
  name: "xstory-preview-controller",
  setup() {
    const store = inject(XstoryComponentStoreKey);
    const choosed_SceneIndex: ComputedRef<number | undefined> = computed(() => store?.state.choosedSceneIndex);
    const choosed_ScriptIndex: ComputedRef<number | undefined> = computed(() => store?.state.choosedScriptIndex);
    const iconStyle = ref([1, 1, 1, 1]);
    const ctrlDom = ref<HTMLElement>();
    const ctrlDomSize = ref({ width: 0, height: 0 });
    const ctrlPos = ref<number>(0);
    const OnOff = ref(false);
    const previewPlay = ref(false);
    const playTypeTip = ref("等待选择");
    let playTimer: NodeJS.Timer;

    onMounted(() => {
      ctrlDomSize.value.width = ctrlDom.value!.offsetWidth;
      ctrlDomSize.value.height = ctrlDom.value!.offsetHeight;
    });

    const ctrlBtnClick = (target: string) => {
      if (target == "arrow") {
        OnOff.value = !OnOff.value;
        if (OnOff.value == true) {
          ctrlPos.value = -ctrlDomSize.value.width + 45;
        } else {
          ctrlPos.value = 0;
        }
      }

      if (target == "toPre") {
        store?.commit("previewPre");
      }
      if (target == "toNext") {
        store?.commit("previewNext");
      }

      if (target == "play") {
        previewPlay.value = !previewPlay.value;
        if (previewPlay.value == true) {
          playTimer = setInterval(() => {
            store?.commit("previewNext", () => {
              clearInterval(playTimer);
              previewPlay.value = false;
            });
          }, 1000);
        } else {
          clearInterval(playTimer);
        }
      }
    };

    const onMouseDown = (target: string) => {
      if (target == "arrow") {
        iconStyle.value[0] = 0.5;
      }
      if (target == "toPre") {
        iconStyle.value[1] = 0.5;
      }
      if (target == "play") {
        iconStyle.value[2] = 0.5;
      }
      if (target == "toNext") {
        iconStyle.value[3] = 0.5;
      }
    };

    const onMouseUp = (target: string) => {
      if (target == "arrow") {
        iconStyle.value[0] = 1;
      }
      if (target == "toPre") {
        iconStyle.value[1] = 1;
      }
      if (target == "play") {
        iconStyle.value[2] = 1;
      }
      if (target == "toNext") {
        iconStyle.value[3] = 1;
      }
    };

    return {
      iconStyle: iconStyle,
      ctrlDom: ctrlDom,
      ctrlPos: ctrlPos,
      previewPlay: previewPlay,
      choosed_SceneIndex: choosed_SceneIndex,
      choosed_ScriptIndex: choosed_ScriptIndex,
      playTypeTip: playTypeTip,
      ctrlBtnClick: ctrlBtnClick,
      onMouseDown: onMouseDown,
      onMouseUp: onMouseUp,
    };
  },
});
</script>

<style scoped>
#xstory-preview-controller {
  color: #fff;
  position: absolute;
  bottom: 0;
  height: 45px;
  border-radius: 15px;
  width: 100%;
  background: #232429;
  box-shadow: -2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d;
}
#ctrl-arrow {
  position: absolute;
  left: 0;
  width: 45px;
  height: 45px;
  background: #313b46;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 5px;
  box-shadow: -2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d;
  user-select: none;
}
#ctrl-arrow img {
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
}
.ctrl-row {
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: start;
  align-items: center;
  padding-left: 50px;
}
.ctrl-text {
  width: 200px;
  height: 30px;
  margin: 5px;
  background: #313b46;
  padding: 5px;
  border-radius: 15px;
  user-select: none;
  text-align: center;
  line-height: 30px;
}
.ctrl-item {
  width: 30px;
  height: 30px;
  margin: 5px;
  background: #313b46;
  padding: 5px;
  border-radius: 15px;
  user-select: none;
}
.ctrl-item img {
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
}
</style>
