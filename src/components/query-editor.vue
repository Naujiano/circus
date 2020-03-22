<template>
    
    <div data-component="query-editor" style="">
        <ol style="width:100%" ref="lista">
            <li class="param" v-for="(param,i) in parameters.data" :param="JSON.stringify(param)" :data-active="param._active">
                <span class="grippy"></span>
                <button v-show="admin" @click="deleteParam(i)" class="close closeButton" data-help-code="search-parameter-close"></button>
                <div style="white-space: nowrap;border: 1px solid #ddd;margin:0px 0 0px 0;padding:3px 1px" class="parameter-toolbar">
                <button @click="setNewOrder(i)" data-help-code="search-parameter-order" style="text-transform:;;padding:0;border-left-color:transparent">
                    <!--<svg :style="{transform:`rotate(${param._orderby=='desc'?'90deg':(param._orderby=='asc'?'-90deg':'0deg')})`,height:'8px','margin-bottom':'0px','margin-left':'-2px'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><path :style="{fill:`${param._orderby=='desc'?'blue':(param._orderby=='asc'?'green':'')}`}" d="M36.1 20.2l-29-20C6.8 0 6.4-0.1 6 0.1 5.7 0.3 5.5 0.6 5.5 1v40c0 0.4 0.2 0.7 0.5 0.9 0.1 0.1 0.3 0.1 0.5 0.1 0.2 0 0.4-0.1 0.6-0.2l29-20c0.3-0.2 0.4-0.5 0.4-0.8S36.3 20.4 36.1 20.2z"/></svg>-->
                    <svg v-show="param._orderby!='asc'&&param._orderby!='desc'" :style="{height:'10px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="427.484px" height="427.484px" viewBox="0 0 427.484 427.484" style="enable-background:new 0 0 427.484 427.484;"	 xml:space="preserve"><g>	<path d="M405.943,290.254L302.096,425.338c-1.04,1.354-2.66,2.146-4.374,2.146c-1.702,0-3.321-0.798-4.368-2.146L189.511,290.254		c-0.769-0.993-1.144-2.176-1.144-3.357c0-1.152,0.364-2.329,1.108-3.322c1.499-1.975,4.125-2.707,6.434-1.809l68.76,27.166V21.01		c0-3.047,2.477-5.503,5.515-5.503h55.106c3.038,0,5.509,2.456,5.509,5.503v287.922l68.76-27.166		c2.305-0.898,4.93-0.166,6.419,1.809C407.473,285.561,407.461,288.28,405.943,290.254z M238.012,143.913		c0.744-0.993,1.105-2.167,1.105-3.322c0-1.176-0.379-2.367-1.142-3.36L134.125,2.148C133.081,0.792,131.458,0,129.759,0		c-1.714,0-3.328,0.798-4.377,2.148L21.539,137.23c-1.519,1.969-1.525,4.69-0.03,6.683c1.487,1.968,4.114,2.707,6.419,1.803		l68.766-27.163v287.919c0,3.05,2.462,5.509,5.506,5.509h55.109c3.041,0,5.515-2.459,5.515-5.509V118.552l68.763,27.163		C233.886,146.62,236.51,145.88,238.012,143.913z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> 

                    <svg v-show="param._orderby=='asc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 442.91 442.91" style="enable-background:new 0 0 442.91 442.91;" xml:space="preserve"><g>	<path d="M13.98,196.395c8.45,4.662,19.232,1.457,23.894-6.993l9.907-17.775c0.583,0,1.457,0.291,2.331,0.291h119.469		c0.583,0,1.457,0,2.04,0l8.742,17.483c3.205,6.119,9.324,9.616,15.735,9.616c2.622,0,5.245-0.583,7.867-2.04		c8.742-4.371,11.947-14.861,7.576-23.602L128.495,9.616c-2.914-5.828-8.742-9.324-15.152-9.616c-6.411,0-12.53,3.497-15.735,9.033		l-90.33,163.76C2.616,181.243,5.53,191.733,13.98,196.395z M112.178,54.781l41.668,82.171H66.721L112.178,54.781z M25.635,413.188		l120.052-124.714H38.165c-9.616,0-17.483-7.867-17.483-17.483c0-9.616,7.867-17.483,17.483-17.483h148.608		c6.993,0,13.404,4.079,16.026,10.781c2.622,6.411,1.457,13.987-3.497,18.94L79.251,407.943h107.522		c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483H38.165c-6.993,0-13.404-4.079-16.026-10.781		C19.225,425.718,20.682,418.433,25.635,413.188z M294.586,377.639V84.502c0-9.616,7.867-17.483,17.483-17.483		s17.483,7.867,17.483,17.483V327.52l77.218-97.615c6.119-7.576,16.9-8.742,24.477-2.914c7.576,6.119,8.742,16.901,2.914,24.477		L325.765,388.42c-3.497,4.371-8.45,6.702-13.695,6.702c-2.04,0-3.788-0.291-5.828-0.874		C299.249,391.625,294.586,385.215,294.586,377.639z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="param._orderby=='desc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 440.87 440.87" style="enable-background:new 0 0 440.87 440.87;" xml:space="preserve"><g>	<path d="M19.605,17.483C19.605,7.867,27.473,0,37.089,0h148.608c6.993,0,13.404,4.079,16.026,10.781		c2.622,6.411,1.457,13.987-3.497,18.94L78.174,154.436h107.522c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483		H37.089c-6.993,0-13.404-4.079-16.026-10.781c-2.622-6.411-1.457-13.987,3.497-18.94L144.611,34.967H37.089		C27.473,34.967,19.605,27.099,19.605,17.483z M6.201,414.645l90.33-163.76c3.205-5.536,9.324-9.033,15.735-9.033		c6.411,0,12.238,3.788,15.152,9.616l83.046,163.76c4.371,8.742,0.874,19.232-7.576,23.602c-2.622,1.166-5.245,2.04-7.867,2.04		c-6.411,0-12.53-3.497-15.735-9.616l-8.742-17.483c-0.583,0-1.457,0-2.04,0H48.744c-0.874,0-1.457,0-2.331-0.291l-9.907,17.775		c-4.662,8.45-15.444,11.656-23.894,6.993C4.453,433.585,1.539,423.095,6.201,414.645z M65.645,378.804h86.834l-41.668-82.171		L65.645,378.804z M305.165,385.506c1.748,0.583,3.788,0.874,5.828,0.874c5.245,0,10.199-2.331,13.695-6.702l108.396-136.952		c6.119-7.576,4.662-18.649-2.914-24.477c-7.576-6.119-18.649-4.662-24.477,2.914l-77.218,97.615V75.761		c0-9.616-7.867-17.483-17.483-17.483c-9.616,0-17.483,7.867-17.483,17.483v293.136C293.51,376.473,298.172,382.884,305.165,385.506		z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>               
                </button>
                <button @click="parameters.data[i]._inlist=!param._inlist;emitParameters()" data-help-code="search-parameter-list" style="">
                    <svg v-show="param._inlist" :style="{height:'13px','margin-bottom':'-2px','margin-left':'-2px',fill:'blue'}"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="932.15px" height="932.15px" viewBox="0 0 932.15 932.15" style="enable-background:new 0 0 932.15 932.15;"	 xml:space="preserve"><g>	<path d="M466.075,161.525c-205.6,0-382.8,121.2-464.2,296.1c-2.5,5.3-2.5,11.5,0,16.9c81.4,174.899,258.601,296.1,464.2,296.1		s382.8-121.2,464.2-296.1c2.5-5.3,2.5-11.5,0-16.9C848.875,282.725,671.675,161.525,466.075,161.525z M466.075,676.226		c-116.1,0-210.1-94.101-210.1-210.101c0-116.1,94.1-210.1,210.1-210.1c116.1,0,210.1,94.1,210.1,210.1		S582.075,676.226,466.075,676.226z"/>	<circle cx="466.075" cy="466.025" r="134.5"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="!param._inlist" :style="{height:'13px','margin-bottom':'-2px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 469.44 469.44" style="enable-background:new 0 0 469.44 469.44;" xml:space="preserve"><g>	<g>		<g>			<path d="M231.147,160.373l67.2,67.2l0.32-3.52c0-35.307-28.693-64-64-64L231.147,160.373z"/>			<path d="M234.667,117.387c58.88,0,106.667,47.787,106.667,106.667c0,13.76-2.773,26.88-7.573,38.933l62.4,62.4				c32.213-26.88,57.6-61.653,73.28-101.333c-37.013-93.653-128-160-234.773-160c-29.867,0-58.453,5.333-85.013,14.933l46.08,45.973				C207.787,120.267,220.907,117.387,234.667,117.387z"/>			<path d="M21.333,59.253l48.64,48.64l9.707,9.707C44.48,145.12,16.64,181.707,0,224.053c36.907,93.653,128,160,234.667,160				c33.067,0,64.64-6.4,93.547-18.027l9.067,9.067l62.187,62.293l27.2-27.093L48.533,32.053L21.333,59.253z M139.307,177.12				l32.96,32.96c-0.96,4.587-1.6,9.173-1.6,13.973c0,35.307,28.693,64,64,64c4.8,0,9.387-0.64,13.867-1.6l32.96,32.96				c-14.187,7.04-29.973,11.307-46.827,11.307C175.787,330.72,128,282.933,128,224.053C128,207.2,132.267,191.413,139.307,177.12z"				/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </button>
                <button @click="changeOperator(i)" v-show="param._extended&&param._active" data-help-code="search-parameter-operator" style="width:auto;padding:0 3px" v-html="param.operator=='AND'?'Y':'O'"></button>
                <button v-show="param._active" @click="negateParam(i)" data-help-code="search-parameter-negated" style="padding:0;">
                    <svg :style="{height:'11px','margin-bottom':'-1px','margin-left':'-2px',fill:(param.leftText.toLowerCase().indexOf('not')!=-1?'red':'')}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="46px" height="46px" viewBox="0 0 46 46" style="enable-background:new 0 0 46 46;" xml:space="preserve"><g>	<g>		<path d="M32.294,19H13.706c-2.209,0-4,1.791-4,4s1.791,4,4,4h18.588c2.209,0,4-1.791,4-4S34.503,19,32.294,19z"/>		<path d="M23,0C10.298,0,0,10.298,0,23c0,12.703,10.298,23,23,23s23-10.297,23-23C46,10.298,35.702,0,23,0z M23,40			c-9.374,0-17-7.625-17-17c0-9.373,7.626-17,17-17s17,7.627,17,17C40,32.375,32.374,40,23,40z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </button>
                <!--
                <button v-show="param._active" @click="likeParam(i)" data-help-code="search-parameter-like" style="padding:0;">
                    <svg :style="{height:'11px','margin-bottom':'-1px','margin-left':'-2px',fill:(param.like?'red':'')}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="46px" height="46px" viewBox="0 0 46 46" style="enable-background:new 0 0 46 46;" xml:space="preserve"><g>	<g>		<path d="M32.294,19H13.706c-2.209,0-4,1.791-4,4s1.791,4,4,4h18.588c2.209,0,4-1.791,4-4S34.503,19,32.294,19z"/>		<path d="M23,0C10.298,0,0,10.298,0,23c0,12.703,10.298,23,23,23s23-10.297,23-23C46,10.298,35.702,0,23,0z M23,40			c-9.374,0-17-7.625-17-17c0-9.373,7.626-17,17-17s17,7.627,17,17C40,32.375,32.374,40,23,40z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </button>
                -->
                </div>
                <div v-show="param._active && param._extended" contenteditable="true" class="side-text" v-html="param.leftText" @blur="changeText(i,$event,'leftText')" @keyup="textKeyPress($event,'leftText',i)" data-help-code="search-parameter-parentesis-left" style="font-weight:bold"/>
                <div contenteditable="true" @blur="editAliasName(i,$event)" data-help-code="search-parameter-alias" class="highlight-text highlight-text-strong">{{param.alias}}</div><!--
                -->
                <button @click="activateParam(parameters.data[i],$event);" data-help-code="search-parameter-active" style="padding:0;border:0">
                    <svg v-show="param._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(param._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<path d="M162.5,102.5c0-39.977,32.523-72.5,72.5-72.5s72.5,32.523,72.5,72.5V160h30v-57.5C337.5,45.981,291.519,0,235,0		S132.5,45.981,132.5,102.5V160h30V102.5z"/>	<rect x="77.5" y="190" width="315" height="280"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="!param._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(param._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<rect x="137.5" y="190" width="315" height="280"/>	<path d="M192.5,102.5V160h30v-57.5C222.5,45.981,176.519,0,120,0S17.5,45.981,17.5,102.5V190h30v-87.5		C47.5,62.523,80.023,30,120,30S192.5,62.523,192.5,102.5z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>                </button>
                <div v-show="param._active" @blur="editParameter(i,$event)" @focus="openContext(i,$event,param)" @keyup="positionContext(i,$event,param);" contenteditable="true" data-help-code="search-parameter-value" v-html="valueParam(param)"  class="highlight-text"></div>
                <div v-show="param._active && param._extended" contenteditable="true" class="side-text" v-html="param.rightText" @blur="changeText(i,$event,'rightText')" @keyup="textKeyPress($event,'rightText')" data-help-code="search-parameter-parentesis-right" style="font-weight:bold"/>
                <!--
                <button @click="changeType(i)" v-show="param._extended" data-help-code="search-parameter-datatype" style="width:auto;padding:0 3px;border-width:0 1px 0 0">{{param.data_type}}</button>
                -->
                <button v-show="param._active && admin"  @click="parameters.data[i]._extended=!param._extended;emitParameters()" style="width: 16px;border:0" data-help-code="search-parameter-extend">
                    <div :class="{'arrow-left':param._extended,'arrow-right':!param._extended}" style="display:block;float:left;zoom:0.42;margin-top:10px;margin-left:8px;opacity:0.5"></div>&nbsp;
                </button>
                <div contenteditable="true" @blur="editKeyName(i,$event)" data-help-code="search-parameter-key" v-show="param._extendKey" v-html="param.key"></div>
                <button  @click="parameters.data[i]._extendKey=!param._extendKey;emitParameters()" v-show="param._extended" style="width: 16px;border:0" data-help-code="search-parameter-extend-key">
                    <div :class="{'arrow-left':param._extendKey,'arrow-right':!param._extendKey}" style="display:block;float:left;zoom:0.42;margin-top:10px;margin-left:8px;opacity:0.5"></div>&nbsp;
                </button>
            </li>
        </ol>
    </div>


</template>

<script>
import queryEditor from './query-editor.js'
export default {
    components: { },
    props: {
        params: [Array]
        , dbID: String
    },
    data: function () {
        return {
            admin: this.api.parsedSearch.admin,
            parameters: {data: JSON.cc(this.params)}
            , focusedParamIndex: -1
        }
    },
    watch: {
        params: function (val, oldVal ) {
            //console.log(val)
            const fs = JSON.cc(val)
            Object.keys ( fs ).forEach ( key => {
                fs[key].value = fs[key].value == "%" ? "" : fs[key].value
            })
            //console.log(fs)
            this.parameters.data = fs
        }
    },
    computed : {
        settings() {
            // ATENCIÓN: Misteriosamente, si no defino esta variable 'params' y luego la vuelvo a copiar con JSON.cc al instanciar el Queryeditor, algo se lía y llega mal la información de data_type de los parámetros
            //debugger
            const params = JSON.cc(this.parameters.data)
            const qe = new queryEditor ( JSON.cc(params), this.$store.state.queries )
            const localParams = qe.getParams()
            const sqlSyntax = qe.getSqlSyntax()
            const whereText = qe.getWhereText()
            const orderBy = qe.getOrderBy()
            const columns = qe.getColumns()
            const sett = {sqlSyntax,params,whereText,columns,orderBy}
            return sett
        }
     },
    mounted: function () {
        //jqui.sortable(this.$refs.lista)
        $(this.$refs.lista).sortable({
            handle: 'span'
            , stop: this.sortableStop
            , placeholder: "ui-state-highlight"
        })
     },
    methods: {
        positionContext(i,event,param) {
            window.contextList.positionContext()
            window.contextList.searchString = event.target.innerHTML
            window.contextList.updateContext({searchString:event.target.innerHTML})
            //this.openContext(i,event,param)
            //setEndOfContenteditable(event.target)
            /*
            this.$nextTick ( function setEndOfContenteditable()
            {
                var range,selection,contentEditableElement = event.target
                if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
                {
                    range = document.createRange();//Create a range (a range is a like the selection but invisible)
                    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    selection = window.getSelection();//get the selection object (allows you to change selection)
                    selection.removeAllRanges();//remove any selections already made
                    selection.addRange(range);//make the range you have just created the visible selection
                }
                else if(document.selection)//IE 8 and lower
                { 
                    range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
                    range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    range.select();//Select the range (make it the visible selection
                }
            })
            */

        },
        emitParameters(params) {
            this.$emit('paramUpdate',JSON.cc(this.parameters.data))
        },
        openContext(i,event,param,cbWhenClose) {
            let parVal = param.value
            try {
                const json = JSON.parse ( parVal )
                if ( typeof json == 'object' && !json.length ) { //es select con descripcion. Cancelo la contextList.
                    const sql = json.sql
                    , descripcion = json.descripcion
                    if(cbWhenClose) cbWhenClose()
                    return false
                } 
            } catch ( err ) {  }

            //if ( typeof parVal == 'object' ) parVal = JSON.stringify ( parVal )
            //$(event.target).text(parVal)
            const keyName = param.reference
            , val = $(event.target).text()
            , type = param.data_type
            this.focusedParamIndex = i
            //let [dbname,ownername,tablename,fieldname] = param.reference.split('.')
            const dbname = param.table_catalog
            , ownername = param.table_schema
            , tablename = param.table_name
            , table_config_keyname = param.table_config_keyname
            , fieldname = param.key
            let searchString = val
            , pkName
            //fieldname = param.reference
            //tablename = `${dbname}.${ownername}.${tablename}`
            /*
            let searchString = ""
            try {
                const obj = JSON.parse ( val )
            } catch ( err ) {searchString = val}
            */
            const that = this
            //$("*").css("cursor", "progress");
            const listModel = param.listModel //this.api.getListModel(param)
            //debugger
            pkName = param.table_pkname
                /*
            if ( ! listModel && type=="text" ) {
                window.working(1)
                //debugger
                this.api.getFieldsForTable ( table_config_keyname, function( { fields, identities } ) {
                    pkName = identities[0]
                    //console.log(identities)
                    window.contextList.openContext(keyName,$(event.target),val,type,that.contextListCheckClick,false,false,{pkName,dbname,ownername,tablename,fieldname,dbID:   that.dbID, searchString, cbWhenClose, qeParam: param } )
                    window.working(0)
                } )
            } else {
                window.contextList.openContext(keyName,$(event.target),val,type,that.contextListCheckClick,false,false,{pkName,dbname,ownername,tablename,fieldname,dbID:   that.dbID, searchString, cbWhenClose, qeParam: param } )
            }
                */
            
            window.contextList.openContext(keyName,$(event.target),val,type,that.contextListCheckClick,false,false,{pkName,dbname,ownername,tablename,fieldname,dbID:   that.dbID, searchString, cbWhenClose, qeParam: param } )

        },
        contextListCheckClick(checkedRows,operation,removedLiteral){
            //const removedLiteral = removedElement?removedElement[Object.keys(removedElement)[1]] : ""
            const i = this.focusedParamIndex
            , par = this.parameters.data[i]
            var checkedLiterals
            let newLiteralsArr
            if ( ! par ) return 
            if ( checkedRows.map ) {
                newLiteralsArr = checkedRows.map ( row => row[Object.keys(row)[1]] )
                checkedLiterals = JSON.stringify ( newLiteralsArr )
                try {
                    let arr = JSON.parse ( par.text )
                    , set = new Set ( arr )
                    if ( operation == "add" ) {
                        set = new Set ( arr.concat ( newLiteralsArr ) )
                    } else {
                        set.delete ( removedLiteral )
                    }
                    checkedLiterals = JSON.stringify ( [...set] )
                    //console.log(arr)
                } catch {}
            } else {
                checkedLiterals = checkedRows
            }
            if ( checkedLiterals == "[]" ) checkedLiterals = ""
            //console.log(checkedLiterals)
            par.value = checkedLiterals
            par.text = checkedLiterals
            //return
            //if ( window.contextList.simpleTableSearchString (searchString) )
            //window.contextList.searchString = checkedLiterals
            window.contextList.firstSearchString = checkedLiterals
            //window.contextList.checkedRows = window.contextList.getCheckedRowsFromInput(checkedLiterals,window.contextList.rows) 
            this.emitParameters()
        },
        deleteParam (i) {
            //return
            this.parameters.data.splice(i,1)
            this.emitParameters()
            this.$nextTick(function(){this.$emit('paramDelete',i)})
            
        },
        activateParam (param,event) {
            param._active=!param._active;
            this.emitParameters()
            if ( ! event ) return false
            const $textField = $(event.target).closest('li').find('.highlight-text')//="search-parameter-value"]')
            setTimeout ( ()=>$textField.eq(1).focus(), 100)
        },
        negateParam (i) {
            const param = this.parameters.data[i]
            if(param.leftText.toLowerCase().indexOf('not')!=-1){
                param.leftText=param.leftText.toLowerCase().replace('not','')
            }else{
                param.leftText = 'not' + param.leftText
            }
            this.emitParameters()
        },
        likeParam (i) {
            this.parameters.data[i].like = this.parameters.data[i].like ? ! this.parameters.data[i].like : 1
            this.emitParameters()
        },
        valueParam (param) {
            const val = param.value
            try {
                const json = JSON.parse ( val )
                if ( typeof json == 'object' && !json.length ) { //es select con descripcion
                    const sql = json.sql
                    , descripcion = json.descripcion
                    return descripcion
                } else {
                    return val
                }
            } catch ( err ) { return val }
        },
        setNewOrder(parameterIndex){
            const orders = ['-','asc','desc']
            , order = this.parameters.data[parameterIndex]._orderby
            , actualOrderIndex = orders.indexOf(order) == -1 ? 0 : orders.indexOf(order)
            , nextOrderIndex = (actualOrderIndex+1) > (orders.length-1) ? 0 : (actualOrderIndex+1)
            , newOrder = orders[nextOrderIndex]
            this.parameters.data[parameterIndex]._orderby=newOrder
            this.emitParameters()
            return newOrder
        },
        setQuery (params) {
            //this.clear()
            this.parameters.data = this.parameters.data.concat(params)
            this.emitParameters()
        },
        editKeyName ( i, event ) {
            const parametersCopy = JSON.cc(this.parameters.data)
            parametersCopy[i].key=$(event.target).text()
            this.parameters.data=parametersCopy
            this.emitParameters()
            //this.$emit('paramUpdate',parametersCopy)
        },
        editAliasName ( i, event ) {
            const parametersCopy = JSON.cc(this.parameters.data)
            parametersCopy[i].alias=$(event.target).text()
            this.parameters=Object.assign(this.parameters,{data:parametersCopy})
            this.emitParameters()
            //this.$emit('paramUpdate',parametersCopy)
        },
        sortableStop (event,ui) {
            //const $li = $(ui.item)
            //, $lis = $li.parent().find('li')
            const $lis = $(this.$refs.lista).find('li')
            , params = []
            $lis.each ( function () {
                params.push ( JSON.parse($(this).attr('param')) )
            })
            $(this.$refs.lista).sortable('cancel')
            this.parameters.data = params//_.reverse(params)
            this.emitParameters()
            this.$emit ( 'paramUpdate', 'resorted' )
        },
        filter () {

        },
        formChange(item) {
        },
        editParameter(i,event) {
            const target = event.target
            const newValue = $(target).text()//innerHTML
            const par = this.parameters.data[i]
            par.value = newValue
            par.text = newValue
            //window.bus.$emit('contextListBlur')
            window.contextList.closeContext()
            this.emitParameters()
            //$(target).text(this.valueParam(par))
            //this.$emit('paramUpdate',JSON.cc(this.parameters.data))
        },
        clear(){
            this.parameters.data = []
        },
        changeOperator ( i ) {
            const actualOperator = this.parameters.data[i].operator
            , newOperator = ( actualOperator == 'AND' ? 'OR' : 'AND' )
            this.parameters.data[i].operator = newOperator
            this.emitParameters()
            //this.$emit('paramUpdate',JSON.cc(this.parameters.data))
        },
        changeType ( i ) {
            const actualType = this.parameters.data[i].data_type
            , newType = ( actualType == 'text' ? 'number' : ( actualType == 'number' ? 'date' : 'text' ) )
            this.parameters.data[i].data_type = newType
            this.emitParameters()
            //this.$emit('paramUpdate',JSON.cc(this.parameters.data))
        },
        changeText (i, event, o) {
            const val = $(event.target).text()
            this.parameters.data[i][o] = val
            this.parameters.data[i][o] = val
            this.emitParameters()
            //this.$emit('paramUpdate',JSON.cc(this.parameters.data))
        },
        extendParam(i) {

        },
        textKeyPress (event,o,paramIndex) {
            //return
			const keycode = event.keyCode
            //, val = event.target.value
			, leftValidkeycodesRegExp = new RegExp (/[^not(]/g)
			, rightValidkeycodesRegExp = new RegExp (/[^)]+/g)
			, validkeycodesRegExp = ( o == "leftText" ? leftValidkeycodesRegExp : rightValidkeycodesRegExp )
			, val = $(event.target).text().replace(validkeycodesRegExp,"")
            //event.stopPropagation();
            //this.parameters.data[paramIndex] = Object.assign({},this.parameters.data[paramIndex],{leftText:val})
            if($(event.target).html()!=val)$(event.target).html(val)
            //this.$emit('paramUpdate',JSON.cc(this.parameters.data))
            //event.target.value = val
			//$inp.width($span.width());

        }
    },
    updated () {
        //this.sortableStop()
    }
  }
</script>

<style scoped>
 .ui-state-highlight { height: 1.5em; line-height: 1.2em; }
    button {
        background: transparent;
        border: 0 solid #ddd;
        border-width: 0 0 0 1px;
        cursor: default;
        margin:4px 0 0 0 ;
        outline: none;
        padding: 0px;
        width: 19px;

    }
    button:hover {
        background: #ddd;
    }
    button:focus {
    }
    ol {
        width: 100px;
        list-style:none;
        //background:red;
        margin: 0;
        padding: 0;
    }
    li {
        list-style:none;
        float: left;
        margin: 0;
        padding: 2px;
        border: 1px solid #ddd;
        white-space: nowrap;
        border-radius: 0 10px 10px 0;
        //box-shadow: 0px 0px 2px 0px white;
        //background:white;
        //width: 200px;
    }
    input {
        width: 20px;
    }
    div {
        //float:left;
        display: inline;
        white-space: normal;
    }
    div[contenteditable="true"]:hover{
        border:1px solid #ddd;
    }
    div[contenteditable="true"]{
        border:1px solid transparent;
        //border-width: 0 1px 0 0;
        padding:3px;
        //margin: 0 3px;
        display:inline-block;
        width: auto;
        min-width: 15px;
        //background-color: #ffdf00;
    }
    div[value]{
        //background:#f2f2f2;
    }
    .param:hover {
        background: #fafafa;
    }
    .param {
        margin:4px;
        background:#f2f2f2;
        display:flex;
        align-items:flex-start;
        flex-flow:row wrap;
        position:relative;
        padding-right: 15px;
    }
    .param[data-active]{
        background:white;
        border-color: blue;
        //box-shadow: 1px 1px 2px #ddd;
    }
    .param>* {
        float:left;
        //white-space: nowrap;
    }
    div[contenteditable="true"].side-text {
        border:1px solid #ddd;
    }
    .closeButton {
        top: -3px;
        right: 2px;
        border: 0;
        //float: right;
        cursor: default;
        width: 14px;
        position:absolute;
    }
    .closeButton:hover {
        background: #e26c62;
    }
    .parameter-toolbar button {
        margin-top: -2px
    }
</style>