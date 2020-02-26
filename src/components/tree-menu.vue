<template>
    <div style="width:100%;height:100%;">
        <div v-for="node0 in treedata" class="main-node">
            <div class="label">{{node0.label}}</div>
            <slot v-if="Array.isArray(node0.content)">
                <div v-for="node1 in node0.content" class="node1">
                    {{node1}}
                </div>
            </slot>
            <slot v-else>
            </slot>
        </div>
    </div>
</template>
<script>
export default {
    components: { },
    props: {
        treedata: {
            type: Array
            , required: true
        }
    },
    data: function () {
        return {}
    },
    mounted(){
        console.log(this.treedata)
    }
}
</script>