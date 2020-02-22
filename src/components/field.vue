<template>
    <div ref="container" style="">
        <textarea class="form-control" style="height:100%; width: 100%; resize: none; font-size:11px" @keyup="internalValue.text = $event.target.value;emitContent()" @focus="openContext($event)" @blur="closeContext()">{{internalValue.text}}</textarea>
    </div>
</template>
<script>
export default {
    components: {  },
    props: {
        keyName: String,
        value: Object,
        type: String,
        singlecheck: Boolean
    },
    data() {
        return {
            internalValue: this.value
        }
    },
    computed: {
    },
    watch: {
        value(val,oldVal){
            this.internalValue = val
        }
    },
    methods: {
        openContext(event) {
            window.contextList.openContext(this.keyName,$(event.target),this.internalValue.value,this.type,this.contextListCheckClick,false,this.singlecheck)
        },
        closeContext(event){
            window.contextList.closeContext()
        },
        contextListCheckClick(checkedRows){
            //console.log(checkedRows)
            var text, value
            if ( checkedRows.map ) { //Es lista desplegable
                const row = checkedRows[0]
                text = JSON.stringify ( checkedRows.map ( row => row[Object.keys(row)[1]] ) )
                value = row[Object.keys(row)[0]]
            } else { //Es valor de texto plano
                text = checkedRows
                value = checkedRows
            }
            this.internalValue.text = text
            this.internalValue.value = value
            this.emitContent()
            //this.emitParameters()
        },
        emitContent() {
            
            this.$emit('input',JSON.cc(this.internalValue))
        }
    }
}
</script>