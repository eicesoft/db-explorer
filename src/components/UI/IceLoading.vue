<template>
  <div v-if="visible" class="loading">
    <IceIcon animation hoverColor="#515151" icon="loading" :size="30" />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="less" scoped>
  .loading {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.3);
    width: var(--bodyWidth);
    height: var(--bodyHeight);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
