<template>
  <div>
    <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 998;"></div>
    <div class="popup" :class="popupClass">
      <div class="head">
        <i class="icon-remove icon-white" @click="onCancelClick"></i>
      </div>
      <div class="text">
        <div v-html="text"></div>
        <div class="buttons">
          <div @click="onConfirmClick" class="btn-sm btn-success" v-html="confirmText"></div>
          <div @click="onCancelClick" class="btn-sm btn-info" style="margin-left:20px;" v-text="cancelText" v-if="cancelText"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['text', 'confirmText', 'cancelText', 'onConfirm', 'onCancel', 'popupClass'],
    methods: {
      onConfirmClick () {
        this.$emit('onConfirm')
      },
      onCancelClick () {
        this.$emit('onCancel')
      }
    }
  }
</script>
<style scoped>
  .popup {
    z-index:999;
  }
</style>
