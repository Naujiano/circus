<template>
    <div ref="contextList"
        id="circusContextList"
        :style="{
            'max-height':'300px',
            border:'0px solid #ddd',
            'border-width':'1px',
            position:'absolute',
            //width: 0,
            //height:'100%',
            //overflow:'visible',
            'z-index':50000,
            left:left+'px',
            top:top+'px',
            display:'none',
            background: '#f2f2f2',
            'box-sizing':'border-box',
            background:'#f2f2f2',
            height:'auto'
            //float:'left'
        }"
    >
        <!--<div style="position:absolute;border:1px solid red;min-width:50px;background:#f2f2f2;max-height:300px;">-->
        <div style="clear:both;float:none;width:100%;border:0px solid red;height:21px;padding-top:1px">
            <button @click='contextListButton("empty")' data-help-code="context-list-button-empty" style="float:left">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="50.613px" height="50.613px" viewBox="0 0 50.613 50.613" style="enable-background:new 0 0 50.613 50.613;;zoom:0.6;margin-left:-4px;margin-top:3px"	 xml:space="preserve"><g>	<g>		<g><circle cx="22.724" cy="43.575" r="4.415"/>			<circle cx="41.406" cy="43.63" r="4.415"/>			<path d="M46.707,32.312H20.886L10.549,2.568H2.5c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h4.493L17.33,37.312h29.377				c1.381,0,2.5-1.119,2.5-2.5S48.088,32.312,46.707,32.312z"/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <!--
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 142.916 142.916" style="enable-background:new 0 0 142.916 142.916;zoom:0.6;margin-left:-4px;margin-top:3px"	 xml:space="preserve"><g>	<g>		<path d="M32.901,114.799l-12.015,16.507c-2.375,3.265-1.656,7.835,1.608,10.21c1.301,0.945,2.807,1.4,4.295,1.4			c2.261,0,4.487-1.043,5.917-3.006l12.11-16.638c7.951,4.239,17.019,6.651,26.644,6.651c31.342,0,56.84-25.499,56.84-56.842			c0-15.979-6.636-30.427-17.283-40.764l15.074-20.709c2.375-3.265,1.655-7.834-1.607-10.21c-3.273-2.377-7.84-1.651-10.209,1.608			L99.313,23.562c-8.241-4.655-17.739-7.323-27.856-7.323c-31.343,0-56.842,25.499-56.842,56.841			C14.615,89.557,21.665,104.409,32.901,114.799z M113.682,73.08c0,23.284-18.94,42.226-42.226,42.226			c-6.407,0-12.461-1.477-17.905-4.039l48.729-66.951C109.331,51.864,113.682,61.964,113.682,73.08z M71.457,30.856			c6.901,0,13.403,1.698,19.159,4.646l-49.043,67.381c-7.623-7.643-12.344-18.181-12.344-29.801			C29.232,49.798,48.173,30.856,71.457,30.856z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                -->
            </button>
            <button @click='contextListButton("filled")' style="float:left" data-help-code="context-list-button-filled">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="50.613px" height="50.613px" viewBox="0 0 50.613 50.613" style="enable-background:new 0 0 50.613 50.613;;zoom:0.6;margin-left:-4px;margin-top:3px"	 xml:space="preserve"><g>	<g>		<g>			<path d="M49.569,11.145H20.055c-0.961,0-1.508,0.743-1.223,1.661l4.669,13.677c0.23,0.738,1.044,1.336,1.817,1.336h19.35				c0.773,0,1.586-0.598,1.814-1.336l4.069-14C50.783,11.744,50.344,11.145,49.569,11.145z"/>			<circle cx="22.724" cy="43.575" r="4.415"/>			<circle cx="41.406" cy="43.63" r="4.415"/>			<path d="M46.707,32.312H20.886L10.549,2.568H2.5c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h4.493L17.33,37.312h29.377				c1.381,0,2.5-1.119,2.5-2.5S48.088,32.312,46.707,32.312z"/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <!--
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;;zoom:0.5;margin-left:-4px;margin-top:4px" xml:space="preserve"><path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.169,0-120-53.832-120-120	S83.831,30,150,30s120,53.832,120,120S216.168,270,150,270z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                -->
            </button>
            <!--
            <select
                ref="comparation"
                v-if="type=='date'||type=='number'"
                style="margin-top:1px;margin-left:4px;;border-color:#ccc;float:left;"
                @change="contextListSwitchComparation"
            >
                <option value="0">Rango</option>
                <option value="1">Igual a</option>
            </select>
            -->
            &nbsp;
        </div>
        <SimpleTable
            v-if="type=='list'"
            :rows="rows"
            :hiddenKeys="hiddenKeys"
            :checkable="true"
            :searchable="true"
            :selectable="false"
            :showHeaders="false"
            :checkedRows="checkedRows"
            :singlecheck="singlecheck"
            v-on:rowClick="contextListRowClick"
            v-on:checkClick="contextListCheckClick"
            :searchString="searchString"
        />
        <div
            v-else-if="type=='date'||type=='number'"
            style="width:100%;height:100%;background:white;padding:5px; border:1px solid #ddd"
        >
            <div ref="contextList_rango" style="min-width:100px">
            <label style="font-weight:normal">Desde</label>
            <input class="form-control" @blur="contextListKeyUp()" ref="desde" v-model="leftVal" data-help-code="search-parameter-value">
            <label style="font-weight:normal">Hasta</label>
            <input class="form-control" @blur="contextListKeyUp()" ref="hasta" v-model="rightVal" data-help-code="search-parameter-value">
            </div>
        <!--</div>-->
        </div>
    </div>
