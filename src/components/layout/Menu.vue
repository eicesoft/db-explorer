<template>
  <div class="caption-title">
    <div class="menu">
      <div>File</div>
      <div>Edit</div>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: { type: String, default: 'SQL Explorer' },
  });
</script>

<style lang="scss" scoped>
  $menuBackColor: #2f3241;
  $menuColor: #ccdbfd;
  .caption-title {
    display: flex;
    app-region: drag;
    -webkit-app-region: drag;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    background-color: $menuBackColor;
    color: $menuColor;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    user-select: none;
    .menu {
      display: flex;
      div {
        margin: 0 8px;
      }
    }
    .title {
      width: 80%;
      text-align: center;
    }
  }
</style>
