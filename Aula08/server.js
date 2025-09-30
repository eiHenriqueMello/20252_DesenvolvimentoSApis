const http = require("http")
const mysql = require("mysql")

const hostname = "127.0.0.1"
const port = 3000

const conn = mysql.createConnection( {
    host : hostname ,
    user : "root" ,
    password : "" ,
    database : "loja_25_2" 
} )

const server = http.createServer( (req, res) =>{
    res.statusCode = 200
    res.setHeader( "Content-type" , "application/json" )
    try {
        // verifica se não existe conexão com o banco
        if( conn.state != "authenticated" ){
            // tenta conectar ao banco
            conn.connect( function(err) {
                // Se ocorreu erro na conexão, responde ao usuário, informando o erro
                if( err ){
                    // constrói um objeto JS, transforma em um JSON e envia como resposta
                    res.end( JSON.stringify( {
                            resposta : "Erro na Conexão" ,
                            erro : err
                        } ) 
                    )
                }else{
                    consultar( res )
                }
            })
        }else{
            consultar( res )
        }
    } catch (error) {
        res.statusCode( 500 )
        res.end( '{ "resposta" : "Erro no servidor" }' )
    }
} )

function consultar( res ){
    const sql = "SELECT * FROM produto ORDER BY nome"
    // método query recebe 2 parâmetros, a consulta e uma função de callback para ser executada 
    // assim que a consulta for finalizada no banco
    conn.query( sql , (err , result , fields) =>{
        if( err ){
            res.end( JSON.stringify( {
                    resposta : "Erro na Consulta" ,
                    erro : err
                } ) 
            )
        }else{
            // Este é o "caminho feliz", quando responde com os dados do banco
            res.end( JSON.stringify( result ) )
        }
    } )
}

// aqui o servidor é colocado para executar
server.listen( port , hostname , () => {
	console.log(  `Servidor executando em http://${hostname}:${port}`)
} )