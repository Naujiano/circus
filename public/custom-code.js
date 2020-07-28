const customjs = {
    "buttons" : {
        "onclick" : {
            "getDocument" : function (api, pk_id) {
                console.log(pk_id)
                pk_id = 710
                const fields = "*"
                , joinSyntax = "personas_documentos pd INNER JOIN dbh_documentos on doc_pkvalue = pd.perdoc_id INNER JOIN view_documentos_exigidos_union_hijos de ON de.perdoc_id = doc_pkvalue" 
                , whereSyntax = `de.id = ${pk_id} and doc_da_id = 105` // 105 es el area de Documentos de la figura 
                api.$dbq ({
                    operation: 'select'
                    , columns: fields
                    , schemaSyntax: joinSyntax
                    , whereSyntax: whereSyntax
                    , dbID : 'circus'
                }, data => {
                    console.log(data)
                })
            }
        }
    }
}