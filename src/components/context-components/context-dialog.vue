<template>
    <div class="context-dialog-container">
        <component :is="componentName" :componentProps="componentProps"/>
    </div>
</template>
<script>
import Toolbar from '../tool-bar.vue'
import contextFieldEditor from './context-field-editor.vue'
export default {
    components: { Toolbar, contextFieldEditor },
    props: {
        componentName: { type: String , required: true }
        , componentProps: { type: Object , required: false }
    },
    data () {
        return {
        }
    },
    computed: {
        item () {
            const item = this.$store.state.contextMenu.item
            return item ? item : {}
        }
    },
    methods: {
    },
    mounted () {
    }
}
</script>
<style>
    .context-dialog-container {
        position: absolute;
        top: 0;
        left: 0;
        background: white;
        z-index: 100;
        height: 100vh;
        max-height: 100vh;
        border:0px solid gray;
        box-shadow: 2px 2px 15px 5px gray;
    }
</style>