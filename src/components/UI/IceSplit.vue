<template>
  <div class="g-split" ref="gSplit">
    <!-- 水平方向 -->
    <div class="horizontal" v-if="showHorizontal">
      <div ref="leftPanel" class="left-panel position" :style="horizontalLeftPanel">
        <slot name="left"></slot>
      </div>
      <div class="horizontal-trigger-panel position" :style="horizontaltriggerPanel" ref="horizontalTriggerPanel">
        <slot name="trigger" v-if="$slots.trigger"></slot>
        <div class="trigger-content-default-wrap" v-else>
          <div class="trigger-content">
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
          </div>
        </div>
      </div>
      <div class="right-panel position" :style="horizontalRightPanel">
        <slot name="right"></slot>
      </div>
    </div>

    <!-- 垂直方向 -->
    <div class="vertical" v-if="showVertical">
      <div class="top-panel position" :style="verticalTopPanel">
        <slot name="top"></slot>
      </div>
      <div class="vertical-trigger-panel position" :style="verticaltriggerPanel" ref="verticalTriggerPanel">
        <!-- 触发拖动的元素可以是默认的，当用户提供了，使用用户的 -->
        <slot name="trigger" v-if="$slots.trigger"></slot>
        <div class="trigger-content-default-wrap" v-else>
          <div class="trigger-content">
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
            <i class="trigger-bar"></i>
          </div>
        </div>
      </div>
      <div class="bottom-panel position" :style="verticalBottomPanel">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick } from 'process';
  import { ref, computed, onMounted } from 'vue';
  interface CompProp {
    value?: number;
    mode?: string;
    min?: number;
    max?: number;
  }
  const emit = defineEmits<{
    (e: 'on-move-start', val: any): void;
    (e: 'on-moving', val: any): void;
    (e: 'on-move-end', val: any, width: any): void;
  }>();

  const props = withDefaults(defineProps<CompProp>(), {
    value: 0.3,
    mode: 'horizontal',
    min: 0.2,
    max: 0.5,
  });

  const gSplit = ref();
  const leftPanel = ref();
  const horizontalTriggerPanel = ref();
  const verticalTriggerPanel = ref();

  const left = ref(props.value * 1);
  const top = ref(props.value * 1);
  const gSplitWidth = ref(0);
  const gSplitHeight = ref(0);
  const horizontalTriggerPanelWidth = ref(0);
  const verticalTriggerPanelHeight = ref(0);

  const showHorizontal = computed(() => {
    return props.mode == 'horizontal';
  });

  const showVertical = computed(() => {
    return props.mode == 'vertical';
  });

  const horizontalLeftPanel = computed(() => {
    return {
      left: 0,
      right: (1 - left.value) * 100 + '%',
    };
  });

  const horizontalRightPanel = computed(() => {
    let leftWidth = left.value * 100;
    // console.log(left.value, horizontalTriggerPanelWidth.value, gSplitWidth.value);
    return {
      left: `calc(${leftWidth}% + 5px)`,
      width: `var(--bodyWidth)`,
    };
  });

  const horizontaltriggerPanel = computed(() => {
    return {
      left: left.value * 100 + '%',
    };
  });

  const verticalTopPanel = computed(() => {
    return {
      top: 0,
      bottom: (1 - top.value) * 100 + '%',
    };
  });

  const verticalBottomPanel = computed(() => {
    return {
      top: (top.value + verticalTriggerPanelHeight.value / gSplitHeight.value) * 100 + '%',
    };
  });

  const verticaltriggerPanel = computed(() => {
    return {
      top: top.value * 100 + '%',
    };
  });

  const preventSelectedOnMouseMove = (e: any) => {
    e.preventDefault();
  };

  const resolveMouseFn = (type = 'horizontal', element: any) => {
    const mousedown = (e: any) => {
      // 禁止页面文字的选中，避免在拖拽过成功出现文字被选中的行为
      document.addEventListener('selectstart', preventSelectedOnMouseMove);
      // 发布开始拖拽事件
      emit('on-move-start', e);
      // 获取鼠标点击的位置距离元素边缘的距离
      const distance = type == 'horizontal' ? e.clientX - element.offsetLeft : e.clientY - element.offsetTop;
      const mousemove = (e: any) => {
        // 发布开始拖拽中事件
        emit('on-moving', e);
        const gSplitSize = type == 'horizontal' ? gSplit.value.clientWidth : gSplit.value.clientHeight;

        if (type == 'horizontal') {
          left.value = (type == 'horizontal' ? e.clientX - distance : e.clientY - distance) / gSplitSize;
          // 控制范围
          if (left.value < props.min) {
            left.value = props.min;
          }
          if (left.value > props.max) {
            left.value = props.max;
          }
          //   console.log(left.value);
        } else {
          top.value = (type == 'horizontal' ? e.clientX - distance : e.clientY - distance) / gSplitSize;
          // 控制范围
          if (top.value < props.min) {
            top.value = props.min;
          }
          if (top.value > props.max) {
            top.value = props.max;
          }
        }
        return false;
      };
      const mouseup = () => {
        // 发布开始拖拽结束事件
        emit('on-move-end', e, leftPanel.value.clientWidth);
        // 释放按下和滑动处理函数以及禁用选中的处理函数
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        document.removeEventListener('selectstart', preventSelectedOnMouseMove);
        return false;
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
      return false;
    };
    element.addEventListener('mousedown', mousedown);
  };

  const bindHorizontalTriggerPanelEvent = () => {
    console.log('bind horizontal');
    resolveMouseFn('horizontal', horizontalTriggerPanel.value);
  };

  const bindVerticalTriggerPanelEvent = () => {
    console.log('bind vertical');

    resolveMouseFn('vertical', verticalTriggerPanel.value);
  };

  //   const gSplitWidth = computed(() => {
  //     return gSplit.value?.clientWidth ?? 0;
  //   });

  const initDom = () => {
    nextTick(() => {
      gSplitWidth.value = gSplit.value.clientWidth;
      gSplitHeight.value = gSplit.value.clientHeight;
      //   console.log(gSplitWidth.value);
      if (props.mode == 'horizontal') {
        horizontalTriggerPanelWidth.value = horizontalTriggerPanel.value.clientWidth;
      } else {
        verticalTriggerPanelHeight.value = verticalTriggerPanel.value.clientHeight;
      }
    });
  };

  const bindEvent = () => {
    if (props.mode) {
      bindHorizontalTriggerPanelEvent();
    } else {
      bindVerticalTriggerPanelEvent();
    }
  };

  onMounted(() => {
    initDom();
    bindEvent();
  });

  const getSideWidth = () => {
    return leftPanel.value.clientWidth;
  };

  defineExpose({
    getSideWidth,
  });
</script>

<style lang="less" scoped>
  @sideWidth: 5px;
  .g-split {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .position {
      position: absolute;
    }
    .horizontal {
      position: relative;
      height: 100%;
      .left-panel {
        height: 100%;
      }
      .right-panel {
        height: 100%;
      }
      .horizontal-trigger-panel {
        cursor: col-resize;

        height: 100%;
        .trigger-content-default-wrap {
          background-color: #f8f8f9;
          height: 100%;
          position: relative;
          width: @sideWidth;
          background-color: #e9e9e9;
          &:hover {
            background-color: #c9c9c9;
            .trigger-bar {
              background-color: #fcfcfc;
            }
          }
          .trigger-content {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            .trigger-bar {
              width: @sideWidth;
              height: 1px;
              display: block;
              background: rgba(23, 35, 61, 0.25);
              margin-top: 3px;
              &:hover {
                background-color: #fcfcfc;
              }
            }
          }
        }
      }
    }
    .vertical {
      position: relative;
      height: 100%;
      .top-panel {
        width: 100%;
      }
      .bottom-panel {
        width: 100%;
      }
      .vertical-trigger-panel {
        width: 100%;
        .trigger-content-default-wrap {
          width: 100%;
          position: relative;
          height: @sideWidth;
          cursor: row-resize;
          background-color: #f8f8f9;
          .trigger-content {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            height: 100%;
            .trigger-bar {
              width: 1px;
              height: 100%;
              display: inline-block;
              background: rgba(23, 35, 61, 0.25);
              margin-left: 3px;
              vertical-align: top;
            }
          }
        }
      }
    }
  }
</style>
