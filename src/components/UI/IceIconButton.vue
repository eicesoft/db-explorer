<template>
  <div
    @click.stop="($event) => clickHandler($event)"
    :class="{ 'button-disabled': disabled, divider: isDivider }"
    class="ice-icon-button"
    ><IceIcon :icon="icon" :size="size" />
  </div>
</template>

<script lang="ts" setup>
  interface CompProp {
    size: number;
    icon: string;
    isDivider?: boolean;
    disabled?: boolean;
  }
  const emit = defineEmits<{
    (e: 'click', evt: any): void;
  }>();

  const props = withDefaults(defineProps<CompProp>(), { size: 18, disabled: false, isDivider: false });
  const clickHandler = (evt: any) => {
    console.log('icon-button-click');
    if (!props.disabled) {
      emit('click', evt);
    } else {
      evt.stopPropagation();
    }
  };
</script>

<style lang="less" scoped>
  .ice-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ebebeb;
    border: 0px;
    &:hover {
      color: #6eadff;
      background-color: #dfdfdf;
    }
  }
  .button-disabled {
    cursor: not-allowed;
    color: #dadada;
    &:hover {
      color: #dadada;
      background-color: #ebebeb;
    }
  }
  .divider {
    border-right: 1px solid #dadada;
  }
</style>
