<template>
        <Ly flexbox=1 column=1 grow=1 height=1 data-component="Listado" class="qe" style="padding:0" ref="listado">
            <div style="position:absolute;top:0;left:0;width:5px;height:100vh;background:transparent;z-index:1000" onmouseover="window.showForm()"></div>
            <div style="position:absolute;bottom:2px;left:0;width:100vw;height:4px;background:transparent;z-index:1000" onmouseover="window.showQueries()"></div>
            <Series :operation="series.operation" :fields="series_parameters" ref="popup" @operate="operate_serie"/>
            <div style="width:100%;display:block;min-height:31px;padding: 1px 0;background:#f4f4f4;margin:0">
                <div style="float:left;display:block;padding:3px; width: 450px;" ref="toolbar">
                    <Toolbar :buttons="admin?buttons:buttonsUser" style="float:left"/>
                    <div v-show="admin" style="border:0px solid lightgray; border-width: 0px 1px; float:left; margin-top:-8px; width: 150px">
                        <span style="font-size:9px;width:100%;float:left;text-align:center">Series</span>
                    <select class="form-control" style="width:auto; margin-top: -0px; font-size: 11px; float:left;margin-left:10px" @change="series.operation=$event.target.value"  data-help-code="list-toolbar-series-operation">
                        <option value="Sobreescribir">Sobreescribir</option>
                        <option value="Vaciar">Vaciar</option>
                    </select>
                    <button class="btn btn-primary btn-xs" data-help-code="list-toolbar-series-run" style="background:transparent;border:0; float:left; outline: none; box-shadow:none" @click="open_serie($event)"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
			<path d="M0,128C0,57.3,57.3,0,128,0s128,57.3,128,128s-57.3,128-128,128S0,198.7,0,128z M172.8,68.3c1.2-10.2-6.8-19.1-17.1-19.1
				c-8.7,0-16.1,6.6-17.1,15.2c-0.5,4.6,0.8,9.1,3.6,12.7C151.6,88.9,171,83.6,172.8,68.3z M78.3,207.2c3.3-2.5,3.5-3.7,12.2-18.6
				c0,0,0-0.1,0.1-0.1c0,0,0,0-0.1,0c4.5-7.7,10.5-18.2,19.1-32.7c0.7,0.4,14.2,6,19.9,9.7c-6.5,4-15.1,9.6-21.3,13.4
				c-10,6-4.4,18.7,4.1,18c4.1-0.3,4.9-1.2,20.4-8.9c7.3-3.6,14.8-7.3,20.7-10.9c4.9-2.9,10.9-12.3,3.3-18.9L133.1,142
				c5.9-11.3,11.6-21.7,17.4-31.8c19.8,5.7,40.1-0.7,55.2-21.7c5.7-7.9,1.2-15.2-5.1-15.2c-10.4,0-10.2,17.3-32.7,17.3
				c-10.7,0-18.5-4.3-28.1-10C118,67.5,90,76.3,75.9,96.1c-8.5,11.8,4.5,22.6,12.8,11c7.8-10.9,17.6-15,29.1-12
				c-5.2,9.1-52.1,97.7-52.8,99.3C59.9,204.8,71.5,212.3,78.3,207.2z"></path>
			</svg></button>
                    </div>
                </div>
                <div style="float:right;display:block;">{{grid.loadedRecsNumber}}/{{grid.rowCount}}</div>
            </div>
            <div style="position:relative;border:0px solid red;max-height:80%;border:0 solid #ddd;border-width:0px 0 1px 0;margin-top:5px;margin-left:-5px;width:calc(100% + 10px)" class="bgqe" ref="qeContainer">
                <div v-show="show.queryEditor" class="" style="height:100%;overflow:auto;padding:5px 0;min-height:47px">
                    <Queryeditor ref="qe" :params="qeParams" @paramUpdate="qeParamUpdate" :dbID="api.getTableConnectionId(ventana.data.table)"/>
                </div>
            </div>
            <div :style="{'width':'100%','min-height':'50px','overflow':'hidden','border':'0px solid red','position':'relative'}">
            <!--
                <div style="float:left;height:15px;width:14px;padding:0px 0 0 1px;border:0px solid red;position:absolute;z-index:2;"><button data-help-code="list-distinct" title="Funciones" @click="set_distinct()" :style="{'background':distinct?'red':''}">/</button></div>
            -->                
                <div ref="computer" style="width: 10000px; height:40px; padding:0 0 0 22px;position:absolute;white-space:nowrap">
                    <div v-for="(col,i) in grid.columns.names" :ref="'computed_'+col.label" class="header-cell" :key="'cont_'+col.label" :type="grid.columns.types[i]">

                        <select style="display:none">
                            <option value="SUM">SUMA</option>
                            <option value="AVG">MEDIA</option>
                            <option value="DISTINCT" selected>MEDIA</option>
                        </select>
                <div style="display:flex; width: 100%;">
                        <div style="border:0px solid red; position:relative;width:40px;float:left">
                                        <button @click="activateParam(i,$event);" data-help-code="search-parameter-active" style="padding:0;border:0;width:20px;height:15px">
                    <svg v-show="qeParams[i]._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(qeParams[i]._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<path d="M162.5,102.5c0-39.977,32.523-72.5,72.5-72.5s72.5,32.523,72.5,72.5V160h30v-57.5C337.5,45.981,291.519,0,235,0		S132.5,45.981,132.5,102.5V160h30V102.5z"/>	<rect x="77.5" y="190" width="315" height="280"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="!qeParams[i]._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(qeParams[i]._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<rect x="137.5" y="190" width="315" height="280"/>	<path d="M192.5,102.5V160h30v-57.5C222.5,45.981,176.519,0,120,0S17.5,45.981,17.5,102.5V190h30v-87.5		C47.5,62.523,80.023,30,120,30S192.5,62.523,192.5,102.5z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>                </button>

                 <button @click="setNewOrder(i)" data-help-code="search-parameter-order" style="text-transform:;;padding:0;border-left-color:transparent;box-shadow:none; border:0;">
                    <!--<svg :style="{transform:`rotate(${param._orderby=='desc'?'90deg':(param._orderby=='asc'?'-90deg':'0deg')})`,height:'8px','margin-bottom':'0px','margin-left':'-2px'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><path :style="{fill:`${param._orderby=='desc'?'blue':(param._orderby=='asc'?'green':'')}`}" d="M36.1 20.2l-29-20C6.8 0 6.4-0.1 6 0.1 5.7 0.3 5.5 0.6 5.5 1v40c0 0.4 0.2 0.7 0.5 0.9 0.1 0.1 0.3 0.1 0.5 0.1 0.2 0 0.4-0.1 0.6-0.2l29-20c0.3-0.2 0.4-0.5 0.4-0.8S36.3 20.4 36.1 20.2z"/></svg>-->
                    <svg v-show="qeParams[i]._orderby!='asc'&&qeParams[i]._orderby!='desc'" :style="{height:'10px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="427.484px" height="427.484px" viewBox="0 0 427.484 427.484" style="enable-background:new 0 0 427.484 427.484;"	 xml:space="preserve"><g>	<path d="M405.943,290.254L302.096,425.338c-1.04,1.354-2.66,2.146-4.374,2.146c-1.702,0-3.321-0.798-4.368-2.146L189.511,290.254		c-0.769-0.993-1.144-2.176-1.144-3.357c0-1.152,0.364-2.329,1.108-3.322c1.499-1.975,4.125-2.707,6.434-1.809l68.76,27.166V21.01		c0-3.047,2.477-5.503,5.515-5.503h55.106c3.038,0,5.509,2.456,5.509,5.503v287.922l68.76-27.166		c2.305-0.898,4.93-0.166,6.419,1.809C407.473,285.561,407.461,288.28,405.943,290.254z M238.012,143.913		c0.744-0.993,1.105-2.167,1.105-3.322c0-1.176-0.379-2.367-1.142-3.36L134.125,2.148C133.081,0.792,131.458,0,129.759,0		c-1.714,0-3.328,0.798-4.377,2.148L21.539,137.23c-1.519,1.969-1.525,4.69-0.03,6.683c1.487,1.968,4.114,2.707,6.419,1.803		l68.766-27.163v287.919c0,3.05,2.462,5.509,5.506,5.509h55.109c3.041,0,5.515-2.459,5.515-5.509V118.552l68.763,27.163		C233.886,146.62,236.51,145.88,238.012,143.913z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> 

                    <svg v-show="qeParams[i]._orderby=='asc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 442.91 442.91" style="enable-background:new 0 0 442.91 442.91;" xml:space="preserve"><g>	<path d="M13.98,196.395c8.45,4.662,19.232,1.457,23.894-6.993l9.907-17.775c0.583,0,1.457,0.291,2.331,0.291h119.469		c0.583,0,1.457,0,2.04,0l8.742,17.483c3.205,6.119,9.324,9.616,15.735,9.616c2.622,0,5.245-0.583,7.867-2.04		c8.742-4.371,11.947-14.861,7.576-23.602L128.495,9.616c-2.914-5.828-8.742-9.324-15.152-9.616c-6.411,0-12.53,3.497-15.735,9.033		l-90.33,163.76C2.616,181.243,5.53,191.733,13.98,196.395z M112.178,54.781l41.668,82.171H66.721L112.178,54.781z M25.635,413.188		l120.052-124.714H38.165c-9.616,0-17.483-7.867-17.483-17.483c0-9.616,7.867-17.483,17.483-17.483h148.608		c6.993,0,13.404,4.079,16.026,10.781c2.622,6.411,1.457,13.987-3.497,18.94L79.251,407.943h107.522		c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483H38.165c-6.993,0-13.404-4.079-16.026-10.781		C19.225,425.718,20.682,418.433,25.635,413.188z M294.586,377.639V84.502c0-9.616,7.867-17.483,17.483-17.483		s17.483,7.867,17.483,17.483V327.52l77.218-97.615c6.119-7.576,16.9-8.742,24.477-2.914c7.576,6.119,8.742,16.901,2.914,24.477		L325.765,388.42c-3.497,4.371-8.45,6.702-13.695,6.702c-2.04,0-3.788-0.291-5.828-0.874		C299.249,391.625,294.586,385.215,294.586,377.639z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="qeParams[i]._orderby=='desc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 440.87 440.87" style="enable-background:new 0 0 440.87 440.87;" xml:space="preserve"><g>	<path d="M19.605,17.483C19.605,7.867,27.473,0,37.089,0h148.608c6.993,0,13.404,4.079,16.026,10.781		c2.622,6.411,1.457,13.987-3.497,18.94L78.174,154.436h107.522c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483		H37.089c-6.993,0-13.404-4.079-16.026-10.781c-2.622-6.411-1.457-13.987,3.497-18.94L144.611,34.967H37.089		C27.473,34.967,19.605,27.099,19.605,17.483z M6.201,414.645l90.33-163.76c3.205-5.536,9.324-9.033,15.735-9.033		c6.411,0,12.238,3.788,15.152,9.616l83.046,163.76c4.371,8.742,0.874,19.232-7.576,23.602c-2.622,1.166-5.245,2.04-7.867,2.04		c-6.411,0-12.53-3.497-15.735-9.616l-8.742-17.483c-0.583,0-1.457,0-2.04,0H48.744c-0.874,0-1.457,0-2.331-0.291l-9.907,17.775		c-4.662,8.45-15.444,11.656-23.894,6.993C4.453,433.585,1.539,423.095,6.201,414.645z M65.645,378.804h86.834l-41.668-82.171		L65.645,378.804z M305.165,385.506c1.748,0.583,3.788,0.874,5.828,0.874c5.245,0,10.199-2.331,13.695-6.702l108.396-136.952		c6.119-7.576,4.662-18.649-2.914-24.477c-7.576-6.119-18.649-4.662-24.477,2.914l-77.218,97.615V75.761		c0-9.616-7.867-17.483-17.483-17.483c-9.616,0-17.483,7.867-17.483,17.483v293.136C293.51,376.473,298.172,382.884,305.165,385.506		z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>               
                </button>

                </div>


            <div style="position:relative;border:1px solid #ddd;padding:1px 4px 0 4px; white-space: nowrap;margin-top:-1px">
                <div style="position:absolute; cursor:pointer; border:0px solid blue; top: 2px;z-index:1000" class="button-operation">
                        <svg title="SUMA" v-show="grid.columns.types[i]=='number'" class="hide" @click="clickFunc('SUM',$event)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 512.002 512.002" style="color:red;zoom:0.6;float:left;margin-top:-2px" xml:space="preserve"><g>	<g>		<path style="background:blue" d="M437.108,74.898c-99.869-99.858-262.345-99.858-362.214,0c-99.858,99.858-99.858,262.34,0,362.203			c49.934,49.929,115.521,74.896,181.107,74.896s131.173-24.967,181.107-74.896C536.966,337.243,536.966,174.762,437.108,74.898z			 M373.067,166.895c0,9.229-7.484,16.707-16.707,16.707s-16.707-7.478-16.707-16.707v-16.826H191.01l77.923,95.294			c5.036,6.15,5.036,14.975,0,21.126l-77.923,95.204h148.643v-16.588c0-9.229,7.484-16.707,16.707-16.707			c9.223,0,16.707,7.478,16.707,16.707v33.414c0,9.229-7.601,16.588-16.824,16.588H155.758c-6.45,0-12.334-3.66-15.098-9.491			c-2.762-5.835-1.926-12.713,2.164-17.705l91.585-111.926L142.825,144.06c-4.09-4.992-4.927-11.959-2.164-17.795			c2.762-5.83,8.648-9.61,15.098-9.61h200.485c9.223,0,16.824,7.597,16.824,16.826V166.895z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <svg title="MEDIA" v-show="grid.columns.types[i]=='number'" @click="clickFunc('AVG',$event)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;zoom:0.6;float:left;margin-top:-2px" class="hide" xml:space="preserve"><g>	<g>		<path d="M155.804,205.902c-27.625,0-50.098,22.473-50.098,50.098s22.473,50.098,50.098,50.098			c28.788,0,52.979-23.076,77.68-50.098C208.782,228.978,184.593,205.902,155.804,205.902z"/>	</g></g><g>	<g>		<path d="M356.196,205.902c-28.788,0-52.979,23.076-77.68,50.098c24.7,27.022,48.891,50.098,77.68,50.098			c27.625,0,50.098-22.473,50.098-50.098S383.821,205.902,356.196,205.902z"/>	</g></g><g>	<g>		<path d="M256,0C114.844,0,0,114.839,0,256s114.844,256,256,256s256-114.839,256-256S397.156,0,256,0z M356.196,339.496			c-41.465,0-71.896-27.919-100.196-58.632c-28.3,30.713-58.73,58.632-100.196,58.632c-46.042,0-83.496-37.454-83.496-83.496			c0-46.042,37.454-83.496,83.496-83.496c41.465,0,71.896,27.919,100.196,58.632c28.3-30.713,58.73-58.632,100.196-58.632			c46.042,0,83.496,37.454,83.496,83.496C439.692,302.042,402.238,339.496,356.196,339.496z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <svg title="Número de valores distintos" @click="clickFunc('DISTINCT',$event)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;;zoom:0.6;float:left;margin-top:-2px" class="" xml:space="preserve"><g>	<g>		<path d="M256,0C114.844,0,0,114.839,0,256s114.844,256,256,256s256-114.839,256-256S397.156,0,256,0z M389.594,317.231H244.592
			l-40.125,90.281c-2.772,6.219-8.872,9.92-15.275,9.92c-2.261,0-4.567-0.468-6.773-1.446c-8.425-3.745-12.221-13.612-8.48-22.043
			l34.094-76.712h-85.627c-9.219,0-16.699-7.475-16.699-16.699c0-9.225,7.48-16.699,16.699-16.699h100.471l29.688-66.797H122.406v0
			c-9.219,0-16.699-7.475-16.699-16.699c0-9.225,7.48-16.699,16.699-16.699h145.002l40.125-90.281
			c3.751-8.42,13.579-12.236,22.049-8.474c8.425,3.745,12.221,13.612,8.48,22.043l-34.094,76.712h85.627
			c9.219,0,16.699,7.475,16.699,16.699s-7.48,16.699-16.699,16.699H289.124l-29.688,66.797h130.159
			c9.219,0,16.699,7.475,16.699,16.699C406.294,309.756,398.813,317.231,389.594,317.231z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <div style="float:none;clear:both"></div>
                    </div>
                        <span style="top:-1px;float:left;padding-left:17px;position:relative"></span>
                        <div style="float:none;clear:both"></div>
            </div>
</div>

                        <div :class="{'search-field':true,'search-field-inactive':qeParams[i]?!qeParams[i]._active:false}" contentEditable="true" @keydown="keyDownSearchField($event,i)" @focus="focusSearchField($event,i)" @blur="focusSearchField($event,i,true)" >{{getParamSearchString(i)}}</div>
                    </div>
                    
                </div>
            </div>
            <Ly grow=1 style="background:;position:relative;padding-top:0px">
                <button v-show="admin" @click="show.queryEditor=!show.queryEditor" style="position:absolute;width:18px;top:2px;right:0px;background:;padding: 3px;z-index:1">
                     <div :class="{'arrow-up':show.queryEditor,'arrow-down':!show.queryEditor}"></div>
                </button>
                <SimpleTable style="background:white" height="100%" :hiddenKeys="['PK_ID']" :rows="grid.rows" overflow="scroll" ref="Tabla" v-on:orderBy="orderBy" v-on:rowClick="rowClick" v-on:checkClick="checkClick" v-on:scrollHeaders="scrollHeaders" v-on:resizeHeaders="resizeHeaders" :checkable="true" :checkedRows="checkedIndexes" v-on:headerClick="headerClick" :selectable="false"/>
            </Ly>
        </Ly>
</template>

<script>
import SimpleTable from 'D:/data/iis/simple-table/src/components/simple-table.vue'
import Ly from './layout.vue'
import ItemEditor from './item-editor.vue'
import Queryeditor  from './query-editor.vue'
import Toolbar from './tool-bar.vue'
import Series from './Series.vue'

export default {
    components: { ItemEditor, SimpleTable, Queryeditor, Toolbar, Ly, Series },
    props: {
        multiline: String,
        ventana: Object,
        filter: Object,
        overflow: Boolean,
        formSetValues: Function,
        keysSettings: Object
    },
    data: function () {
        return {
            series: {
                operation: "sobreescribir"
            },
            checkedIndexes: [],
            admin: this.api.parsedSearch.admin,
            show: {
                queryEditor: true
            },
            buttons: [
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 44 44"><g><circle cx="20" cy="20" r="7"></circle><path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,33.3l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0l-5.4-5.4c-0.2-0.2-0.4-0.2-0.6-0.1-1.7,1.1-3.7,1.7-5.9,1.7-6.1,0-11-4.9-11-11s4.9-11 11-11 11,4.9 11,11c0,2.2-0.6,4.2-1.7,5.9-0.1,0.2-0.1,0.5 0.1,0.6l5.4,5.4c0.3,0.5 0.3,1.1-0.1,1.5z"></path></g></svg>`,
                    onClick: ()=>this.loadPage()
                    , helpCode: "list-toolbar-loadpage"
                },
                {
                    label: `<svg data-help-code="list-toolbar-clear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330.5 330.5"><path d="M178.3 136.6l16.4 16.4 69.7-69.7c2.3-2.3 3.4-5.2 3.4-8.2 0-3-1.1-5.9-3.4-8.2 -4.5-4.5-11.8-4.5-16.4 0L178.3 136.6zM172.3 140.2l-0.7-0.7 -12.4 12.4 -7.7 7.7 20.4 20.4 8.3-8.3 11.8-11.8 -0.9-0.9 -1.2-1.2 -16.4-16.4L172.3 140.2zM66.8 197.2c-0.1 0-0.2 0.1-0.3 0.1 -0.5 0.1-0.9 0.3-1.3 0.6l-0.2 0.1L65 198c-0.5 0.3-0.8 0.7-1.2 1.2 -0.3 0.5-0.6 1-0.8 1.6 -0.5 1.7-0.3 3.7 1.3 4.9 3.8 3 7.7 6 11.6 8.9l0.7-0.3 1.7-0.7L80 213l14.1-5.4 20.6-7.9 -14.3 16.6 -8 9.2 -1.1 1.3 -1.1 1.3 -1.1 1.3c0.8 0.3 1.6 0.4 2.5 0.2 0.5-0.1 1-0.3 1.6-0.5 0.1 0 0.1-0.1 0.2-0.1 0.6-0.3 1.1-0.5 1.7-0.7l3.3 3.3c0 0.8-0.1 1.5-0.1 2.3 -0.1 0.7-0.1 1.5-0.2 2.2 -0.1 1.1-0.3 2.2-0.6 3.3 -0.6 2.5 0.8 5.7 3.5 6.2 4.4 0.9 8 2.4 11.1 4.5 3.5 2.4 6.4 5.4 9.1 9.1 1.3 1.8 2.6 3.6 3.9 5.6 1 1.6 2.6 2.3 4.1 2.3 0.7 0 1.4-0.1 2-0.4 2.4-0.9 4.2-3.4 3.1-6.2l32.3-75.5 -20.2-20.2L66.8 197.2zM165.2 330.5L165.2 330.5C74 330.5 0 256.5 0 165.2v0C0 74 74 0 165.2 0h0c91.3 0 165.2 74 165.2 165.2v0C330.5 256.5 256.5 330.5 165.2 330.5z"/></svg>`,
                    onClick: function () { 
                        if ( ! confirm ( '¿Borrar los parámetros de filtrado?' ) ) return false
                        this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:[]} )
                        this.$refs.qe.clear() 
                    }.bind(this)
                    //, title: "Borrar los parámetros de filtrado"
                },
                {
                    label: `<svg data-help-code="list-toolbar-excel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.5 128h-67.6L256 198.5 208.1 128h-67.6l81.1 121.2L130.1 384h131.1v-45.8h-30.3l25.1-37.5 55.7 83.3h70.2l-91.5-134.8L371.5 128zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0 512 114.6 512 256z"/></svg>`,
                    onClick: function () { this.downloadListAsFile() }.bind(this)
                    //, title: "Obtener un Excel con la totalidad del listado."
                },
                /*
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 44 44" style="transform:rotate(180deg)"><g><circle cx="20" cy="20" r="7"></circle><path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,33.3l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0l-5.4-5.4c-0.2-0.2-0.4-0.2-0.6-0.1-1.7,1.1-3.7,1.7-5.9,1.7-6.1,0-11-4.9-11-11s4.9-11 11-11 11,4.9 11,11c0,2.2-0.6,4.2-1.7,5.9-0.1,0.2-0.1,0.5 0.1,0.6l5.4,5.4c0.3,0.5 0.3,1.1-0.1,1.5z"></path></g></svg>`,
                    onClick: ()=>this.loadPage(1)
                    , helpCode: "list-toolbar-loadall"
                    //, title: "Cargar la totalidad de los registros"
                },
                */
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="transform:rotate(180deg)"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    helpCode:"list-toolbar-loadvista",
                    onClick: function(){
                        const query = this.$store.state.selectedQuery
                        , qeParams = JSON.cc(query.queryEditor.params)
                        let actualQeParams = this.$store.getters.qeParams(this.ventana.index)
                        if ( ! actualQeParams ) actualQeParams = []
                        //this.$refs.qe.setQuery(qeParams)
                        this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:actualQeParams.concat(qeParams)} )
                    }.bind(this)
                    //, title: "Cargar Vista"
                },
                {
                    label: `<svg data-help-code="list-toolbar-savevista" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    //title: "Guardar Vista",
                    onClick: function() { 
                        if ( ! confirm ( '¿Crear una vista con este filtro?' ) ) return false
                        const table = this.ventana.data.table
                        , queryEditor = JSON.cc(this.$refs.qe.settings)//JSON.cc(this.queryEditor)
                        , orderby = JSON.cc(this.orderby)
                        , tablesRelation = this.tablesRelation
                        , joinSyntax = tablesRelation.joinSyntax
                        , uniqueid = new Date().valueOf().toString()
                        , vista = { table, joinSyntax, queryEditor, orderby }
                        this.api.getIdentitiesForTableSet ( table , function( identities ) {
                            vista.identities = identities
                            vista.whereSql = this.grid.whereSql
                            //vista.whereText = this.$refs.qe.queryEditor.getWhereText()
                            //vista.name = this.$refs.qe.settings.whereText
                            vista.name = uniqueid
                            vista.customName = ''//uniqueid
                            vista.tableNames = tablesRelation.names
                            vista.descripcion = ""
                            vista.fecha = this.utils.getSpDate(new Date())
                            vista.tipo = "Normal"
                            this.$store.commit ( 'Query_add' , {query:vista,cb:(recordset)=>{console.log(recordset);window.circus.loadQueries();window.circus.showHelpBox ( {title:'Vista creada',text:'Se ha creado una nueva vista con el filtro actual.'}, true )}} )
                            
                            //this.$store.state.queries.push (vista)
                        }.bind(this))
                     }.bind(this)
                },
                {
                    label: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path d="M256,0C114.844,0,0,114.839,0,256s114.844,256,256,256s256-114.839,256-256S397.156,0,256,0z M146.574,186.42			l139.161-92.308c7.654-5.093,18.025-3.017,23.146,4.686c5.099,7.686,3,18.047-4.686,23.146l-118.177,78.392l118.177,78.392			c7.686,5.099,9.785,15.46,4.686,23.146c-3.219,4.848-8.523,7.469-13.927,7.469c-3.175,0-6.381-0.897-9.219-2.783l-139.161-92.308			c-4.664-3.093-7.469-8.317-7.469-13.916C139.105,194.737,141.911,189.512,146.574,186.42z M356.196,372.895H155.804			c-9.219,0-16.699-7.475-16.699-16.699c0-9.225,7.48-16.699,16.699-16.699h200.391c9.219,0,16.699,7.475,16.699,16.699			C372.895,365.42,365.415,372.895,356.196,372.895z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
                    //, title: "Cargar los parámetros de filtrado en el formulario"
                    , onClick: function() { 
                        const ob =  {}
                        this.$refs.qe.parameters.data.forEach ( par => {
                            const keyName = par.reference
                            , keyValue = par.value
                            ob[keyName] = keyValue
                        })
                        //log(ob)
                        this.formSetValues (ob)
                     }.bind(this)
                    ,helpCode: "list-toolbar-sendtoform"
                }
            ],
            grid: {
                rows: [],
                rowCount: 0,
                page: 0,
                recXPag: 100,
                loadedRecsNumber: 0,
                //rowIds: [],
                whereSql: "",
                selectSql: "",
                columns: {
                    names: []
                    , widths: []
                    , types: []
                }
            },
            queryEditor: {
                params: {}//this.injectedParams
            },
            orderby: {},
            //showComputer: false
            
        }
    },
    watch: {
        filter: function (object, oldVal ) {
            //convierto objeto con campos del formulario a array para el QE.
            //console.log(object)
            const qeParams = Object.keys(object).map ( key => ( Object.assign ( {}, object[key], { 
                key: this.api.getListColumnSql ( key )
                , alias: this.shortAlias ( this.api.getLiteral ( key ) )
                , reference: key
                , operator: "AND"
                , leftText: ""
                , rightText: ""
                , _active: (object[key].value === '%' ? false : true)
                , _inlist: true
                , data_type: this.utils.getBasicDataType(object[key].data_type) 
                , _extended : false
                , _extendKey : false
                , _orderby: '-'
            } ) ))
            qeParams[0].text = ""
            qeParams[0].value = ""
            let actualQeParams = this.$store.getters.qeParams(this.ventana.index)
            if ( ! actualQeParams ) actualQeParams = []
            //const newParams = actualQeParams.concat(qeParams)
            const newParams = qeParams.concat(actualQeParams)
            this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:newParams} )
        }
    },
    computed : {
        series_parameters() {
            const mainTable = this.tablesRelation.joinSyntax.split(" INNER JOIN ")[0]
            , series_parameters = JSON.cc ( this.qeParams.filter(param => {
                const paramKey = param.reference ? param.reference : param.key
                return paramKey.toLowerCase().indexOf(mainTable.toLowerCase()) != -1 
            }))
            //series_parameters.forEach ( param => { param.value = ""; param.text = "" } )
            return series_parameters
        },
        buttonsUser() {
            const buttonsUser = []
            this.buttons.forEach ( (button,i) => {
                if ( i == 0 || i == 2 ) buttonsUser.push ( button )
            })
            return buttonsUser
        },
        distinct: {
            get(){
                const distinct = this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
                return distinct //? distinct : false
            },
           set(v){
                this.$store.commit ( 'set_distinct' , {indexVentana:this.ventana.index, value: v } )
                //this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct = v
            }
        },
        qeParams: {
            get(){
                const params = this.$store.state.ventanas.data[this.ventana.index].queryeditor.parameters
                return params
            },
            set(newParams){
                this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:newParams} )
            }
        },
         columns () {
            const table = this.ventana.data.table
            , fields = this.ventana.data.fields
            , identities = this.ventana.data.identities
            , idField = identities[0]
            , distinct = this.distinct // this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            , columns = distinct ? ['1 as PK_ID'] : [table+'.'+idField+' as PK_ID']
            const qeColumns = this.$refs.qe.settings.columns
            qeColumns.forEach ( key => {
                if ( columns.indexOf(key.toLowerCase()) == -1 ) 
                
                    columns.push ( key  )
            })
            return _.uniq(columns)
        },
        pkName(){
            const tarr = this.ventana.data.table.split(".")
            const table = tarr.length > 1 ? tarr[2] : tarr[0]
            const fields = this.ventana.data.fields
            , pkfield = fields.filter ( field => ( field.is_identity && field.table_name.toLowerCase() == table.toLowerCase() ) )
            if ( !pkfield[0] ) {
                console.error ( `La tabla ${table} no tiene clave primaria definida.` )
            }
            return pkfield[0].column_name
        },
        tablesRelation(){
            return this.api.getTablesRelation ( this.ventana.data.table )
        }
    },
    updated () {
    },
    mounted: function () {
        //console.log("distinct"+this.distinct)
        //this.qeHasChanged.changed = false
        return
        const $div = $(this.$refs.qeContainer)
        $div.resizable({handles: "s"})
        $div.css({height:'100px'})
     },
    methods: {
        activateParam (i) {
            this.$refs.qe.activateParam(this.$refs.qe.parameters.data[i])
        },
        setNewOrder (i) {
            this.$refs.qe.setNewOrder(i)
        },
        shortAlias (alias) {
            const aliasArr = alias.split(".") 
            return aliasArr[aliasArr.length-1]
        },
        clickFunc ( func, event ) {
            console.log('target')
            event.stopPropagation()
            const target = event.target.tagName == "path" ? event.target.closest('svg') : event.target
            const $slot = $(target).closest('div.header-cell')
            if ( $slot.attr('type') != "number" ) return false
            switch ( func ) {
                case 'SUM':
                    func = "AVG"
                    break;
                case 'AVG':
                    func = "DISTINCT"
                    break;
                case 'DISTINCT':
                    func = "SUM"
                    break;
            }
            //func = func == "SUM" ? "AVG" : "SUM"
            $slot.find('select').val(func)
            if ( func == "SUM" )
                $slot.find('.button-operation svg').addClass('hide').eq(0).removeClass('hide')
            if ( func == "AVG" )
                $slot.find('.button-operation svg').addClass('hide').eq(1).removeClass('hide')
            if ( func == "DISTINCT" )
                $slot.find('.button-operation svg').addClass('hide').eq(2).removeClass('hide')
            //$(target).removeClass('hide')
            
        },
        open_serie ( event ) {
            this.$refs.popup.show()
        },
        operate_serie ( params ) {
            console.log(this.series.operation)
            console.log(JSON.cc(params))
            if ( ! this.checkedIds || ! this.checkedIds.length ) {
                window.log ( 'Operación cancelada. No hay ningún registro seleccionado.', 'darkorange' )
                return false
            }
            const mainTable = this.tablesRelation.joinSyntax.split(" INNER JOIN ")[0]
            , assigns = params.filter ( param  => ( param.series && param.series.replaceValue != "" ) ).map ( param => {
                const name = param.reference ? param.reference : param.key
                , value = param.series.replaceValue
                if ( this.series.operation.toLowerCase() == "sobreescribir" ) {
                    return name + " = '" + value + "'"
                } else {
                    return name + " = NULL"
                }
            })
            , sql = "UPDATE " + mainTable + " SET " + assigns
            , identities = this.ventana.data.identities
            , idField = identities[0]
            if ( ! assigns.length ) {
                window.log ( 'Operación cancelada. No ha rellenado ningún campo.', 'darkorange' )
                return false
            }
            const updates = this.checkedIds.map ( id => `${sql} WHERE ${idField} = ${id}` )
            var sqlSyntax = ""
            updates.forEach ( update => sqlSyntax += update + ' ')
            console.log(sqlSyntax)
            this.api.$dbq ({
                sqlSyntax
                , dbID: this.api.getTableConnectionId(this.ventana.data.table)
            }, data => {
                window.log ( updates.length + ' registros alterados.', 'green' )
            }, true
            , true)
            //this.api.$serie_overwrite ( this.ventana.)
        },
        scrollHeaders ( leftScroll ) {
            $(this.$refs.computer).css({'margin-left':leftScroll*-1})
        },
        resizeHeaders ( widths ) {
            const $cols = $(this.$refs.computer).find('div.header-cell')
            this.grid.columns.widths=widths
            $cols.each ( function(i) {
                $(this).css({'max-width':(widths[i+1]+12)+'px','min-width':(widths[i+1]+12)+'px','width':(widths[i+1]+12)+'px'})
            })
        },
        qeParamUpdate (params) {
            this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:params} )

        },
        tabulator ( jsonRecordset ) {
           if ( !jsonRecordset.length ) return ""
           jsonRecordset.forEach ( row => delete row[Object.keys(row)[0]] )
           const $tabla = $('<table/>')
           , cellStyle = {border:"1px solid #eee",padding:"5px"}
           , firstRecord = jsonRecordset[0]
           //Creo encabezados
           , $headRow = $('<tr/>')
           $tabla.append($headRow)
           Object.keys(firstRecord).forEach ( key => {
               const $cell = $('<td/>').css(cellStyle)
               $headRow.append($cell.text(key))
           })
           jsonRecordset.forEach ( record => {
               const $row = $('<tr/>')
               $tabla.append($row)
               Object.keys(record).forEach ( key => {
                   const $cell = $('<td/>').css(cellStyle)
                   $row.append($cell.text(record[key]))
               })
               
           })
           return $tabla.wrap('<div/>').parent().html()
        }
        , downloadListAsFile() {
            /*
            const tabla = JSON.cc(this.grid.rows)
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            , whereSyntax = qeSyntax.length ? qeSyntax : ''
            , sqlParams = {
                columns: this.$refs.qe.settings.columns
                , schemaSyntax: this.tablesRelation.joinSyntax
                , whereSyntax
                , orderbyColumns: this.$refs.qe.settings.orderBy != "" ? this.$refs.qe.settings.orderBy:this.pkName
            }
            , types = {}
            console.log(sqlParams)
            JSON.cc(this.$refs.qe.settings.params).forEach ( param => {
                types[param.reference] = param.data_type
            })
            //console.log(types)
            this.api.downloadExcel ( sqlParams, types )
            return
            */
            this.loadPage(2,()=>{
                var blob = new Blob(["\ufeff",this.tabulator(JSON.cc(this.grid.rows))], { type: 'text/plain' })
                , url = window.URL.createObjectURL(blob)
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = url;
                a.download = 'Listado.xls';
                a.click();
            })
        },
        containerResize () {
            this.$refs.Tabla.resizeHeaders()
        },
        headerClick ( {key, target, index } ) {
            const reference = this.qeParams[index].reference
            console.log(reference)
            window.contextDialog({key, target, reference })
        },
        checkClick(checklist){
            //console.log(checklist)
            const checked_pk_id = []
            /*
            this.grid.rows.forEach ( ( row, i ) => {
                if ( $.inArray ( i, checklist ) != -1 ) checked_pk_id.push ( row.PK_ID )
            })
            */
            checklist.forEach ( ( index ) => {
                checked_pk_id.push ( this.grid.rows[index].PK_ID )
            })
            //console.log(checked_pk_id)
            //this.$store.commit ( 'checked_assign', { indexVentana: this.ventana.index, ids: checked_pk_id } )
            this.checkedIds = checked_pk_id
            this.checkedIndexes = checklist
            //this.$store.commit ( 'log', checklist.length + ' registros marcados.' )
        },
        rowClick(row){
            return
            const pk_id = row.PK_ID
            const table = this.ventana.data.table
            , identities = this.ventana.data.identities
            , idField = identities[0]
            , joinSyntax = this.tablesRelation.joinSyntax
            //, fields = this.tablesRelation.names.map ( tblName => `${tblName}.*`)
            , asArr = []
            , fields = Object.keys(this.keysSettings).map ( fieldName => {
                //Esto es para cargar el texto en lugar de el ID en el caso de lista dinámica. Habrá que quitarlo cuando el programa pretenda escribir o implemente inline-search.
                const columnSql = this.api.getListColumnSql ( fieldName )
                if ( fieldName.length > 128 ) { //SQL Server no acepta alias de más de 128 caracteres. Tengo que generar uno en ese kso. 
                    const uniqueid = this.uniqueid()
                    asArr.push ({
                        fieldName
                        , uniqueid
                    })
                    fieldName = uniqueid
                }
                return `(${columnSql}) AS [${fieldName}]`
            })
            , sql = `sql=SELECT ${fields} FROM ${joinSyntax} WHERE ${idField}=${pk_id}` 
            //console.log(sql)
            /*
            $get ( sql, table, data => {
                this.$emit('rowClick',data[0])
            })
            */
            this.api.$dbq ({
                operation: 'select'
                , columns: fields
                , schemaSyntax: joinSyntax
                , whereSyntax: `${table}.${idField}=${pk_id}`
                , dbID: this.api.getTableConnectionId(table)
            }, data => {
                const row = data[0]
                asArr.forEach ( asid => {
                    row[asid.fieldName] = row[asid.uniqueid]
                })
                //Object.keys(row).for
                this.$emit('rowClick',row)
            })
        },
        paramsToForm ( ) {
            //log(this.queryEditor.params)
        },
        orderBy ( orderby ) {
            this.orderby = JSON.cc(orderby)
            console.log(JSON.cc(orderby))
            //Object.keys( orderby )
        },
        qeHasChanged () {
            const hasChanged = ( this.$refs.qe.settings != this.grid.qeSettings ) || ( this.qeHasChanged.changed )
            this.qeHasChanged.changed = false
            //this.distinct = this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            //console.log('QE has Changed: '+hasChanged)
            return hasChanged
        },
        /*
        clickShowComputer(event) {
            //event.stopPropagation();
            console.log(this.showComputer)
            this.showComputer=!this.showComputer;
        },
        */
        telon(show) {
            const buttons = $(this.$refs.toolbar).find('button')
            , butSel = buttons.eq(1).add(buttons.eq(2)).add(buttons.eq(6))
            if ( show ) {
                butSel.prop('disabled',true).css({cursor:'progress','text-decoration':'line-through'})
                $(this.$refs.listado).css({cursor:'progress'})
                $('body').css({cursor:'progress'})
            } else {
                //butSel.each ( () => {$(this).text('this.value');console.log(this)} )
                butSel.prop('disabled',false).css({cursor:'default','text-decoration':'none'})
                $(this.$refs.listado).css({cursor:'default'})
                $('body').css({cursor:'default'})
            }
            //$('body').css({cursor:'pointer'})
        },
        compute ( params ) {
            // COMPUTO
            // OBTENGO LOS NOMBRES DE LAS COLUMNAS

            this.grid.columns.names = this.columns.map ( column => {
                const cSplit = column.toLowerCase().split ( " as " )
                , sql = cSplit[0]
                , label = cSplit.length > 1 ? cSplit[1] : cSplit[0]
                , qeParams = JSON.cc(this.qeParams)

                // BUSCO EN LOS PARÁMETROS DEL QUERY EDITOR LA REFERENCIA (EL NOMBRE ORIGINAL DEL CAMPO) CORRESPONDIENTE AL ALIAS PARA UTILIZARLA EN LUGAR DE LA POTENCIAL SUBQUERY DE LOS CAMPOS DE LISTAS, YA QUE NO SE PUEDE USAR FUNCIONES DE AGREGADO SOBRE SUBQUERYS.
                let reference
                Object.keys(qeParams).forEach ( key => {
                    const alias = qeParams[key].alias
                    if ( '['+alias.toLowerCase()+']' == label.toLowerCase() ) reference = qeParams[key].reference
                })
                return { sql:reference, label }
            })
            this.grid.columns.names.splice(0,1) // quito pk_id (la primera columna que nunca se ve)
            //console.log(JSON.cc(this.qeParams))
            //console.log(JSON.cc(this.grid.columns.names))
//return
            //obtengo los data type de las columnas del listado

            this.grid.columns.names.forEach ( (name,i) => {
                this.grid.columns.types[i] = "text"
                Object.keys(this.keysSettings).forEach ( key => {
                    if ( name.sql.toLowerCase() == key.toLowerCase() ) this.grid.columns.types[i] = this.utils.getBasicDataType(this.keysSettings[key].data_type)
                })
            })

            //if ( ! this.showComputer ) return false

            const computedColumns = []
            this.grid.columns.names.forEach ( (name,i) => {
          //      if ( i > 0 ) {
                    //computedColumns.push ( "" )
                    const type = this.grid.columns.types[i]
                    , func = $(this.$refs['computed_'+name.label]).find('select option:selected').val()
                    
                    //console.log(name)
                    if ( name.sql.toLowerCase().indexOf ( 'select' ) == -1 ) { //SI TIENEN SELECT ES QUE ES UNA SUBQUERY DE UN CAMPO COMPUTADO. NO SE PUEDEN CONTAR LAS SUBQUERIES POR RESTRICCIÓN DE SQL SERVER.
                        if ( type == "number" ) {
                            if ( func )  { 
                                if ( func != "DISTINCT" )
                                    computedColumns.push ( func + "(" + name.sql + ") as " + name.label ) 
                                else
                                    computedColumns.push ( "COUNT(DISTINCT(" + name.sql + ")) as " + name.label ) 
                            } else { 
                                computedColumns.push ( "'' as " + name.label ) 
                            }
                        } else if ( func == "DISTINCT" ) {
                            computedColumns.push ( "COUNT(DISTINCT(" + name.sql + ")) as " + name.label ) 
                        }
                    } else {
                        computedColumns.push ( "'' as " + name.label ) 
                    }
          //      }
            })

            if (!computedColumns.length) return false
            
            const paramsComputedCols = JSON.cc(params)
            paramsComputedCols.columns = computedColumns
            this.api.$dbq (paramsComputedCols , data => {
                const results = JSON.cc(data[0])
                Object.keys(results).forEach ( key => {
                    $(this.$refs['computed_['+key+']']).find('span').html(results[key] ).attr('title',results[key] )
                    $(this.$refs['computed_['+key+']']).find('.button-operation *').attr('title',results[key] )
                })
                //console.log(data[0])
            })
        },
        set_distinct () {
            //console.log('aaaaa')
            //this.distinct = ! this.distinct
            this.$store.commit ( 'set_distinct' , {indexVentana:this.ventana.index, value: !this.distinct} )
            this.qeHasChanged.changed = true
            return
            const data = this.grid.rows
            data.forEach ( thing => {thing.PK_ID=1})
            const uniqueArray = data.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index === data.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            });
            this.grid.rows = uniqueArray
            this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct = true
        },
        keyDownSearchField (event,i) {
            if(event.keyCode === 13){  event.preventDefault(); return false }
        },
        alterSearchString (event,i) {
            const val = event.target.innerHTML
            , qep = JSON.cc ( this.qeParams )
            qep[i].text = val
            qep[i].value = val
            this.qeParams = qep
        },
        focusSearchField (event,i,remove) {
            const $field = $(event.target)
            if (remove) {
                $field.removeClass('focused')
                window.contextList.closeContext()
                this.alterSearchString(event,i)
            } else {
                $field.addClass('focused')
                this.$refs.qe.openContext(i,event,this.$refs.qe.parameters.data[i])
            }

        },
        getParamSearchString ( i ) {
            let str = this.$refs.qe.parameters.data[i].text
            if ( str == "[]" ) str = ""
            return str

        },
        loadList (o,cb) {
            
            //this.grid.rows = []
            //return
            const table = this.ventana.data.table
            , joinSyntax = this.tablesRelation.joinSyntax
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            , whereSyntax = qeSyntax.length ? 'WHERE ' + qeSyntax : ''
            , pkName = this.pkName
            , whereListado = `pkname = '${table}.${pkName}'`
            , insertIds = `sql=delete DBH_listado INSERT INTO DBH_listado (sessionId,idusuario,idlistado,pkname) 
            select 1,1,${pkName},'${table}.${pkName}' FROM ${joinSyntax} ${whereSyntax} 
            SELECT count(idlistado) as noFilas FROM DBH_listado WHERE ${whereListado}` 
            , rowIdsSql = `sql=select ${pkName} as id FROM ${joinSyntax} ${whereSyntax}`
            , dbID = this.api.getTableConnectionId(table)
            , selectSql = `SELECT ${this.distinct?'DISTINCT ':''} ${this.columns} FROM ${joinSyntax}  ${qeSyntax?'WHERE '+qeSyntax:''}`
            this.grid.loadedRecsNumber = 0
            
            //console.log(selectSql)
            //this.qeHasChanged.changed = true
            this.api.$dbq ({
                sqlSyntax: "SELECT COUNT(*) as recnum FROM (" + selectSql + ") as a"
				, dbID: this.api.getTableConnectionId(table)
            }, data => {
                //console.log(data)
                this.grid.rowCount = data[0].recnum ? data[0].recnum : 0
                this.grid.whereSql = whereSyntax
                this.grid.qeSettings = this.$refs.qe.settings
                this.grid.page = 0
                this.grid.rows = []
                this.checkedIds = []
                this.checkedIndexes = []
                this.loadPage(o,cb)

                //if ( ! this.grid.rowCount ) console.log(queryPars)
            },false,true)
            return
            
            const queryPars = {
                columns: [`count(${table}.${pkName}) as recnum`]
                , schemaSyntax: joinSyntax
                , whereSyntax: qeSyntax
                , dbID
            }
            this.api.$dbq (queryPars, data => {
                //console.log(data)
                //this.grid.rowIds = data[0].recnum//data.map ( field => field.id )
                this.grid.rowCount = data[0].recnum ? data[0].recnum : 0
                this.grid.whereSql = whereSyntax
                this.grid.qeSettings = this.$refs.qe.settings
                this.grid.page = 0
                this.grid.rows = []
                this.checkedIds = []
                this.checkedIndexes = []
                //console.log('a')
                this.loadPage(o,cb)

                //if ( ! this.grid.rowCount ) console.log(queryPars)
            })
        },
        loadPage (o,cb) {
            this.telon(1)
            window.circus.panels.form = false
            window.circus.panels.bottom = false
            const table = this.ventana.data.table
            , columns = this.columns
            , joinSyntax = this.tablesRelation.joinSyntax
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            //, whereSyntax = qeSyntax.length ? 'WHERE ' + qeSyntax : ''
            , whereSyntax = qeSyntax.length ? qeSyntax : ''
            this.compute({
                 schemaSyntax: joinSyntax
                , whereSyntax: whereSyntax
                , dbID: this.api.getTableConnectionId(table)
            })
            if ( this.qeHasChanged() ) {
                //console.log('has changed')
                this.loadList(o,cb)
                return
            }
            if ( ! this.grid.rowCount ) {
                //this.grid.rows = [{[' ']:'No hay coincidencias'}]
                this.telon(0)
                return false
            }
            if ( this.grid.rowCount == this.grid.loadedRecsNumber ) {
                if ( o==2 ) { //viene de solicitar Excel
                    if ( cb ) cb()
                    this.telon(0)
                    return
                }
                if ( ! confirm ( "Se han cargado la totalidad de los registros de este listado.\n\nDesea comenzar la carga del listado nuevamente desde el principio?") ) {
                    if ( cb ) cb()
                    this.telon(0)
                } else {
                    this.loadList(o)
                }
                return false
                
            }
            const pkName = this.pkName
            , whereListado = `pkname = '${table}.${pkName}'`
            , orderbyStr = this.$refs.qe.settings.orderBy != "" ? this.$refs.qe.settings.orderBy:(table+'.'+pkName)
            , recXPag = this.grid.recXPag
            , offset = this.grid.page * recXPag
            , selectSql = `sql=SELECT ${this.distinct?'DISTINCT ':''} ${columns} FROM ${joinSyntax} ${this.grid.whereSql} ORDER BY ${orderbyStr} OFFSET ${offset} ROWS FETCH NEXT ${recXPag} ROWS ONLY`
            this.grid.page++
            let loadedRecsNumber = this.grid.page*this.grid.recXPag
            if ( ( loadedRecsNumber > this.grid.rowCount ) || o ) loadedRecsNumber = this.grid.rowCount
            this.grid.selectSql = selectSql.substring(4)
            console.log(this.grid.selectSql)
            const params = {
                columns: columns
                , schemaSyntax: joinSyntax
                , whereSyntax: whereSyntax
                , orderbyColumns: orderbyStr
                , offset: offset
                , pageSize: recXPag
                , dbID: this.api.getTableConnectionId(table)
                , distinct: this.distinct // this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            }
            if ( o ) {
                params.pageSize=999999999
            }

            this.api.$dbq (params , data => {
                this.grid.rows =  this.grid.rows.concat(data)
                this.grid.loadedRecsNumber = loadedRecsNumber
                //this.grid.columns.names = Object.keys(this.grid.rows[0]).splice(1)
                //this.grid.columns.types = [2]
               // console.log(JSON.cc(this.filter))
                this.telon(0)
                window.circus.showHelpBox ({title:`Cargados ${loadedRecsNumber} registros`,text:`Se han cargado los siguientes ${loadedRecsNumber} registros`} )
                if ( cb ) cb()
                /*
                if ( loadedRecsNumber == this.grid.rowCount ) {
                    Object.assign(this.buttons[0],{disabled:true})
                    Object.assign(this.buttons[1],{disabled:true})
                    this.buttons.push('a')
                    this.buttons.length = this.buttons.length - 1
                }
                */
            })

        }
    }
  }
</script>

<style scoped>
    .qe {
        width:100%;min-height:50px;border:0 solid red;border-width:0 0 0px 0;position:;float:left;
        background-color:white;
        padding: 2px;
        background: repeating-linear-gradient(
            -35deg,
              #fff,
              #fff 10px,
              #f8f8f8 10px,
              #f8f8f8 20px
            );
            
    }
    .hide {
        display:none
    }
    .header-cell {
        float:left;
        border:0px solid grey;
        padding:5px;
        box-sizing:border-box;
        white-space:nowrap;
        overflow:hidden;
        white-space:nowrap;
    }
    .search-field {
        background: white; 
        padding: 2px; 
        border:1px solid lightgray; 
        margin-top: 3px; 
        max-width:100%;
        min-width:50px;
        clear:both; 
        float:left; 
        overflow: hidden;
        white-space: nowrap;
    }
    .search-field.focused {
        position: absolute;
        width: auto;
        min-width: 100px;
        top: 17px;
        box-shadow: 1px 1px 5px 2px gray;
    }
    .search-field-inactive {
        background: #ddd;
    }
    .button-operation * {
        cursor: pointer
    }
</style>