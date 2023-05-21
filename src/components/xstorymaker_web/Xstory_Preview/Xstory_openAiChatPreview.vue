<template>
  <div
    id="openai-playground"
    :style="{
      top: openai_playground_top,
    }"
  >
    <div
      id="openai-playground-ohoff"
      @click="playGroundOnOff"
      :style="{
        top: openai_playground_ohoff_top,
        boxShadow: openai_playground_ohoff_boxShadow,
      }"
    >
      OpenAi对话演练场
    </div>
    <div class="layout">
      <div class="quick-operation">
        <div class="icon-list">
          <div
            v-for="(item, index) in quickBtnList"
            @click="quickBtnClick(index)"
            class="icon-item"
            :style="{
              background: `linear-gradient(45deg, #272f39, ${item.backgroundColor})`,
            }"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="chat">
        <div ref="messageListDom" class="message-list">
          <template v-for="(item, index) in messageList">
            <div @click="selectMessage(index)" v-if="item.role == 'assistant'" class="message-item ai">
              <div class="message-item-name">
                <span>{{ item.role }}:</span>
              </div>
              <div class="message-item-content">
                {{ item.content }}
              </div>

              <template v-if="quickOpertion_type == 0 || quickOpertion_type == 1">
                <div v-if="selectedMessageList.indexOf(index) != -1" class="select-icon" style="right: -40px; background: #ff0000">
                  <img src="../img/submit.png" alt="" />
                </div>
                <div v-else class="select-icon" style="right: -40px; background: #4242429b">
                  <img src="../img/submit.png" alt="" />
                </div>
              </template>
            </div>
            <div @click="selectMessage(index)" v-else class="message-item user">
              <div class="message-item-name">
                <span>{{ item.role }}:</span>
              </div>
              <div class="message-item-content">
                {{ item.content }}
              </div>

              <template v-if="quickOpertion_type == 0 || quickOpertion_type == 1">
                <div v-if="selectedMessageList.indexOf(index) != -1" class="select-icon" style="left: -40px; background: #ff0000">
                  <img src="../img/submit.png" alt="" />
                </div>
                <div v-else class="select-icon" style="left: -40px; background: #4242429b">
                  <img src="../img/submit.png" alt="" />
                </div>
              </template>
            </div>
          </template>
        </div>

        <div id="message-input">
          <input @keyup.enter="sendChatMessage" v-model="inputValue" type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import swal from "sweetalert";
