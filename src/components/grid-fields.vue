<template v-if="false">
<div  ref="tabs">
    <Tabs :tabs="tabs">
        <Ly v-for="tab in tabs" flexbox=1 column=1 grow=1 :slot="tab">
            <Ly v-for="(campo, index) in shallowFields(tab)" v-show="inFilter(fields[index]) && (!verSoloFavoritos || fieldsMap[fields[index].field_full_name].favorite)" :style="elementStyle(campo)" :key="index">
                <table style="white-space:nowrap">
                    <tr @click="addField($event,campo,tab)" style="display:block; margin: 1px 0" :class="{'star-row-favorited':fieldsMap[fields[index].field_full_name].favorite}">
                        <td :class="{'star-row':true}" @click.stop="favorite(campo,index)" style="">
                            <div style="margin-top:-2px">
                                <img src="images/filled-star.svg" class="full-star" style="">
                                <img src="images/empty-star.svg" class="empty-star" style="">
                            </div>
                        </td>
                        <!--<td v-for="ele in campo.name.split('.').slice(0, 3)" v-if="(ele!='dbo')&&showPath" @dblclick="editFieldName($event.target)" @blur="saveFieldName($event.target,campo.name)"  class="highlight-text">{{ele}}</td>-->
                        <td v-if ="showPath" class="highlight-text">{{fields[index].table_alias}}</td>
                        <td @dblclick="editFieldName($event.target)" @blur="saveFieldName($event.target,campo.name)" v-html="fields[index].label"  class="highlight-text highlight-text-strong" style=""></td>
                    </tr>
                </table>
                <!--
                <label @click="labelClick($event)" v-html="api.getLiteral(campo.name)" @dblclick="editFieldName($event.target)" @blur="saveFieldName($event.target,campo.name)" style="white-space:nowrap"></label>
                -->
                <select v-if="campo.type=='multiple'" :id="campo.name" multiple v-model="campo.value" v-on:change="assignModel($event,campo,tab)" class="form-control">
                    <option value="">&nbsp;</option>
                    <option v-for="option in listOptions( campo )" :value="option[0]">{{option[1]}}</option>
                </select>
                <select v-else-if="campo.type=='select'" :id="campo.name" v-model="campo.value" v-on:change="assignModel($event,campo,tab)" class="form-control">
                    <option/>
                    <option v-for="option in listOptions( campo )" :value="option[0]">{{option[1]}}</option>
                </select>
                <input v-else-if="campo.type=='boolean'" :id="campo.name" type="checkbox" v-model="campo.value" v-on:change="assignModel($event,campo,tab)" class="form-control">
               <textarea v-else v-model="campo.value" v-show="showFields" :title="campo.value" :id="campo.name" v-on:blur="assignModel($event,campo,tab)" class="form-control" @focus="focusTextField($event,campo)" data-help-code="search-parameter-value" style="height:24px;resize:none;border-radius: 5px; background: #eee"/>
                 
            </Ly>
        </Ly>
    </Tabs>
    </div>
</template>

<script>
import Vue from 'vue'
//import $ from 'jquery'
//import {objeto,JSON.cc,select} from '../helpers.js'
import Ly from './layout.vue';
//import autosizeTextarea  from './autosize-textarea.vue'
import Tabs  from './tabs.vue'
//Vue.use(VueAutosize)
export default {
    components: { Ly, Tabs },
    props: {
        item: {
            type: Object,
            required: true
        }, 
        branchs: Array,
        lists: Array,
        filter: String,
        keysSettings: Object,
        showFields: Boolean,
        showPath: Boolean,
        ventana: Object,
        verSoloFavoritos: Boolean,
        fields: Array
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
        item: function (val, oldVal ) { 
            this.objeto = val 
            //console.log('aa')
            //return
            $(this.$refs.tabs).find('textarea').css ({ height:'24px' })
        }
        , filter: function (val, oldVal ) { 
            //const fields = this.shallowFields('main').filter ( field => {
            const fields = this.fields.filter ( field => {
                return this.inFilter(field)
            })
            this.$emit('filter',fields.length)
         }
    },
    computed : {
        fieldsMap () {
            return this.$store.state.fieldsMap
        },
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
        addField (event,campo,tab) {
//            const campoKey = campo.name
            const formState = this.objeto//JSON.cc(this.objeto)
            Object.keys(formState).forEach ( key => {
                formState[key] = ''
            })
            //this.$emit('change',JSON.cc(formState))
            this.assignModel({target:{value:"%"}},campo,tab)
            //console.log(campo)
            //console.log(campoKey)
            
            this.$emit('addField',campo)
        },
        saveFieldName(target,key){
            this.$store.commit ( 'database_setLiteral' , {key,literal:$(target).text()} )
            $(target).attr('contenteditable',false)
        },
        editFieldName(target){
            $(target).attr('contenteditable',true).focus()
        },
        focusTextField(event,campo){
           if ( event.target.value=='' ) this.objeto[campo.name]='%'
           event.target.select()
           this.utils.setTextareaHeight(event.target)
            this.$emit('focusField',$(event.currentTarget))
        },
        labelClick (event) {
            return false // desactivo esta funcionalidad de momento para no confundir (es la de anidar vistas)
            const $field = $(event.currentTarget).parent()
            this.$emit('clickLabel',$field)
            //console.log($field[0])
        },
        inFilter(campo) {
            if ( !this.filter || this.filter == "" ) return true
            const re = new RegExp ( this.filter.toLowerCase(), 'gi' )
            /*
            , matches = this.api.getLiteral(campo.name).toLowerCase().match (re)
            , matches2 = campo.name.toLowerCase().match (re)
            */
            , matches = campo.label.toLowerCase().match (re)
            , matches2 = campo.label.toLowerCase().match (re)
            , inFilter = ( matches != null || matches2 != null )
            //const inFilter = campo.name.toLowerCase().indexOf(this.filter.toLowerCase()) != -1
            return inFilter
        },
        elementStyle(campo) {
            if ( !this.keysSettings ) return {}
            const keySetting = this.keysSettings[campo.name]
            const readOnly = keySetting ? keySetting.readOnly : false
            , zindex = readOnly ? {"z-index" : -1} : {}
            return zindex
        },
        assignModel ( event, campo, tab ) {
            const val = event.target.value
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
            this.utils.setTextareaHeight(event.target)
            this.$emit('change',formState)
            window.contextList.positionContext()
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
            if ( list ) { return list.multiple ? 'multiple' : 'textarea' } // Me salto mi mecanismo de listas convencionales para trabajar con las nuevas multiselec. if ( list ) { return list.multiple ? 'multiple' : 'select' }
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
        },
        favorite ( campo, index ) {
            let fieldConfig = JSON.cc(this.ventana.data.fields[index])
            this.$store.commit ( 'set_favoriteToField', fieldConfig )
            //debugger
            //window.commit ( 'set_favoriteToField', { tableKeyName: fieldConfig.table_config_keyname, fieldName: fieldConfig.column_name } )
        }
    }
    , beforeUpdate(){
        //console.log(shownNumber)
    }
    , updated() {
    }
  }
</script>

<style scoped>
    .LyItem {
        padding: 2px;
    }
    label {
        font-weight: normal;
        margin:0;
        padding:0 0 1px 0;
        color: #666;
    }
    input,select,textarea {
        font-size:11px;
        box-shadow: none;
        border-radius: 2px;
        //background: #f8f8f8;
    }
    /*
    */
</style>    