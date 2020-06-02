const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://genericuser:generic@cluster0-vmxrj.gcp.mongodb.net/test?retryWrites=true&w=majority';

mongoClient.connect(uri, {
    useUnifiedTopology: true, useNewUrlParser: true
    })
    .then(client => {
    console.log('Conectado ao banco de dados');
    //Constante do banco de dados e coleções
    const db = client.db('e-stantedb');
    
    const usersCollection = db.collection('usuarios');
    const booksCollection = db.collection('livros');
    const salesCollection = db.collection('vendas');
    
    var logEmail = null;
    var logSenha = null;
    var livro = null;

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use('/static', express.static('public'));
    app.listen(3000, function(){
        console.log('Listening on 3000')
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname +'/index.html')
    });
    app.get('/registration', (req, res) => {
        res.sendFile(__dirname +'/registration.html')
    });
    app.get('/login', (req, res) => {
        res.sendFile(__dirname +'/login.html')
    });
    app.get('/index', (req, res) => {
        res.sendFile(__dirname +'/index.html')  
    });
    // Livros
    app.get('/livroAzul', (req, res) => {
        res.sendFile(__dirname +'/livroAzul.html')
        livro="O fabuloso livro azul"  
    });
    app.get('/livroAm', (req, res) => {
        res.sendFile(__dirname +'/livroAm.html')  
        livro="O fabuloso livro amarelo"
    });
    app.get('/livroLar', (req, res) => {
        res.sendFile(__dirname +'/livroLar.html') 
        livro="O fabuloso livro laranja que é amarelo" 
    });
    app.get('/livroVerde', (req, res) => {
        res.sendFile(__dirname +'/livroVerde.html') 
        livro="O fabuloso livro verde" 
    });
    app.get('/livroVerm', (req, res) => {
        res.sendFile(__dirname +'/livroVerm.html')  
        livro="O fabuloso livro vermelho"
    });


    //Insere novo usuário
    app.post('/novoUsuario', (req, res) => {
        usersCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/login');
        })
        .catch(error => console.error(error))
    });

    //Login
    app.post('/logar', (req, res) => {
        var data = {
            email: req.body.email,
            senha: req.body.senha
        };
        usersCollection.findOne(data, function(err, result){
            if(err) {
                res.json({
                    status:0,
                    message: err
                });
            } if (!result) {
                res.json({
                    status: 0,
                    msg: "Não encontrado"
                });
            }
            logEmail= req.body.email

            res.redirect('/index')
        })
    });
    //fim login

    app.get('/comprarAzul', (req, res) => {
        if(logEmail == null){
            res.redirect('/login');
        } else {
            salesCollection.insertOne({comprador: logEmail, livro: livro})
            booksCollection.updateOne({titulo: livro}, {$inc: {"quantidade": -1}})
            res.redirect('/livroAzul');
        }
    });
    app.get('/comprarVerm', (req, res) => {
        if(logEmail == null){
            res.redirect('/login');
        } else {
            salesCollection.insertOne({comprador: logEmail, livro: livro})
            booksCollection.updateOne({titulo: livro}, {$inc: {"quantidade": -1}})
            res.redirect('/livroVerm');
        }
    });
    app.get('/comprarVerde', (req, res) => {
        if(logEmail == null){
            res.redirect('/login');
        } else {
            salesCollection.insertOne({comprador: logEmail, livro: livro})
            booksCollection.updateOne({titulo: livro}, {$inc: {"quantidade": -1}})
            res.redirect('/livroVerde');
        }
    });
    app.get('/comprarAm', (req, res) => {
        if(logEmail == null){
            res.redirect('/login');
        } else {
            salesCollection.insertOne({comprador: logEmail, livro: livro})
            booksCollection.updateOne({titulo: livro}, {$inc: {"quantidade": -1}})
            res.redirect('/livroAm');
        }
    });
    app.get('/comprarLar', (req, res) => {
        if(logEmail == null){
            res.redirect('/login');
        } else {
            salesCollection.insertOne({comprador: logEmail, livro: livro})
            booksCollection.updateOne({titulo: livro}, {$inc: {"quantidade": -1}})
            res.redirect('/livroLar');
        }
    });

}).catch(console.error);