import { computed, ComputedRef, defineComponent, inject, nextTick, ref, watch } from "vue";
import { ChatMessage, Script, XstoryComponentStoreKey } from "../store";
export default defineComponent({
  name: "xstory-openAiChat-preview",
  setup() {
    const messageListDom = ref<HTMLElement>();
    const store = inject(XstoryComponentStoreKey);
    
    const openai_playground_top = ref<string>("0%");
    const openai_playground_ohoff_top = ref<string>("0px");
    const openai_playground_ohoff_boxShadow = ref<string>("-2px 0px 5px #b638389d, -2px 0px 8px #b638389d"); //38a9b69d
    const messageList = ref<ComputedRef<ChatMessage[] | undefined>>(computed(() => store?.state.pluginAbilitys.openAi.chat.messages));

    const quickOpertion_type = ref<number>(-1);
    const quickBtnList = ref<
      {
        title: string;
        markParam: string;
        backgroundColor: string; //#d95050
      }[]
    >([
      {
        title: "多选",
        markParam: "single",
        backgroundColor: "#38a9b69d",
      },
      {
        title: "全选",
        markParam: "all",
        backgroundColor: "#38a9b69d",
      },
      {
        title: "导出",
        markParam: "export",
        backgroundColor: "#38a9b69d",
      },
      {
        title: "清空",
        markParam: "clear",
        backgroundColor: "#38a9b69d",
      },
    ]);
    const selectedMessageList = ref<number[]>([]);

    const quickBtnClick = (btnIndex: number) => {
      if (quickOpertion_type.value != btnIndex) {
        if (btnIndex < 2) {
          quickOpertion_type.value = btnIndex;
          quickBtnList.value[btnIndex].backgroundColor = "#d95050";
          quickBtnList.value.forEach((item, index) => {
            if (index != btnIndex) {
              item.backgroundColor = "#38a9b69d";
            }
          });
        }
      } else {
        quickOpertion_type.value = -1;
        quickBtnList.value[btnIndex].backgroundColor = "#38a9b69d";
      }
      if (quickOpertion_type.value == 1) {
        selectedMessageList.value = [];
        messageList.value?.forEach((item, index) => {
          selectedMessageList.value.push(index);
        });
      }
      if (btnIndex == 2) {
        exportOpenAiChat();
        quickOpertion_type.value = -1;
        quickBtnList.value.forEach((item, index) => {
          if (index != btnIndex) {
            item.backgroundColor = "#38a9b69d";
          }
        });
      }
      if (btnIndex == 3) {
        clearMsgHistory();
        quickOpertion_type.value = -1;
        quickBtnList.value.forEach((item, index) => {
          if (index != btnIndex) {
            item.backgroundColor = "#38a9b69d";
          }
        });
      }
    };

    const clearMsgHistory = () => {
      store?.commit("clearOpenAiChatMsgHistory");
    };

    const exportOpenAiChat = () => {
      selectedMessageList.value.forEach((item) => {
        if (messageList.value) {
          let newScript: Script = {
            right: null,
            left: null,
            text: messageList.value[item].content,
          };
          store?.commit("addScript", newScript);
        }
      });
      console.log(store?.state.sceneList[store?.state.choosedSceneIndex].script);
    };

    const selectMessage = (msgIndex: number) => {
      console.log(msgIndex);
      if (quickOpertion_type.value == 0) {
        if (selectedMessageList.value.indexOf(msgIndex) == -1) {
          selectedMessageList.value.push(msgIndex);
        } else {
          selectedMessageList.value.splice(selectedMessageList.value.indexOf(msgIndex), 1);
        }
      }

      if (quickOpertion_type.value == 1) {
        selectedMessageList.value.splice(selectedMessageList.value.indexOf(msgIndex), 1);
      }

      console.log(selectedMessageList.value);
    };

    // 聊天IO
    watch([messageList.value], (newV, olV) => {
      if (newV[0]) {
        nextTick(() => {
          messageListDom.value?.scrollTo(0, messageListDom.value.scrollHeight);
        });
      }
    });

    const inputValue = ref<string>("");
    const sendChatMessage = () => {
      let content = inputValue.value;
      let message: ChatMessage = {
        role: "user",
        content: content,
      };
      store?.dispatch("openAiChat", message).then((res) => {
        if (res < 0) {
          let errMsg = store.state.pluginAbilitys.openAi.errMsg;
          swal({
            icon: "error",
            text: errMsg,
          });
        }
      });
      inputValue.value = "";
    };

    const playGroundOnOff = () => {
      if (openai_playground_top.value == "100%") {
        openai_playground_top.value = "0";
        openai_playground_ohoff_top.value = "0px";
        openai_playground_ohoff_boxShadow.value = "2px 0px 5px #b638389d, 2px 0px 8px #b638389d";
      } else {
        openai_playground_top.value = "100%";
        openai_playground_ohoff_top.value = "-30px";
        openai_playground_ohoff_boxShadow.value = "-2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d";
      }
    };

    return {
      openai_playground_top: openai_playground_top,
      openai_playground_ohoff_top: openai_playground_ohoff_top,
      openai_playground_ohoff_boxShadow: openai_playground_ohoff_boxShadow,
      playGroundOnOff: playGroundOnOff,

      inputValue: inputValue,
      messageList: messageList,
      messageListDom: messageListDom,
      sendChatMessage: sendChatMessage,

      quickBtnList: quickBtnList,
      quickOpertion_type: quickOpertion_type,
      selectedMessageList: selectedMessageList,
      quickBtnClick: quickBtnClick,
      selectMessage: selectMessage,
    };
  },
});
</script>

<style scoped>
#openai-playground {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000000d6;
  color: #fff;
}
#openai-playground-ohoff {
  width: 180px;
  height: 30px;
  position: absolute;
  right: 0;
  background: #00000080;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  z-index: 999;
}
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.quick-operation {
  width: 10%;
  /* border-right: 1px solid #fff; */
  box-shadow: -2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d;
  height: 100%;
}
.icon-list {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}
.icon-item {
  width: 60px;
  height: 40px;
  box-sizing: border-box;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat {
  width: 90%;
  height: 100%;
  box-sizing: border-box;
  /* position: relative; */
}
#message-input {
  width: 90%;
  height: 30px;
  position: absolute;
  bottom: 5px;
  right: 0;
  background: #00000080;
  display: flex;
  flex-wrap: nowrap;
  justify-content: end;
}
#message-input input {
  width: 90%;
  height: 100%;
  background: #3d3d3d92;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  box-shadow: -2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d;
}
.message-list {
  /* border: 1px solid #fff; */
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.message-item {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
  box-shadow: -2px 0px 5px #38a9b69d, -2px 0px 8px #38a9b69d;
  position: relative;
}
.select-icon {
  width: 25px;
  height: 25px;
  background: #4242429b;
  border-radius: 15px;
  position: absolute;
}
.select-icon img {
  width: 100%;
  height: 100%;
}
.message-item.ai {
  float: left;
}
.message-item.user {
  float: right;
}
.message-item-name {
  padding: 5px;
  font-weight: 700;
}
.message-item-content {
  width: 100%;
  padding: 5px;
}
</style>
