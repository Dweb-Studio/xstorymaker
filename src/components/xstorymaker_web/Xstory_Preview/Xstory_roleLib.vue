<template>
  <div id="xstory-roleLib">
    <div class="role-grid">
      <div v-if="roleLibData.roleList.length==0" id="role-grid-tips">
        <span>角色库为空，请先【新建角色】</span>
      </div>
      <div v-for="(item,index) in roleLibData.roleList" class="role-item">
        <div class="role-preview">
          <img v-if="item.image" :src="item.image.src" alt="">
        </div>
        <div class="role-info">
          <div class="role-name">{{ item.name }}</div>
          <div class="role-item-settings">
            <button @click="deleteRole(index)" class="role-btn red">
              删除
            </button>
            <button @click="selectRoleToScript(index)" class="role-btn green">选择</button>
          </div>
        </div>
      </div>
    </div>

    <div id="close-rolelib">
      <img @click="closeRoleLib" src="../img/cancle.png" alt="" />
    </div>

  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject } from "vue";
import { Role, XstoryComponentStoreKey } from "../store";
export default defineComponent({
  name: "xstory-roleLib",
  setup(props,context) {
    const store = inject(XstoryComponentStoreKey);
    const roleLibData: ComputedRef<{
      open: boolean;
      roleList: Role[];
    }> = computed(() => store!.state.roleLibData);

    const closeRoleLib = ()=>{
      store?.commit('setRoleLibOpen', {open: false})
    }

    const deleteRole = (index: number) => {
      store?.commit("deleteRole", index);
    };

    const selectRoleToScript = (index: number) => {
      console.log("select role")
      store?.commit("selectRoleToScript", index);
    };



    return {
      roleLibData: roleLibData,
      closeRoleLib:closeRoleLib,
      deleteRole: deleteRole,
      selectRoleToScript: selectRoleToScript,
    };
  },
});
</script>

<style scoped>
#xstory-roleLib {
  position: absolute;
  color: #fff;
  width: 100%;
  height: 100%;
  background: #282c34da;
  overflow: scroll;
  box-sizing: border-box;
}
#close-rolelib {
  background: #fff;
  width: 20px;
  height: 20px;
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#close-rolelib img {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
#role-grid-tips {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.role-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.role-item {
  width: 33%;
  height: 240px;
  border: 1px solid #fff;
}
.role-item img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.role-preview {
  width: 100%;
  height: 180px;
  background: #ffffff31;
}
.role-info {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.role-name {
  width: 100%;
  text-align: center;
}
.role-item-settings {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.role-btn {
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background: #ffffff31;
  color: #fff;
}
.role-btn.red {
  background: #ff4d4f;
  color: #fff;
}
.role-btn.yellow {
  background: #c7a418;
  color: #fff;
}
.role-btn.green {
  background: #32af3d;
  color: #fff;
}
</style>
