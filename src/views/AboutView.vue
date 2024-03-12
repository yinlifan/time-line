<template>
  <div class="about">
    <p>页面</p>
    <div class="box">
      <ul class="slide" @click="getSlidePosition">
        <div class="slideItem" ref="slideItem">
          <div
            class="slideBlock"
            v-for="item in vm.endHour - vm.startHour"
            :style="{ width: slideItemWidth + 'cqw' }"
            :key="item"
          >
            <div
              class="halfBlockLeft"
              ref="halfLeft"
              @click.stop="halfLeftClick(item)"
            ></div>
            <div
              class="halfBlockRight"
              ref="halfRight"
              @click="halfRightClick(item)"
            ></div>
          </div>
        </div>
        <div class="slideText">
          <li
            v-for="(item, i) in hourArray"
            :key="i"
            :style="{ fontSize: slideTxtFontSize + 'cqw' }"
            class="clockHour"
            @click.stop="getSpecificTime(formatTime(item))"
          >
            {{ formatTime(item) }}:00
          </li>
          <li
            :style="{ fontSize: slideTxtFontSize + 'cqw' }"
            class="clockHour"
            @click.stop="getSpecificTime(formatTime(vm.endHour))"
          >
            {{ formatTime(vm.endHour) }}:00
          </li>
        </div>
        <div class="slideBar" ref="slideBar" @click.stop="clickBar"></div>
      </ul>
      <!-- <p style="font-size: 40px">{{ vm.time.join(":") }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref, defineAsyncComponent } from "vue";
// 时间条
const slideItem = ref();
// 小滑块
const slideBar = ref();
// 左半区间
const halfLeft = ref();
// 右半区间
const halfRight = ref();
// 时间变量
const vm = reactive({
  startHour: 0,
  endHour: 24,
  time: [],
});
// 假设当前时间
const currentTime = "15:27";
// 定义小时数组
let hourArray = ref([]);
for (let i = 0; i < vm.endHour - vm.startHour; i++) {
  hourArray.value.push(vm.startHour + i);
}
onMounted(() => {
  vm.time = [15, 27];
  timeToPosition(vm.time);
});
// 确定每一个小块的宽度，转化为 cqw 单位
// 先求整个时间条长度，除以相差时间(h)并转化就是小区间的大小（cqw）
const slideItemWidth = computed(() => {
  if (slideItem.value) {
    return (
      ((window.getComputedStyle(slideItem.value).width.replace("px", "") - 0) /
        (vm.endHour - vm.startHour) /
        (window.getComputedStyle(slideItem.value).width.replace("px", "") -
          0)) *
      100
    );
  }
});
// 确定每一个小区间内文字的大小
const slideTxtFontSize = computed(() => {
  return (slideItemWidth.value + 1) / 4;
});
// 获取点击位置，根据位置求取时间
const getSlidePosition = (e) => {
  const sumWidth =
    window.getComputedStyle(slideItem.value).width.replace("px", "") - 0; // slide总长度
  let offsetPosition = e.layerX; // 鼠标点击的当前的修正位置
  if (e.layerX < 0) {
    offsetPosition = 0;
  } else if (e.layerX >= sumWidth) {
    offsetPosition = sumWidth;
  }
  // (sumWidth / (vm.endHour - vm.startHour)) 是小块的宽度(px)
  slideBar.value.style.left =
    (offsetPosition / (sumWidth / (vm.endHour - vm.startHour))) *
      1 *
      slideItemWidth.value -
    0.8 +
    "cqw";
  // 根据位置获取时间
  const minusTime = vm.endHour - vm.startHour;
  let currentHour = ~~((offsetPosition / sumWidth) * minusTime);
  let currentMinute = Math.round(
    (offsetPosition / sumWidth) * minusTime * 60 - currentHour * 60
  );
  if (currentMinute >= 60) {
    currentMinute = 0;
    currentHour++;
  }
  vm.time = [formatTime(currentHour), formatTime(currentMinute)];
  // console.log("currentH, currentMinutes :>> ", currentHour, currentMinute);
  // console.log("当前点击位置 px ======>", offsetPosition);
  // console.log("当前总长度 px =======>", sumWidth);
};
// 点击小滑块
const clickBar = (e) => {
  // console.log(e);
};
// 点击数字，获取具体时间
const getSpecificTime = (times) => {
  vm.time = [times, "00"];
  // 这句话代表了当前是多少个小区间宽度 slideItemWidth.value
  slideBar.value.style.left = times * 1 * slideItemWidth.value - 0.8 + "cqw";
};
// 根据时间反求位置
const timeToPosition = (timeArr) => {
  const currentSumTime = timeArr[0] * 60 + timeArr[1] * 1;
  const timeRatio = currentSumTime / (1 * 60); // 比例，相当于过了多少个 60 分钟
  const sumWidth =
    window.getComputedStyle(slideItem.value).width.replace("px", "") - 0; // slide总长度（px）
  console.log(
    "每个小区间的宽度的px数====>",
    sumWidth / (vm.endHour - vm.startHour)
  );
  console.log("过了几个区间 :>> ", timeRatio);
  console.log("left", timeRatio * 1 * slideItemWidth.value);
  slideBar.value.style.left =
    timeRatio * 1 * slideItemWidth.value - 0.8 + "cqw";
};

