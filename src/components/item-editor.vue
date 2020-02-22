<template v-if="false">
    <Tabs :tabs="tabs">
        <Ly v-for="tab in tabs" flexbox=1 column=1 grow=1 :slot="tab">
            <Ly v-for="campo in shallowFields(tab)" v-show="inFilter(campo)" :style="elementStyle(campo)">
                <div>
                    <div v-for="ele in campo.name.split('.')" style="float:left">{{ele}}</div>
                </div>
                <label @click="labelClick($event)">{{campo.name}}</label>
                <select v-if="campo.type=='multiple'" multiple v-model="campo.value" v-on:change="assignModel($event.target,campo,tab)" class="form-control">
                    <option value="">&nbsp;</option>
                    <option v-for="option in listOptions( campo )" :value="option[0]">{{option[1]}}</option>
                </select>
                <select v-else-if="campo.type=='select'" v-model="campo.value" v-on:change="assignModel($event.target.value,campo,tab)" class="form-control">
                    <option/>
                    <option v-for="option in listOptions( campo )" :value="option[0]">{{option[1]}}</option>
                </select>
                <input v-else-if="campo.type=='boolean'" type="checkbox" v-model="campo.value" v-on:change="assignModel($event.target.checked,campo,tab)" class="form-control">
               <input v-else v-model="campo.value" v-on:blur="assignModel($event.target.value,campo,tab)" class="form-control">
                 
            </Ly>
        </Ly>
    </Tabs>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
//import {objeto,JSON.cc,select,log} from '../helpers.js'
import Ly from './layout.vue';
import autosizeTextarea  from './autosize-textarea.vue'
import Tabs  from './tabs.vue'
//Vue.use(VueAutosize)
export default {
    components: { Ly, autosizeTextarea, Tabs },
    props: {
        item: {
            type: Object,
            required: true
        }, 
        branchs: Array,
        lists: Array,
        filter: String,
        keysSettings: Object
    },
    data: function () {
        /*
                const obj = JSON.cc(this.item)
                Object.keys( obj ).forEach ( key => {
                    const val = obj[key]
                    console.log(typeof val+val)
                    if ( typeof val=="object" ) obj[key] = ""
                })
                */
        return {
            validations: {
                label: ( val ) => {
                    return true
                }
            },
            objeto: JSON.cc(this.item)
        }
    },
    watch:{
        item: function (val, oldVal ) { this.objeto = val }
    },
    computed : {
       branchKeys () {
           let branchs = this.branchs
           if ( !branchs ) return []
           branchs = branchs.map ( branch => branch.key )
           return {}
            const branchKeys = Object.keys(this.objeto).filter ( key => ( branchs.indexOf(key) !=-1 && this.objeto[key] && typeof this.objeto[key] == 'object' && typeof this.objeto[key].length == 'undefined' ) )
            return branchKeys//.filter ( key => branchs.indexOf(key) != -1 )
         },
        tabs () {
            return ['main'].concat(this.branchKeys)
        }
    },
    methods: {
        labelClick (event) {
            const $field = $(event.currentTarget).parent()
            this.$emit('clickLabel',$field)
            //console.log($field[0])
        },
        inFilter(campo) {
            if ( !this.filter || this.filter == "" ) return true
            const inFilter = campo.name.toLowerCase().indexOf(this.filter.toLowerCase()) != -1
            return inFilter
        },
        elementStyle(campo) {
            if ( !this.keysSettings ) return {}
            const keySetting = this.keysSettings[campo.name]
            const readOnly = keySetting ? keySetting.readOnly : false
            , zindex = readOnly ? {"z-index" : -1} : {}
            return zindex
        },
        assignModel ( val, campo, tab ) {
            //console.log(val)
            if ( ! this.isContentValid ( val, campo, tab ) ) {
                alert ('El contenido del campo no es valido.')
                return false;
            }
            const value = campo.type == 'multiple' ? new select(val).getValues() : val
            const key = campo.name
            , model = { [key]: value }
            , branch = this.branch(tab) 
            Object.assign ( branch , model )
            
            const formState = JSON.cc(this.objeto)
            Object.keys(formState).forEach ( key => {
                const val = formState[key]
                formState[key] = { value: val, text: this.listTextForValue(val,key)}
            })
            //log(formState)
            this.$emit('change',formState)
            return

            this.$emit('change',JSON.cc(this.objeto))
        },
        isContentValid ( val, campo, tab ) {
            //return true
            const fieldValidation = this.fieldValidation ( campo, tab )
            , isValid = fieldValidation ? fieldValidation ( val ) : true
            return isValid
        },
        branch ( tab ) {
            if ( tab == 'main' ) {
                return this.objeto
            } else {
                return this.objeto[tab]
            }
        },
        shallowFields (tab) {
            const obj = this.branch(tab)
            const shallowKeys = Object.keys(obj).filter ( key => ( obj[key] == null || typeof obj[key] != 'object' || this.listFor(key) ) )
            const shallowFields = shallowKeys.map ( key => {
                const value = JSON.cc(obj[key])
                , name = key
                , type = this.fieldType (key)
                , text = this.listTextForValue ( value , key )
                return ({ name, value, type, text })
            } )//Object.keys(this.objeto).filter ( campo => ( typeof campo[this.valueKeyName] != 'object' || this.isList(campo) ) )
            return shallowFields
        },
        fieldType ( key ) {
            const list = this.listFor ( key )
            if ( list ) { return list.multiple ? 'multiple' : 'select' }
            if ( typeof this.objeto[key] == 'boolean' ) return 'boolean'
            return 'textarea'
        },
        listTextForValue ( val, key ) {
            const list = this.listFor ( key )
            if ( ! list || ! list.values || ! list.values.filter ) return val
            const textArr = list.values.filter ( pair => pair[0] == val )[0]
            const text = textArr ? textArr[1] : false
            //val = typeof val == 'string' ? val : val[1]
            //log(text)
            return text
        },
        listFor ( key ) {
            if ( ! this.keysSettings ) return false
            const keySettings =  this.keysSettings[key]//.filter ( list => list.key == key )[0]
            , keyList = keySettings ? keySettings.list : false
             //console.log( JSON.cc(keyList))
           if ( ! keyList || ! keyList.values.length ) return false
            return keyList
        },
        listOptions ( campo ) {
            const keyName = campo.name
            , options = this.keysSettings[keyName].list.values
            return options
        },
        listFor_old ( key ) {
            if ( ! this.lists ) return false
            const list =  this.lists.filter ( list => list.key == key )[0]
           if ( ! list ) return false
            return list
        },
        listOptions_old ( campo ) {
            const keyName = campo.name
            , options = this.lists.filter ( list => list.key == keyName )[0].values
            return options
        },
        fieldValidation ( campo, tabName ) {
            let validation = false
            if ( tabName == 'main' ) tabName = undefined
            if ( ! tabName ) {
                try {
                    validation = this.validations[campo.name]
                } catch(err) {}
            } else {
                try {
                    validation = this.validations[tabName][campo.name]
                } catch(err) {}
            }
            return validation
        }
    }
    , beforeUpdate(){
        return
        const divs = this.$refs.divinput//$('div.form-control')
        divs.forEach ( div => {
            //div.innerHTML = ""
        })
        //console.log(divs)
    }
  }
</script>

<style scoped>
    .LyItem {
        padding: 2px;
    }
    label {
        font-weight: normal;
    }
    input {
        font-size:11px;
        box-shadow: none;
        border-radius: 2px;
    }
</style>