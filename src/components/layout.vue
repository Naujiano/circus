<template>
  <div :class="itemClasses">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  props:['grow','overflow','breakHeight','flexbox','column','height','shrink','wrap'],
  computed: {
    isContainer () {
      return this.flexbox
    },
    baseClassName () {
      return this.isContainer ? 'LyBox' : 'LyItem'
    },
    itemClasses: function () {
      const baseClassName = this.baseClassName
      , clases = {
        [baseClassName]: 1, 
        [baseClassName+'-grow']: this.grow, 
        [baseClassName+'-overflow']: this.overflow, 
        [baseClassName+'-breakHeight']: this.breakHeight,
        [baseClassName+'-column']: this.column,
        [baseClassName+'-height']: this.height,
        [baseClassName+'-shrink']: this.shrink,
        [baseClassName+'-wrap']: this.wrap
      }
      return clases
    }
  }
}
</script>

<style>
</style>