// 点击左半区间
const halfLeftClick = (e) => {
  vm.time = [formatTime(e - 1), "00"];
  slideBar.value.style.left = (e - 1) * 1 * slideItemWidth.value - 0.8 + "cqw";
};
// 点击右半区间
const halfRightClick = (e) => {
  vm.time = [formatTime(e - 1), "30"];
  console.log(vm.time);
  slideBar.value.style.left =
    (e - 0.5) * 1 * slideItemWidth.value - 0.8 + "cqw";
};

// 处理小于 10 的情况
const formatTime = (param) => {
  if (param >= 60) {
    param = 0;
  }
  return param >= 10 ? param : "0" + param;
};
setTimeout(() => {
  vm.time = [16, 33];
  timeToPosition(vm.time);
}, 2000);
</script>

<style lang="scss" scoped>
.box {
  width: 1000px;
  height: 500px;
  border: 1px solid;
  margin: 0 auto;
  position: relative;
  padding: 0 2%;
  min-width: 200px;
  min-height: 40px;
  resize: both;
  overflow: hidden;
  // 父盒子宽度1000
  // 父盒子高度500
  container-type: size;
  .slide {
    position: relative;
    border-bottom: 1px solid;
    width: 100cqw;
    height: 10px;
    top: calc(50% - 40px / 2);
    border-left: 1px solid;
    border-right: 1px solid;
    .slideItem {
      width: 100%;
      height: 10px;
      display: flex;
      .slideBlock {
        width: 10cqw;
        height: 10px;
        border-right: 1px solid;
        position: relative;
        display: flex;
        align-items: end;
        .halfBlockLeft {
          width: 50%;
          height: 50%;
          border-right: 1px solid;
        }
        .halfBlockRight {
          width: 50%;
          height: 50%;
        }
      }
    }
    .slideText {
      width: 100%;
      height: 20px;
      display: flex;
      gap: 0.8cqw;
      margin-left: -1.1cqw;
      li {
        width: 10cqw;
        height: 20px;
        font-size: 8.4px;
        line-height: 20px;
        margin-top: 0.3cqw;
      }
      .clockHour {
        cursor: pointer;
      }
    }
    .slideBar {
      height: 1.4cqw;
      width: 1.4cqw;
      background-color: aqua;
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%); // 画三角形
      position: absolute;
      top: 1.4cqw;
      left: -0.8cqw; // 初始位置，也是偏移量，上面 JS 减去 0.8 的依据
      cursor: pointer;
      transition: 0.2s all;
    }
  }
}
</style>
