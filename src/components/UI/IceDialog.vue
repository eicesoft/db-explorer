<template>
  <div ref="dialogContainer" class="ice-dialog" :style="cssVars" v-show="visible">
    <div class="ice-dialog-title">
      <div ref="dialogDrag" class="ice-dialog-text">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="ice-dialog-close" @click.stop="close(DialogResult.Close)">
        <IconFont class="icon" :size="16" type="icon-close" />
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
      let x_left: number, y_top: number;
      const moveHandler = (evt: any) => {
        let x = evt.clientX;
        let y = evt.clientY;
        let offsetLeft = x - x_left;
        let offsetTop = y - y_top;

        if (offsetLeft < 0) {
          offsetLeft = 0;
        }
        if (offsetTop < 36) {
          offsetTop = 36;
        }

        dialogContainer.value.style.left = offsetLeft + 'px';
        dialogContainer.value.style.top = offsetTop + 'px';
      };
      dragArea.onmousedown = function (env: any) {
        let x = env.clientX;
        let y = env.clientY;
        let left = dialogContainer.value.offsetLeft;
        let top = dialogContainer.value.offsetTop;
        x_left = x - left;
        y_top = y - top;
        dialogContainer.value.classList.add('drag');

        dragArea.addEventListener('mousemove', moveHandler);
      };

      dragArea.onmouseup = function () {
        dialogContainer.value.classList.remove('drag');
        // 在鼠标弹出后再次调用元素的鼠标移动事件
        // dragArea.onmousemove = function () { };
        dragArea.removeEventListener('mousemove', moveHandler);
      };
    }
  });

  const close = (button: DialogResult) => {
    const verification = () => {
      if (button == DialogResult.Cancel || button == DialogResult.Close) {
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
  @border-style1: 1px solid #eeeeee;
  @icon-width: 24px;
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
        width: calc(100% - @icon-width);
        cursor: move;
        font-weight: 800;
        font-size: 13px;
        text-align: center;
      }
      .ice-dialog-close {
        cursor: pointer;
        width: @icon-width;
        text-align: right;
        .icon {
          padding: 2px;
          &:hover {
            border-radius: 4px;
            background-color: #e2e2e2;
          }
        }
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
