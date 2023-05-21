import axios from "axios";

import { InjectionKey } from "vue";
import { Store, createStore } from "vuex";
import { DwebCanvas } from "../Xstory_Preview/dwebcanvas/DwebCanvas";


export const XstoryComponentStoreKey: InjectionKey<Store<SceneData>> = Symbol("XstoryStore");

export const XstoryStore = createStore<SceneData>({
  state: {
    env: "web",
    pluginAbilitys: {
      openAi: {
        apikey: "",
        connect: false,
        mode: {
          name: "Chat",
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          maximumLength: 256,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0
        },
        chat: {
          messages: [],
        },
        errMsg: ""
      }
    },
    initScreen: {
      width: 0,
      height: 0,
      dwebcanvas: null
    },
    sceneList: [{ name: "", bgImgSrc: "", script: [] }],
    choosedSceneIndex: 0,
    choosedScriptIndex: -1,
    roleLibData: {
      open: false,
      setCallback: null,
      roleList: []
    },
    newRole: {
      open: false,
    }
  },
  getters: {
    updatePreviewCanvas(state) {
      let list = []
      let leftRole = state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].left
      let rightRole = state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].right
      let current_text = state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].text

      leftRole ? list.push({ type: 'image', image: leftRole.image, imagePos: { x: leftRole.imgX, y: leftRole.imgY, dir: 'left' }, scale: leftRole.scale }) : null

      rightRole ? list.push({ type: 'image', image: rightRole.image, imagePos: { x: rightRole.imgX, y: rightRole.imgY, dir: 'right' }, scale: rightRole.scale }) : null

      current_text ? list.push({ type: 'text', text: current_text }) : null

      state.initScreen.dwebcanvas?.clearCanvas()
      //@ts-ignore
      state.initScreen.dwebcanvas?.renderXstoryScriptList(list)
    }
  },
  mutations: {
    //set init screen size
    setInitScreenData(state, params: { width: number, height: number, dwebcanvas: DwebCanvas }) {
      state.initScreen.width = params.width;
      state.initScreen.height = params.height;
      state.initScreen.dwebcanvas = params.dwebcanvas;
    },
    addScene(state, scene: Scene) {
      state.sceneList.push(scene);
    },
    deleteScene(state, index: number) {
      state.sceneList = state.sceneList.filter((item, i) => i != index);
    },
    //set choosed scene index
    setChoosedSceneIndex(state, index: number) {
      state.choosedScriptIndex = -1
      state.choosedSceneIndex = index;
    },
    //add script to choosed scene
    addScript(state, script: Script) {
      state.sceneList[state.choosedSceneIndex].script.push(script);
    },
    //set choosed script index
    setChoosedScriptIndex(state, index: number) {
      state.choosedScriptIndex = index;
    },
    //delete script from choosed scene
    deleteScript(state, index: number) {
      state.sceneList[state.choosedSceneIndex].script = state.sceneList[state.choosedSceneIndex].script.filter((item, i) => i != index);
    },
    //set script text
    setScriptText(state, text: string) {
      state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].text = text;
    },

    //set role lib open
    setRoleLibOpen(state, params: { open: boolean, callback: ((role: Role) => void) | null }) {
      state.roleLibData.open = params.open;
      state.roleLibData.setCallback = params.callback;
    },

    //set new role open
    setNewRoleOpen(state, open: boolean) {
      state.newRole.open = open;
    },

    //add role to role lib
    addRole(state, role: Role) {
      state.roleLibData.roleList.push(role);
    },

    //delete role from role lib
    deleteRole(state, index: number) {
      state.roleLibData.roleList = state.roleLibData.roleList.filter((item, i) => i != index);
    },

    //select role to script
    selectRoleToScript(state, index) {
      let role = state.roleLibData.roleList[index];
      if (state.roleLibData.setCallback) {
        state.roleLibData.setCallback(role)
      }
    },

    //set role to script
    setScriptRole(state, params: { role: Role, roleDir: 'left' | 'right' }) {
      if (params.roleDir == 'left') {
        state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].left = params.role;
      } else {
        state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].right = params.role;
      }
    },

    //clear script role
    clearScriptRole(state, roleDir: 'left' | 'right') {
      if (roleDir == 'left') {
        state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].left = null;
      } else {
        state.sceneList[state.choosedSceneIndex].script[state.choosedScriptIndex].right = null;
      }
    },

    //preview next 
    previewNext(state, callback?: () => void) {
      if (state.choosedScriptIndex < state.sceneList[state.choosedSceneIndex].script.length - 1) {
        state.choosedScriptIndex++
      } else {
        if (state.choosedSceneIndex < state.sceneList.length - 1) {
          state.choosedSceneIndex++
          if (state.sceneList[state.choosedSceneIndex].script.length > 0) {
            state.choosedScriptIndex = 0
          } else {
            state.choosedScriptIndex = -1
          }
        } else {
          if (callback) {
            callback()
          }
        }
      }
    },

    //preview vious
    previewPre(state) {
      if (state.choosedScriptIndex - 1 >= 0) {
        state.choosedScriptIndex--
      } else {
        if (state.choosedSceneIndex - 1 >= 0) {
          state.choosedSceneIndex--
          state.choosedScriptIndex = state.sceneList[state.choosedSceneIndex].script.length - 1
        }
      }
    },

    //set openai apikey
    setOpenAiApikey(state, apikey: string) {
      state.pluginAbilitys.openAi.apikey = apikey
    },
    //set openai connect status
    setOpenAiConnectStatus(state, status: boolean) {
      state.pluginAbilitys.openAi.connect = status
    },
    //set openai mode
    setOpenAiMode(state, mode: ModeChat) {
      state.pluginAbilitys.openAi.mode = mode
    },
    //set openai errmsg
    setOpenAiErrmsg(state, errmsg: string) {
      state.pluginAbilitys.openAi.errMsg = errmsg
    },
    //push openai chat message
    pushOpenAiChatMessage(state, message: ChatMessage) {
      state.pluginAbilitys.openAi.chat.messages.push(message)
    },
    //clear openai chat message
    clearOpenAiChatMsgHistory(state) {
      state.pluginAbilitys.openAi.chat.messages = []
    }

  },
  actions: {
    //open ai chat
    async openAiChat(context, message: ChatMessage) {
      let result = 0
      let api_key = context.state.pluginAbilitys.openAi.apikey
      let messageList = context.state.pluginAbilitys.openAi.chat.messages
      context.commit("pushOpenAiChatMessage", message)
      const options = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + api_key
        },
        data: {
          // 请求参数
          model: context.state.pluginAbilitys.openAi.mode.model,
          messages: messageList,
          temperature: context.state.pluginAbilitys.openAi.mode.temperature,
          top_p: context.state.pluginAbilitys.openAi.mode.topP,
          max_tokens: context.state.pluginAbilitys.openAi.mode.maximumLength,
          frequency_penalty: context.state.pluginAbilitys.openAi.mode.frequencyPenalty,
          presence_penalty: context.state.pluginAbilitys.openAi.mode.presencePenalty
        }
      };

      try {
        await axios(options).then((res) => {
          console.log(res)
          if (res.data.choices.length > 0) {
            console.log(res.data.choices[0])
            let ai_msg: ChatMessage = {
              role: res.data.choices[0].message.role,
              content: res.data.choices[0].message.content,
            }
            context.commit("pushOpenAiChatMessage", ai_msg)
            result = 1
          } else {
            console.log(res.data)
            context.commit("setOpenAiErrmsg", JSON.stringify(res.data))
            result = -1
          }
        })
      } catch (error) {
        console.log(error)
        context.commit("setOpenAiErrmsg", JSON.stringify(error))
        result = -1
      }

      return result
    },


    //openai api: completions
    async openAiCompletions(context, params: { prompt: string }) {
      let result = 0
      let api_key = context.state.pluginAbilitys.openAi.apikey
      const options = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + api_key
        },
        data: {
          // 请求参数
          model: "gpt-3.5-turbo",
          messages: [{
            role: 'user',
            content: "你好"
          }],
        }
      };

      try {
        await axios(options).then((res) => {
          console.log(res)
          if (res.data.choices.length > 0) {
            result = 1
          } else {
            context.commit('setOpenAiApikey', '')
            result = -1
          }
        })
      } catch (error) {
        console.log(error)
        context.commit('setOpenAiApikey', '')
        result = -1
      }
      return result
    },

    //build project to cocos

    async buildToCocos(context) {
      //cocos Editor call
      console.log("build to cocos")
      let export_data = {
        appName: "XstoryMaker",
        appVersion: "1.0.1",
        appAuthor: "Dweb九弓子",
        data: {
          scenes: context.state.sceneList,
        }
      }
      let export_data_string = `let export_data = ${JSON.stringify(
        export_data,
        null,
        2
      )}
      export default export_data
      `;
      //@ts-ignore
      let promise_data = Editor.Message.request("asset-db", "create-asset", "db://assets/xstory/Xstory_data.ts", export_data_string, { overwrite: true, rename: true });
      //@ts-ignore
      let xstory_run = fs_extra_1.readFileSync(path_1.join(__dirname, "../../../../example_assets/Xstory_cocos2D_Run.ts"), "utf-8");
      //@ts-ignore
      let promise_run = Editor.Message.request("asset-db", "create-asset", "db://assets/xstory/Xstory_cocos2D_Run.ts", xstory_run, { overwrite: true, rename: true });
      //@ts-ignore
      let xstory_component = fs_extra_1.readFileSync(path_1.join(__dirname, "../../../../example_assets/Xstory_Component.ts"), "utf-8");
      //@ts-ignore
      let promise_component = Editor.Message.request("asset-db", "create-asset", "db://assets/xstory/Xstory_Component.ts", xstory_component, { overwrite: true, rename: true });
      //@ts-ignore
      let xstory_demo_prefab = fs_extra_1.readFileSync(path_1.join(__dirname, "../../../../example_assets/Xstory_Canvas2D_demo.prefab"), "utf-8");
      //@ts-ignore
      let promise_prefab = Editor.Message.request("asset-db", "create-asset", "db://assets/xstory/Xstory_Canvas2D_demo.prefab", xstory_demo_prefab, { overwrite: true, rename: true });

      await promise_run.then(() => {
        promise_component.then(() => {
          promise_data.then(() => {
            promise_prefab.then(() => {
            })
          })
        })
      })
    }
  }
});

