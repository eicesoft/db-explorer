<template>
  <svg :style="styleVars" :class="{ 'icon-run': animation }" class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconHref"></use>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import '~/assets/iconfont/iconfont.js';

  const props = defineProps({
    size: {
      type: Number,
      default: 18,
    },
    icon: {
      type: String,
    },
    animation: {
      type: Boolean,
      default: false,
    },
  });

  const iconHref = computed(() => {
    return '#icon-' + props.icon;
  });

  const styleVars = computed(() => {
    return {
      width: props.size + 'px',
      height: props.size + 'px',
    };
  });
</script>

<style lang="less" scoped>
  .svg-icon {
    cursor: pointer;
    fill: currentColor;
  }
  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25% {
      -webkit-transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    75% {
      -webkit-transform: rotate(270deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  .icon-run {
    animation: rotate 1.5s linear infinite;
  }
</style>
