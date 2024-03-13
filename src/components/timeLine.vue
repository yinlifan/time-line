<template>
  <div class="box">
    <ul class="slide" @click.stop="getSlidePosition">
      <div class="slideItem" ref="slideItem">
        <div
          class="slideBlock"
          v-for="item in vm.endHour - vm.startHour"
          :style="{ width: slideItemWidth + 'cqw' }"
          :key="item"
        >
          <div class="halfBlockLeft" v-if="needHalf"></div>
        </div>
      </div>
      <!-- 24 小时对应 24 个小区间和 25 个刻度，因此 text 需要多一个区间 -->
      <div
        class="slideText"
        :style="{
          width: slideItemWidth * (vm.endHour - vm.startHour + 1) + 'cqw',
          marginLeft: -0.5 * slideItemWidth + 'cqw',
        }"
      >
        <li
          v-for="(item, i) in hourArray"
          :key="i"
          :style="{
            fontSize: (slideTxtFontSize > 4 ? '3.5' : slideTxtFontSize) + 'cqw',
          }"
          class="clockHour"
          @click.stop="getSpecificTime(formatTime(item))"
        >
          {{ formatTime(item) }}:00
        </li>
        <li
          :style="{
            fontSize: (slideTxtFontSize > 4 ? '3.5' : slideTxtFontSize) + 'cqw',
          }"
          class="clockHour"
          @click.stop="getSpecificTime(formatTime(vm.endHour))"
        >
          {{ formatTime(vm.endHour) }}:00
        </li>
      </div>
      <div
        class="slideBar"
        :data-time="doubleBindingData"
        ref="slideBar"
        @click.stop="clickBar"
      ></div>
      <!-- doubleBindingData 放入 data-time 的原因：操作在 get 里面，当接受异步数据的时候，会重新走一次 get，
        这样就需要在页面的某处用到这个。 -->
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from "vue";
// 父子传值
const props = defineProps({
  needHalf: {
    type: Boolean,
    default: false,
  },
});
// 时间条
const slideItem = ref();
// 小滑块
const slideBar = ref();
// 时间变量
const vm = reactive({
  startHour: 0,
  endHour: 24,
});
// 定义小时数组
let hourArray = ref([]);
for (let i = 0; i < vm.endHour - vm.startHour; i++) {
  hourArray.value.push(vm.startHour + i);
}
onMounted(() => {
  mainingful();
  timeToPosition(doubleBindingData.value);
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
// 获取点击任意位置，根据位置求取时间
const getSlidePosition = (e) => {
  const sumWidth =
    window.getComputedStyle(slideItem.value).width.replace("px", "") - 0; // slide总长度(px)
  let offsetPosition = e.layerX; // 鼠标点击的当前的修正位置
  if (e.layerX < 0) {
    offsetPosition = 0;
  } else if (e.layerX >= sumWidth) {
    offsetPosition = sumWidth;
  }
  slideBar.value.style.left =
    (offsetPosition / (sumWidth / (vm.endHour - vm.startHour))) *
      1 *
      slideItemWidth.value -
    0.8 +
    "cqw";
  // 根据位置获取时间
  const minusTime = vm.endHour - vm.startHour;
  let currentHour = ~~((offsetPosition / sumWidth) * minusTime) + vm.startHour;
  let currentMinute = Math.round(
    (offsetPosition / sumWidth) * minusTime * 60 -
      (currentHour - vm.startHour) * 60
  );
  if (currentMinute >= 60) {
    currentMinute = 0;
    currentHour++;
  }
  if (!props.needHalf) {
    // 取整点
    // 滑块位置，在 set 里面已经写过
    // 显示时间
    doubleBindingData.value = [
      formatTime(currentHour),
      formatTime(currentMinute),
    ];
    // console.log("currentH, currentMinutes :>> ", currentHour, currentMinute);
    // console.log("当前点击位置 px ======>", offsetPosition);
    // console.log("当前总长度 px =======>", sumWidth);
  } else {
    // 可以取半点
    // console.log([currentHour, currentMinute]);
    // (sumWidth / (vm.endHour - vm.startHour)) 是小块的宽度(px)
    if (e.offsetX < (sumWidth / (vm.endHour - vm.startHour)) * 0.25) {
      // 向下取整
      console.log("向下取整参数===》", e.offsetX);
      // 滑块位置，在 set 里面已经写过
      // 显示时间
      doubleBindingData.value = [formatTime(currentHour), "00"];
    } else if (e.offsetX >= (sumWidth / (vm.endHour - vm.startHour)) * 0.75) {
      console.log("向上取整", e.offsetX);
      // 向上取整
      // 滑块位置，在 set 里面已经写过
      // 显示时间
      doubleBindingData.value = [formatTime(currentHour + 1), "00"];
    } else {
      console.log("取半点", e.offsetX);
      // 取半点
      // 滑块位置，在 set 里面已经写过
      // 显示时间
      doubleBindingData.value = [formatTime(currentHour), "30"];
    }
  }
};
// 点击小滑块
const clickBar = (e) => {
  // console.log(e);
};
// 点击数字，获取具体时间
const getSpecificTime = (times) => {
  doubleBindingData.value = [times, "00"];
  // 这句话代表了当前是多少个小区间宽度 slideItemWidth.value
  slideBar.value.style.left =
    (times * 1 - vm.startHour) * 1 * slideItemWidth.value - 0.8 + "cqw";
};
// 根据时间反求位置
const timeToPosition = (timeArr) => {
  if (slideItem.value) {
    const currentSumTime = timeArr[0] * 60 + timeArr[1] * 1 - vm.startHour * 60;
    const timeRatio = currentSumTime / (1 * 60); // 比例，相当于过了多少个 60 分钟
    // console.log("过了几个区间 :>> ", timeRatio);
    slideBar.value.style.left =
      timeRatio * 1 * slideItemWidth.value - 0.8 + "cqw";
  }
};

// 双向绑定
const doubleBindingData = defineModel(
  "timeArray",
  {
    set(v) {
      // 用来检查双向绑定值，以及子组件内改变的时候，执行的逻辑
      timeToPosition(v);
      console.log("set---", v);
      return v;
    },
    get(val) {
      // 用来初始状态下的检查，以及获取父组件传值的时候执行的逻辑
      // console.log(1111111111111);
      console.log("get--", val);
      if (val.length === 2) {
        if (val[0] < 0) {
          val[0] = 0;
        }
        if (val[0] > 24) {
          val[0] = 24;
        }
        if (val[1] < 0) {
          val[1] = 0;
        }
        if (val[1] > 60) {
          val[0]++;
          val[1] = 0;
        }
        timeToPosition(val);
        val[0] = betterHour(val[0]);
        val[1] = betterMin(val[1]);
      }
      return val;
    },
  },
  {
    type: Array,
    default: () => [],
  }
);

// 处理小于 10 的情况，子组件中的时间优化函数
const formatTime = (param) => {
  if (param >= 60) {
    param = 0;
  }
  return param >= 10 ? param : "0" + param;
};

// 双向绑定中的时间优化函数
const betterHour = (h) => {
  // console.log(h);
  const numH = h * 1;
  let preH = "";
  preH = numH >= 24 ? 24 : numH;
  return preH >= 10 ? preH : "0" + preH;
};
const betterMin = (m) => {
  // console.log(m);
  const numM = m * 1;
  let preM = "";
  preM = numM >= 60 ? 60 : numM;
  return preM >= 10 ? preM : "0" + preM;
};

// 含义
const mainingful = () => {
  if (vm.endHour < vm.startHour) {
    throw new Error("开始时间需要大于结束时间！");
  }
  if (vm.startHour < 0) {
    throw new Error("开始时间要大于等于 0 点！");
  }
  if (vm.endHour > 24) {
    throw new Error("结束时间要小于等于 24 点！");
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  border: 1px solid;
  position: relative;
  padding: 0 8%;
  min-width: 300px;
  min-height: 80px;
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
        // position: relative;
        display: flex;
        align-items: end;
        .halfBlockLeft {
          width: 50%;
          height: 70%;
          border-right: 1px solid rgb(103, 125, 248);
        }
        .halfBlockRight {
          width: 50%;
          height: 70%;
        }
      }
    }
    .slideText {
      // width: 100%;
      height: 20px;
      display: flex;
      justify-content: space-between;
      // gap: 0.8cqw;
      // margin-left: -0.3cqw;
      li {
        width: 10cqw;
        height: 20px;
        font-size: 8.4px;
        line-height: calc(20px + 0.3cpw);
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
