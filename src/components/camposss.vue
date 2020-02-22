<template>
    
    <div data-component="Campos">
        <div style="width:100%"><Toolbar :buttons="buttons"/></div>
        <div grow=1>
            <ItemList :items="items" :labelKeyName="labelKeyName" :cursor="cursor" :branchs="branchs"  :tabName="tabName" :tabs="tabs" :keysSettings="keysSettings"/>
        </div>
    </div>


</template>

<script>
import {objeto,cleanCopy,log} from '../helpers.js'
import {getTablesRelation,getFieldsForTable} from '../api.js'
import Toolbar from './tool-bar.vue'
import ItemList from './item-list.vue'
export default {
    components: { Toolbar, ItemList },
    data: function () {
        return {
            buttons: [
                {
                    label: "Load",
                    onClick: this.loadFields
                }
            ],
            keysSettings: {
                   label: { readOnly: true },
                   table_catalog: { readOnly: true },
                   table_schema: { readOnly: true },
                   table_name: { readOnly: true },
                   column_name: { readOnly: true },
                   ordinal_position: { readOnly: true },
                   is_nullable: { readOnly: true },
                   data_type: { readOnly: true },
                   CHARACTER_MAXIMUM_LENGTH: { readOnly: true },
                   is_identity: { readOnly: true }
            }
       }
    },
    props: ['items','labelKeyName','cursor','branchs','tabName','tabs','ventana'],
    computed : {
        filterState () {
            const formState = this.formState.data
            , filterState = {}
            Object.keys(formState).forEach ( key => {
                const valor = formState[key]
                if ( valor && valor != "" ) filterState[key] = valor
            })
            return (filterState)
        },
     },
    methods: {
        loadFields () {
            log(this.items)
            getFieldsForTable ( this.ventana.data.table, ( { fields, identities } ) => {
                //log(identities)
                this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            } )
        }
    }
  }
</script>

