<template>
    <div>
        <!--
        <input :value="value" @input="emitChange('input',$event)" v-on:blur="emitChange('blur',$event)" style="border:1px solid red"/>
        -->
        <div ref="inputDiv" contenteditable="true" @input="emitChange('input',$event)" v-on:blur="emitChange('blur',$event)" style="border:1px solid red">
            {{value}}
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
//import {cleanCopy} from '../helpers.js'
export default {
    components: {  },
    props: {
        value: [String,Number]
    },
    data: function () {
        return {
            internalValue: this.value
        }
    },
    watch:{
        value(){
            this.$refs.inputDiv.innerHTML = this.value
        }
    },
    computed : {
    },
    methods: {
        emitChange (eventType,event) {
            const val = event.target.innerHTML
            , div = $('<div/>').html(val).text()
            console.log(val)
            this.$emit(eventType,div)
        }
    }
    , beforeUpdate(){
    }
  }
</script>

<style scoped>
</style>