interface SceneData {
  env: "web" | "cocos" | "electron";
  pluginAbilitys: {
    openAi: {
      apikey: string,
      connect: boolean,
      mode: ModeChat,
      chat: {
        messages: ChatMessage[],
      },
      errMsg: string
    }
  },
  initScreen: {
    width: number,
    height: number,
    dwebcanvas: DwebCanvas | null
  };
  sceneList: Scene[],
  choosedSceneIndex: number;
  choosedScriptIndex: number;
  roleLibData: {
    open: boolean,
    setCallback: ((role: Role) => void) | null,
    roleList: Role[]
  },
  newRole: {
    open: boolean,
  }
}

export interface ModeChat {
  name: "Chat",
  model: "gpt-3.5-turbo" | "gpt-3.5-turbo-0301",
  temperature: number,
  maximumLength: number,
  topP: number,
  frequencyPenalty: number,
  presencePenalty: number,
}

export interface ChatMessage {
  role: string | 'user' | 'assistant',
  content: string,
}

export interface Scene {
  name: string,
  bgImgSrc: string;
  script: Script[]
}

export interface Script {
  right: Role | null;
  left: Role | null;
  text: string;
}

export interface Role {
  name: string,
  image: HTMLImageElement | null,
  scale: number,
  imgX: number,
  imgY: number,
}
