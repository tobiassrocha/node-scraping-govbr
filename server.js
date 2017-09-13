var express = require('express'),
fs = require('fs'),
request = require('request'),
cheerio = require('cheerio'),
app = express();

app.get('/scrap', function(req, res) {
    url = 'http://www.portaldatransparencia.gov.br/PortalComprasDiretasOEOrgaoSuperior.asp?Ano=2017&Valor=86726995548647&Pagina=1';
    request(url, function(error, response, html) {
        // Assegurar que não tenha erros para fazer a raspagem de dados com sucesso
        if (!error) {
            var $ = cheerio.load(html);

            // Objeto que irá armazenar a tabela
            var resultado = [];

            // Manipulando o seletor específico para montar nossa estrutura
            $('#listagem tr:not(:first-child)').each(function(i) {
                // Obtendo as propriedades da tabela. 
                // O método .trim() garante que irá remover espaço em branco
                var codigo = $(this).find('td').eq(0).text().trim(),
                    orgao = $(this).find('td').eq(1).text().trim(),
                    valorTotal = $(this).find('td').eq(2).text().trim();
                
                // Inserindo os dados obtidos no nosso objeto
                resultado.push({
                    codigo: codigo,
                    orgao: orgao,
                    total: valorTotal
                });
            });
        }

        // Escrevendo o arquivo .json com o array 
        fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
            console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
        })
    })
})

app.listen('8081')
console.log('Executando raspagem de dados na porta 8081...');
exports = module.exports = app;