<template>
    <ly flexbox=1>
        <ly v-for="button of buttons" ><button :disabled="button.disabled" @click="onClick(button)" class="btn btn-primary btn-xs" :title="button.title" :data-help-code="button.helpCode" :value="button.label" v-html="button.label" style="border:none;outline:none"></button></ly>
    </ly>
</template>

<script>
import Ly from './layout.vue'

export default {
  props: {
      buttons: {
          type: Array,
          required: true
      }
  },
  methods: {
      onClick (button) {
        button.onClick(button.label)
      }
  },
  components: { Ly }
}
</script>

<style scoped>
    .btn-primary {
        background: #e9e9e9;
        background: transparent;
        border: 0px solid #ddd;
        //border-width: 0 0 0 1px;
        color: #333;
        border-radius: 0;
        min-width:20px;
        min-height:20px;
        height: 24px;
        //box-shadow: 0 -0px 1px #ddd ;
        margin: 0 2px;
        cursor:default;
    }
    .btn-primary:last-child {
        //border-right-width: 1px;
    }
    .btn-primary[disabled] {
        cursor:no-drop;
        background: transparent;
        border: 0px solid #ddd;
    }
    .btn-primary:active {
        background: transparent;
        box-shadow:none;
        //zoom:0.9;
        border: 0px solid transparent;
    }
 
</style>