</template>
<script>
import SimpleTable from 'D:/data/iis/simple-table/src/components/simple-table.vue'
import * as qe from './query-editor.js';


/*
window.bus.$on('contextListBlur',function(){
    window.contextListFocused = false
})
*/
export default {
    components: { SimpleTable }
    , props: {
    }
    , data() {
        return {
            rows: []
            , hiddenKeys: []
            , top: 400
            , left: 100
            , height: 300
            , checkedRows: []
            , type: "text"
            , comparation: 0
            , leftVal: ""
            , rightVal: ""
            , searchString: ""
        }
    }
    , mounted () {
        window.contextList = this
    }
    , methods: {
        contextListKeyUp(){
            const desde = this.$refs.desde.value
            , hasta = this.$refs.hasta.value
            //, iguala = this.$refs.iguala.value
            //, comparation = this.$refs.comparation.selectedIndex
            let val = ""
            if ( desde != "" && hasta == "" ) val = ">= " + desde
            if ( desde == "" && hasta != "" ) val = "<= " + hasta
            if ( desde != "" && hasta != "" ) {
                if ( desde == hasta )
                    val = "= " + desde
                else
                    val = desde + " - " + hasta
            }
            this.onChange(val)
        },
        contextListButton(option){
            if(option=="empty")this.onChange(`""`)
            if(option=="filled")this.onChange(`_`)
        },
        contextListRowClick(row){
            
        },
        contextListCheckClick(checkedIndexes){
            const checkedRows = JSON.cc(this.rows).filter ( (ele,i) => {
                if ( checkedIndexes.indexOf(i) != -1 ) return true
                return false
            })
            const checkedIds = JSON.stringify(checkedRows.map ( row => row[Object.keys(row)[1]] ))
            this.onChange(checkedRows)
            //this.onChange(checkedRows)
        },      
        updateContext ({searchString}) {
            this.searchString = searchString
        },
        openContext (keyName,$field,val,type,onChange,cb, singlecheck, {dbname,ownername,tablename,fieldname,dbID, searchString} ) {
            this.singlecheck = singlecheck
        	this.contextListFocused = true
            this.searchString = searchString
            this.onChange = (val) => {
                onChange(val)
                setTimeout(this.positionContext,0)
            }
            this.$field = $field
        	const contextList = this
        	const listModel = this.api.getListModel(keyName)
        	if ( listModel ) { 
        		let contextListData, contextListHiddenKeys
        		if ( !listModel.length ) { //Es lista dinámica
                    console.log(dbqParams)
        			const {sqlListGrid,connection} = listModel
        			, sql = sqlListGrid.toLowerCase()
        			, columns = sql.substring ( sql.indexOf('select') + 6, sql.indexOf('from') ).trim().split(",")
        			, schemaSyntax = sql.substring ( sql.indexOf('from') + 4, sql.indexOf('where') ).trim()
        			, whereSyntax = sql.substring ( sql.indexOf('where') + 5, sql.indexOf('order by') ).trim()
        			, orderbyColumns = sql.substring ( sql.indexOf('order by') + 8 ).trim()
        			, dbqParams = {
        				operation: 'select'
        				, columns
        				, schemaSyntax
        				, whereSyntax
        				, orderbyColumns
                        , dbID: connection
        			}
                    console.log(dbqParams)
        			this.api.$dbq ( dbqParams, data => {
        				contextListData = data
        				contextListHiddenKeys = [columns[0]]
        				feedList()
        			})
        		} else { //Es lista estática
        			const data = listModel.map ( ele => ({
        				id: ele[0]
        				, Literal: ele[1]
        			}))
        			contextListData = data
        			contextListHiddenKeys = ['id']
        			feedList()
        		}
        		function feedList() {
        			const top = $field.offset().top + $field.outerHeight()
        			, left = $field.offset().left
                    , checkedRows = getCheckedRowsFromInput(val,contextListData)
                    /*
        			, checkedRows = []
        			let json = false
        			try {
        				const checkedLiterals = JSON.parse ( val )
        				contextListData.forEach ( (row,i) => {
        					if ( checkedLiterals.indexOf(row[Object.keys(row)[1]]) != -1 ) checkedRows.push ( i ) 
        				})
        			} catch (err){ }
                    */
        			contextList.rows = contextListData
        			contextList.hiddenKeys = contextListHiddenKeys
        			contextList.checkedRows = checkedRows
        			open('list')
        		}
        	} else {
        		const parsedHandy = qe.parseHandy ( val )
        		, leftVal = parsedHandy.leftVal
        		, operator = parsedHandy.operator
        		//console.log(parsedHandy)
        		if ( ! operator ) {
        			contextList.leftVal = parsedHandy.val1
        			contextList.rightVal = parsedHandy.val2
        		} else {
        			if ( operator.indexOf ( ">" ) != -1 ) {
        				contextList.leftVal = parsedHandy.val1
        				contextList.rightVal = ""
        			} else if ( operator.indexOf ( "<" ) != -1 ) {
        				contextList.leftVal = ""
        				contextList.rightVal = parsedHandy.val1
        			} else {
        				contextList.leftVal = parsedHandy.val1
        				contextList.rightVal = parsedHandy.val1
        			}
        		}
        		//console.log(type)
        		//contextList.rows = []
                
                if ( type == "text" ) {
                     const dbqParams = {
        				operation: 'request'
        				, sqlSyntax: `SELECT distinct top 20  1 AS _ROW_NUMBER,${fieldname} FROM ${tablename} WHERE ${fieldname} IS NOT NULL AND ${fieldname} <> '' ORDER BY ${fieldname}`
                        , dbID
        			}
                    console.log(dbqParams)
        			this.api.$dbq ( dbqParams, data => {
                    console.log(data)
        				contextList.rows = data
                        contextList.checkedRows = getCheckedRowsFromInput ( val, data )
        				contextList.hiddenKeys = ['_ROW_NUMBER']
        				//feedList()
        			}, true, true)
                    type="list"
                }
                
        		open(type)
        	}
            function getCheckedRowsFromInput ( val, contextListData ) {
        			const checkedRows = []
        			let json = false
        			try {
        				const checkedLiterals = JSON.parse ( val )
        				contextListData.forEach ( (row,i) => {
        					if ( checkedLiterals.indexOf(row[Object.keys(row)[1]]) != -1 ) checkedRows.push ( i ) 
        				})
        			} catch (err){ }
                    return checkedRows
            }
        	function open(type) {
        		const top = $field.offset().top + $field.outerHeight()
        		, left = $field.offset().left
                , $list = $(contextList.$refs.contextList).show()
                //, $detach = $list.detach()
        		contextList.type = type
                //$field.css({'background-color':'red'}).before($list)
                contextList.opened = true
                contextList.positionContext()
                $('body').click(showContext)
        		if ( cb ) cb ( )
        	}
            const that = this
            function showContext (event){
                //return
                const ae = document.activeElement
                , isContextList = $(ae).closest('#circusContextList').length || $(event.target).closest('#circusContextList').length
                if(!isContextList && !that.contextListFocused) {
                    const menu = $(that.$refs.contextList)
                    menu.hide()
                    //$(window).off('click',showContext)
                    contextList.opened = false
                    $('body').off()
                }
            }
        },
        positionContext(event) {
            if ( !contextList.opened || !this.$field ) return
       		const top = this.$field.offset().top + this.$field.outerHeight()
       		, left = this.$field.offset().left
       		contextList.top = top
       		contextList.left = left
            if (!event || !$.contains (event.target,this.$field[0]))return
            const inView= isScrolledIntoView(this.$field,$(event.target))
            if ( !inView )
                $(this.$refs.contextList).hide()
            else 
                $(this.$refs.contextList).show()
            //console.log(inView)
            function isScrolledIntoView($elem,$container) {
                var docViewTop = $container.offset().top //$container.scrollTop();
                var docViewBottom = docViewTop + $container.height();

                var elemTop = $elem.offset().top;
                var elemBottom = elemTop + $elem.height();
//console.log({docViewTop,docViewBottom,elemTop,elemBottom})
                return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
            }
            
        },
        closeContext() {
            this.contextListFocused = false
            //console.log('aa')
            return
            const $aux = $('#contextList_auxiliar')
            const $list = $(contextList.$refs.contextList).hide().detach()
            $('body').append($list)
            //$aux.remove()

        }
    }
}
</script>