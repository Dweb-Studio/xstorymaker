<template>
  <div id="xstory-new-role">
    <div id="img-preview">
      <div class="tips">鼠标拖动以调整图片位置</div>
      <canvas ref="canvasDom" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" :width="canvasSize.width" :height="canvasSize.height"></canvas>
    </div>
    <div id="role-form">
      <div class="role-name form-item">
        <span>角色名称：</span>
        <input v-model="newRole.name" type="text" required />
      </div>
      <div class="role-img form-item">
        <span>角色图片：</span>
        <div class="img-upload">
          <input ref="roleImgInput" type="file" @input="uploadFile" style="display: none" />
          <button @click="clickImageFile" class="dweb-btn blue">上传图片</button>
        </div>
      </div>
      <div class="role-img-scale form-item">
        <span>图片缩放：</span>
        <input ref="roleImgScaleInput" type="number" step="0.01" v-model="newRole.scale" @mousedown="onScaleMouseDown" @mousemove="onScaleMouseMove" @mouseup="onScaleMouseUp" @mouseleave="onScaleMouseUp" />
      </div>
      <div class="form-submit form-item">
        <button @click="saveRole" class="dweb-btn green">确定</button>
        <button @click="cancelNewRole" class="dweb-btn red">取消</button>
      </div>
      <div class="form-item errinfo">
        <span>{{ formErrInfo }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from "vue";
import { Role, XstoryComponentStoreKey } from "../store";
import { DwebCanvas } from "./dwebcanvas/DwebCanvas";
export default defineComponent({
  name: "xstory-new-role",
  props: {
    canvasSize: {
      type: Object as () => { width: number; height: number },
      default: { width: 0, height: 0 },
    },
  },
  setup(props) {
    const store = inject(XstoryComponentStoreKey);
    const roleImgInput = ref<HTMLInputElement>();
    const roleImgScaleInput = ref<HTMLInputElement>();
    const canvasDom = ref<HTMLCanvasElement>();
    const canvasSize = ref({ width: (props.canvasSize.width / 2) * 0.75, height: props.canvasSize.height });
    const dwebcanvas = ref<DwebCanvas>();
    const newRole = ref<Role>({ name: "", image: null, scale: 1.0, imgX: 0, imgY: 0 });
    const formErrInfo = ref("");

    onMounted(() => {
      dwebcanvas.value = new DwebCanvas({
        canvas: canvasDom.value!,
        width: canvasSize.value.width,
        height: canvasSize.value.height,
      });
    });

    const saveRole = () => {
      if (newRole.value.name == "") {
        formErrInfo.value = "请填写角色名称";
        return;
      }
      if (newRole.value.image!.src == "") {
        formErrInfo.value = "请上传角色图片";
        return;
      }
      store?.commit("addRole", newRole.value);
      store?.commit("setNewRoleOpen", false);
    };

    const cancelNewRole = () => {
      store?.commit("setNewRoleOpen", false);
    };

    const clickImageFile = () => {
      if (store?.state.env != "cocos") {
        const input = roleImgInput.value;
        input?.click();
      }else{
        //cocos file select
        console.log("cocos文件选择")
        const input = roleImgInput.value;
        input?.click();
      }
    };

    const uploadFile = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files![0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        let img_src = e.target?.result as string;
        let img = new Image();
        img.src = img_src;
        img.onload = () => {
          newRole.value.image = img;
          dwebcanvas.value?.renderImage(img);
        };
      };
    };

    //input缩放拖动
    let isScaleMouseDown = false;
    let inputMouseX = 0;
    const onScaleMouseDown = (e: MouseEvent) => {
      isScaleMouseDown = true;
      inputMouseX = e.clientX;
    };

    const onScaleMouseMove = (e: MouseEvent) => {
      let now_mouseX = e.clientX;
      let movedX = now_mouseX - inputMouseX;
      if (isScaleMouseDown) {
        let dom = roleImgScaleInput.value as HTMLInputElement;
        if (movedX > 0) {
          dom.stepUp();
        } else {
          dom.stepDown();
        }

        newRole.value.scale = Number(dom.value);

        if (newRole.value.image) {
          dwebcanvas.value?.clearCanvas();
          dwebcanvas.value?.renderImage(newRole.value.image, { x: newRole.value.imgX, y: newRole.value.imgY, width: canvasSize.value.width * newRole.value.scale, height: (canvasSize.value.width / newRole.value.image.width) * newRole.value.image.height * newRole.value.scale });
        }
      }
      inputMouseX = now_mouseX;
    };

    const onScaleMouseUp = () => {
      isScaleMouseDown = false;
      inputMouseX = 0;
    };

    //canvas拖动
    let isMouseDown = false;
    let mousePos = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      let now_mouse = { x: e.clientX, y: e.clientY };
      let moved = {
        x: now_mouse.x - mousePos.x,
        y: now_mouse.y - mousePos.y,
      };
      if (isMouseDown) {
        if (newRole.value.image) {
          dwebcanvas.value?.clearCanvas();
          dwebcanvas.value?.renderImage(newRole.value.image, { x: moved.x, y: moved.y, width: canvasSize.value.width * newRole.value.scale, height: (canvasSize.value.width / newRole.value.image.width) * newRole.value.image.height * newRole.value.scale });

          newRole.value.imgX = moved.x;
          newRole.value.imgY = moved.y;
        }
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      mousePos = { x: 0, y: 0 };
    };

    return {
      canvasSize: canvasSize,
      newRole: newRole,
      formErrInfo: formErrInfo,
      canvasDom: canvasDom,
      roleImgInput: roleImgInput,
      roleImgScaleInput: roleImgScaleInput,
      uploadFile: uploadFile,
      clickImageFile: clickImageFile,
      cancelNewRole: cancelNewRole,
      saveRole: saveRole,
      onMouseDown: onMouseDown,
      onMouseMove: onMouseMove,
      onMouseUp: onMouseUp,
      onScaleMouseDown: onScaleMouseDown,
      onScaleMouseMove: onScaleMouseMove,
      onScaleMouseUp: onScaleMouseUp,
    };
  },
});
</script>

<style scoped>
#xstory-new-role {
  position: absolute;
  color: #fff;
  width: 100%;
  height: 100%;
  background: #282c34da;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
}
#img-preview {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#img-preview canvas {
  border: 2px solid #313b46;
}
#img-preview .tips {
  width: 100%;
  text-align: center;
  color: #fff;
}
#role-form {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  /* border: 1px solid #fff; */
}
.form-item {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: start;
  align-items: center;
  float: left;
}
.role-name input {
  width: 200px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 5px;
  text-align: left;
  color: #fff;
  background: #313b46;
}
.errinfo {
  color: #dc5929;
}
.role-img-scale input[type="number"] {
  width: 200px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 5px;
  text-align: left;
  color: #fff;
  background: #313b46;
  cursor: w-resize;
  /* 不可选取文字 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>
