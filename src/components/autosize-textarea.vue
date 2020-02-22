<template>
    <textarea v-resize>{{valor}}</textarea>
</template>

<script>
import $ from 'jquery'
export default {
  props: ['valor'],
  directives: {
      resize: {
          inserted: function (ele) {
             //ele.style.height = "0px"
             const scrollHeight = ele.scrollHeight
             if ( scrollHeight > 0) {
                 const scrollSize = $(ele).height() + scrollHeight
                 ele.style.height = scrollSize + 'px'
                 console.log(scrollSize)
             }
                //ele.style.height = ele.scrollHeight + 'px'
            // console.log(ele.scrollHeight)
          }
      }
  }
}
</script>

<style>
</style>