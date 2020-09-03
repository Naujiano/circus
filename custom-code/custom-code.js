
const customjs = {
    "buttons" : {
        "onclick" : {
            "getDocument" : function (api, pk_id) {
                //pk_id = 710
                const fields = "doc_nombrearchivo,doc_nombreoriginal"
                , joinSyntax = "personas_documentos pd INNER JOIN dbh_documentos on doc_pkvalue = pd.perdoc_id INNER JOIN view_documentos_exigidos_union_hijos de ON de.perdoc_id = doc_pkvalue" 
                , whereSyntax = `de.id = ${pk_id} and doc_da_id = 105` // 105 es el area de Documentos de la figura 
                api.$dbq ({
                    operation: 'select'
                    , columns: fields
                    , schemaSyntax: joinSyntax
                    , whereSyntax: whereSyntax
                    , dbID : 'DBH_coteyser'
                }, data => {
                    console.log(data)
					if (!data[0]) {
						alert('No hay documento que cumpla esta exigencia.')
						return false
					}
					const doc_nombrearchivo = data[0].doc_nombrearchivo
					, doc_nombreoriginal = data[0].doc_nombreoriginal
                    window.open(api.hostname+"/node/express/circus_server/dbhdoc?file=" + doc_nombrearchivo + "&filename=" + doc_nombreoriginal)
                })
            }
        }
    }
}
