const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000

const app = express();
// app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs');
app.use(express.static('public'));

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'project',
  password : 'project',
  database : 'collegewebsite',
});

connection.connect();
app.get('/research', async (req, res)=>{
    const wait = await connection.query('select * from research order by date desc;', function(err, result, fields){
            if(err){
                console.log(err)
            }
            res.render('research',{rows : result})
    })
})




app.get('/', (req, res)=>{
    res.render('default')
})

app.get('/event', async function(req, res){
    var past = [];
    var upcoming = [];
    const res1 = await connection.query(`select * from events where isDone=1 order by date desc;`, function(err, result,fields){
        if(err){
            console.log(err)
        }
        past = result
    })
    const res2 = await connection.query('select * from events where isDone=0 order by date;', function(err,result, fields){
        if(err){
            console.log(err)
        }
        upcoming = result
        res.render('event', {p:past, u:upcoming})
    })   
})

app.listen(PORT, function(){
    console.log(`App running at port ${PORT}`);
})