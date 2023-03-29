<template>
  <div ref="dialogContainer" class="ice-dialog" :style="cssVars" v-show="visible">
    <div class="ice-dialog-title">
      <div ref="dialogDrag" class="ice-dialog-text">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="ice-dialog-close" @click.stop="close(DialogResult.Close)">
        <IconFont :size="16" type="icon-close" />
      </div>
    </div>

    <div class="ice-dialog-body">
      <slot name="body"></slot>
    </div>

    <div class="ice-dialog-footer">
      <slot name="footer">
        <IceButton @click="close(DialogResult.Enter)" type="primary">确认</IceButton>
        <IceButton @click="close(DialogResult.Cancel)">取消</IceButton>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { Icon } from '@arco-design/web-vue';
  import { getImageRes } from '~/utils/res';
  import { DialogButton, DialogResult } from './dialog';

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });

  interface DialogProp {
    title: string;
    width: string;
    visible: boolean;
    buttons?: DialogButton;
  }

  const props = withDefaults(defineProps<DialogProp>(), {
    title: '',
    width: '40%',
    visible: false,
    buttons: DialogButton.Ok | DialogButton.Cancel,
  });

  const emits = defineEmits<{
    (e: 'close', button: DialogResult, callback?: Function): void;
    (e: 'enter', button: DialogResult, callback?: Function): void;
    (e: 'update:visible', val: boolean): void;
  }>();

  const dialogDrag = ref();
  const dialogContainer = ref();

  const cssVars = computed(() => {
    return {
      width: props.width,
      '--dialogWidth': props.width,
    };
  });

  onMounted(() => {
    const dragArea: HTMLElement = dialogDrag.value;
    if (dragArea !== null) {
      dragArea.onmousedown = function (env) {
        // 兼容event事件
        var env = env || window.event;
        // 获取鼠标的坐标
        var x = env.clientX;
        var y = env.clientY;
        // 获取元素的坐标
        var left = dialogContainer.value.offsetLeft;
        var top = dialogContainer.value.offsetTop;
        // 获取鼠标在元素中的坐标
        var x_left = x - left;
        var y_top = y - top;
        // 鼠标点击后改变颜色
        dialogContainer.value.classList.add('drag');
        // 元素的移动事件函数
        dragArea.onmousemove = function (env) {
          // 兼容event事件
          var env = env || window.event;
          // 获取元素移动时的鼠标的坐标
          var x = env.clientX;
          var y = env.clientY;
          // 元素的移动坐标
          dialogContainer.value.style.left = x - x_left + 'px';
          dialogContainer.value.style.top = y - y_top + 'px';
        };
      };

      dragArea.onmouseup = function () {
        dialogContainer.value.classList.remove('drag');
        // 在鼠标弹出后再次调用元素的鼠标移动事件
        dragArea.onmousemove = function () {};
      };
    }
  });

  const close = (button: DialogResult) => {
    const verification = () => {
      if (button == DialogResult.Cancel) {
        return true;
      } else {
        return false;
      }
    };

    let result = verification();
    if (result) {
      emits('update:visible', false);
      emits('close', button);
    }
  };
</script>

<style lang="less" scoped>
  @border-style1: 1px solid #ececec;
  .drag {
    border: 1px solid #fefefe !important;
    opacity: 0.95;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1) !important;
  }
  .ice-dialog {
    background-color: #fefefe;
    position: fixed;
    top: 20%;
    left: calc((var(--windowWidth) - var(--dialogWidth)) / 2);
    border: @border-style1;
    z-index: 1000;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    .ice-dialog-title {
      display: flex;
      justify-content: space-between;
      user-select: none;
      border-bottom: @border-style1;
      padding: 4px 0px;

      .ice-dialog-text {
        width: calc(100% - 32px);
        cursor: move;
        font-weight: 800;
        font-size: 13px;
      }
      .ice-dialog-close {
        cursor: pointer;
        width: 32px;
        text-align: right;
        margin-right: 8px;
      }
    }

    .ice-dialog-body {
      padding: 12px 0;
    }

    .ice-dialog-footer {
      padding: 8px 0px;
      border-top: @border-style1;
      text-align: center;
    }
  }
</style>
