<template>
  <div id="xstorymaker">
    <DwebWorkbench :data="UI_data"></DwebWorkbench>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, provide, ref } from "vue";
import { Panel, Workbench, resizeWindowUiData, UIdataInstantiation } from "dweb-ui/Dweb_workbench/utils/UI_data";
import SceneList from "./Xstory_SceneList/Xstory_SceneList.vue";
import ScriptList from "./Xstory_ScriptList/Xstory_ScriptList.vue"
import ScriptDetail from "./Xstory_ScriptDetail/Xstory_ScriptDetail.vue"
import Preview from "./Xstory_Preview/xstory_preview.vue"
import ProjectManager from "./Xstory_Project/Xstory_Project.vue"
import { XstoryComponentStoreKey,XstoryStore } from "./store/index"
export default defineComponent({
  name: "xstorymaker",
  setup() {

    provide(XstoryComponentStoreKey, XstoryStore);

    const windowWidth = ref<number>(window.innerWidth);
    const windowHeight = ref<number>(window.innerHeight);
    const UI_data = ref<Workbench>(
      new Workbench({
        styleValue: {
          width: windowWidth.value + "px",
          height: windowHeight.value + "px",
          flexDirection: "row",
        },
        panels: [
          new Panel({
            name: "xstory-cocos-plugin-left",
            styleValue: {
              width: "40%",
              height: "100%",
              backgroundColor: "#21252B",
            },
            dragBar:false,
            workbench: new Workbench({
              styleValue: {
                width: "100%",
                height: "100%",
                flexDirection: "column",
              },
              panels: [
                new Panel({
                  styleValue: {
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#21252B",
                  },
                  workbench: new Workbench({
                    styleValue: {
                      width: "100%",
                      height: "100%",
                      flexDirection: "row",
                    },
                    panels: [
                      new Panel({
                        name: "剧幕",
                        styleValue: {
                          width: "25%",
                          height: "100%",
                          backgroundColor: "#21252B",
                        },
                        component: SceneList,
                        dragBar:false
                      }),
                      new Panel({
                        name: "xstory-cocos-plugin-left-right",
                        styleValue: {
                          width: "85%",
                          height: "100%",
                          backgroundColor: "#313b46",
                        },
                        workbench:new Workbench({
                          styleValue: {
                            width: "100%",
                            height: "100%",
                            flexDirection: "column",
                          },
                          panels: [
                            new Panel({
                              name: "脚本",
                              styleValue: {
                                width: "100%",
                                height: "70%",
                                backgroundColor: "#313b46",
                              },
                              component:ScriptList
                            }),
                            new Panel({
                              name: "项目",
                              styleValue: {
                                width: "100%",
                                height: "30%",
                                backgroundColor: "#313b46",
                              },
                              component:ProjectManager
                            }),
                          ],
                        })
                      }),
                    ],
                  }),
                })
              ],
            }),
          }),
          new Panel({
            name: "xstory-cocos-plugin-right",
            styleValue: {
              width: "60%",
              height: "100%",
              backgroundColor: "#282C34",
            },
            workbench: new Workbench({
              styleValue: {
                width: "100%",
                height: "100%",
                flexDirection: "column",
              },
              panels: [
                new Panel({
                  name: "预览",
                  styleValue: {
                    width: "100%",
                    height: "60%",
                    backgroundColor: "#282C34",
                  },
                  component:Preview
                }),
                new Panel({
                  name: "详细",
                  styleValue: {
                    width: "100%",
                    height: "40%",
                    backgroundColor: "#282C34",
                  },
                  component:ScriptDetail
                }),
              ],
            }),
          }),
        ],
      })
    );

    let resizeTimeout: NodeJS.Timeout|number;
    const onResize = () => {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
      UI_data.value.styleValue.width = windowWidth.value + "px";
      UI_data.value.styleValue.height = windowHeight.value + "px";

      // localStorage.setItem("UI_data", JSON.stringify(UI_data.value));
      resizeWindowUiData(UI_data.value, windowWidth.value, windowHeight.value);

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        UIdataInstantiation(UI_data.value, windowWidth.value, windowHeight.value);
      }, 300);
    };

    onMounted(() => {
      const cachedUI_data = localStorage.getItem("UI_data");
      if (cachedUI_data) {
        // traverse_UIdataFromJson(JSON.parse(cachedUI_data), UI_data.value);
      }
      window.addEventListener("resize", onResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", onResize);
    });

    return {
      UI_data: UI_data,
    };
  },
});
</script>

<style>
#xstorymaker {
  width: 100vw;
  height: 100vh;
  background: #fff000;
  box-sizing: border-box;
}
.flex-xy-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.row {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
.column {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
}
.dweb-btn {
  margin: 5px;
  width: 120px;
  height: 36px;
  padding: 5px;
  font-weight: 700;
  /* border: none; */
  border-radius: 18px;
}
.dweb-btn.red {
  background: #ff4d4f;
  color: #fff;
}
.dweb-btn.blue {
  background: #1890ff;
  color: #fff;
}
.dweb-btn.green {
  background: #32af3d;
  color: #fff;
}
.dweb-btn.yellow {
  background: #fadb14;
  color: #fff;
}
</style>
