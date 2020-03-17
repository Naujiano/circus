<template>
    <div class="context-dialog-container">
        <div style="">
            <button v-for="(component,i) in components" @click="showComponent(i)">{{component.componentLabel}}</button>
        </div>
        <div style="min-height:0">
            <component v-for="(component,i) in components" v-if="shownComponentIndex==i" :is="component.componentName" :componentProps="componentProps"/>
        </div>
    </div>
</template>
<script>
import Toolbar from '../tool-bar.vue'
import contextFieldEditList from './context-field-edit-list.vue'
import contextFieldEditKey from './context-field-edit-key.vue'
export default {
    components: { Toolbar, contextFieldEditList, contextFieldEditKey },
    props: {
        components: { type: Array , required: false }
        , componentProps: { type: Object , required: false }
    },
    data () {
        return {
            shownComponentIndex: 0
        }
    },
    computed: {
        item () {
            const item = this.$store.state.contextMenu.item
            return item ? item : {}
        }
    },
    methods: {
        showComponent (i)  {
            this.shownComponentIndex = i
        }
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
        height: 99vh;
        max-height: 100vh;
        border:0px solid red;
        box-shadow: 2px 2px 15px 5px gray;
        display: flex;
        flex-direction: column;
    }
</style>