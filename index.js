const express = require('express');

const app = express();

const { Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'database.sqlite'
});

app.set("view engine", "ejs");


const Results = sequelize.define('Results', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    main: {
        type: DataTypes.STRING
    }
});

(async () => {
    await Results.sync();
})();

app.use(express.json()); 
app.use(express.urlencoded( {extended : true } ));

app.get('/', async function (req, res) {  //main page
    const results = await Results.findAll({raw: true});
    res.render("home.ejs",{results: results});
});

app.get('/create', function(req,res){  //form page
    res.render("create");
});

app.post('/sendResult', async function(req,res){
    const content = req.body;
    resultCreate = await Results.create({title: content.title, main:content.main});
    console.log(resultCreate.title);
    res.redirect('/');
});

app.post('/delete/:id',async function(req,res){
    const {id} = req.params;
    await Results.destroy({
        where:{
            id: id
        }
    })
    res.redirect('/');
});

app.post('/update/:id',async function(req,res){
    const {id} = req.params;
    await Results.update({
        where:{
            id:id
        }
    })
})

app.use(express.static("views"));
app.listen(3000);