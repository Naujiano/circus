<template>
    <div class="context-field-edit-list">
        <div class="encabezado">
            <div style="text-transform:uppercase">Cambiar modelo de lista desplegable<br></div>
            <b>{{componentProps.reference}}</b>
        </div>
        <SimpleTable style=""
            ref="simpleTable"
            :rows="rows"
            :hiddenKeys="[]"
            :checkable="true"
            :searchable="true"
            :selectable="false"
            :showHeaders="false"
            :checkedRows="checkedRows"
            :singlecheck="true"
            v-on:rowClick="rowClick"
            v-on:checkClick="checkClick"
            searchString=""
        />
    </div>
</template>
<script>
import SimpleTable from 'D:/data/iis/simple-table/src/components/simple-table.vue'
export default {
    components: { SimpleTable },
    props: {
        componentProps: { type: Object, required: true }
    },
    data () {
        return {
            listsModels : this.$store.state.database.listsModels
            , lists : this.$store.state.database.lists
        }
    },
    computed: {
        rows () {
            const listsModels = this.listsModels
            , rows = Object.keys ( listsModels ).map ( key =>{
                return {nombre:key}
            } )
            return rows
        }
        , checkedRows () {
            const listsModels = this.listsModels
            , lists = this.lists
            , reference = this.componentProps.reference
            , listModelName = lists[reference]
            , checkedRows = []
            Object.keys(listsModels).forEach ( (key,i) => {
                if ( key == listModelName ) checkedRows.push ( i )
            })
            return checkedRows
        }
    },
    methods: {
        rowClick(){},
        checkClick(checklist){
            const  reference = this.componentProps.reference
            let listModelName = false
            if ( checklist.length )
                listModelName = checklist[0].nombre //this.rows[checklist.].nombre
//                debugger

            if ( ! confirm ( 'Asignar modelo de lista\n\n' + reference + ' = ' + listModelName + '\n\nATENCIÓN! Para ver los cambios deberá hacer F5 y luego eliminar y volver a añadir los parámetros que lleven esta configuración.' ) ) {
                this.$refs.simpleTable.reset()
                return false
            } else {
                this.$store.commit ( 'setKey' , {path:['database','lists',`${reference}`],val:listModelName})
                this.api.saveCircusConfig()
                
                window.circus.showHelpBox({title:'Modelo de lista cambiado',text:`Se ha canbiado el modelo de lista asignado al campo ${reference} a ${listModelName}`})
                if ( this.componentProps.cb ) this.componentProps.cb()
            }
        },
    },
    mounted () {
        //console.log(JSON.cc(this.$store.state.database.listsModels))
    }
}
</script>
<style>
    .context-field-edit-list {
        height: ;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .encabezado {
        padding: 5px;
        background: #ddd;
    }
</style>