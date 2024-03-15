<template>
  <main>
    主页面组件
    <div class="boarding">
      <TimeLine v-model:timeArray="vm.currentTime" />
    </div>
    ---------------- 父组件中的双向绑定
    {{ vm.currentTime }}
    <br />
    ---------------- 父组件中改变小时值
    <el-input
      v-model="vm.currentTime[0]"
      placeholder="111"
      size="large"
      clearable
    ></el-input>
    ---------------- 父组件中改变分钟值
    <el-input
      v-model="vm.currentTime[1]"
      placeholder="111"
      size="large"
      clearable
    ></el-input>
  </main>
</template>

<script setup>
import { defineAsyncComponent, reactive, ref, watch } from "vue";
const TimeLine = defineAsyncComponent(() =>
  import("@/components/timeLine.vue")
);
let vm = reactive({
  currentTime: [2, 11],
  min: "2",
  hour: "16",
});
setTimeout(() => {
  vm.currentTime = [vm.hour, vm.min];
}, 2000);
watch(
  () => vm.min,
  (v) => {
    vm.currentTime = [vm.hour, v];
  }
);
watch(
  () => vm.hour,
  (v) => {
    vm.currentTime = [v, vm.min];
  }
);
</script>

<style lang="scss" scoped>
.boarding {
  width: 700px;
  height: 400px;
  // background-color: #333;
}
</style>
