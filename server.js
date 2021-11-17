const express= require('express')
const app= express();
const cookieParser= require('cookie-parser')
const path= require('path')

//establish database connection
const db= require('./DBConnection');
const port= 80;

//serve static contents
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser("Hello TA"))

//default html
app.get('/', (req,res) => { 
    res.sendFile(path.join(__dirname,'/static/home.html'))
})

//clicking sign-in as admin button calls this get request
app.get('/login-form', (req,res) => {
    let username, password;
    username= req.cookies.username || '';
    password = req.signedCookies.pwd || '';

    let content= `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action= '/login' method='post'>
            username: <input name='usr' value='${username}' type= 'text' />
            <br />
            password: <input name='pwd' value= '${password}' type= 'text' />
            <br />
            <input type= 'submit' />
        </form>
    </body>
    </html>`;

    res.send(content);
})

//from login-form get request it calls this post request
app.post('/login', (req, res) =>{

    //authenticates user
    let username = req.body.usr;
    let password = req.body.pwd;

    if(username == 'admin' && password == 'western'){
        res.cookie("usr", username);
        res.cookie("pwd", password, {signed: true, expires: new Date(2050, 0, 1) });
        //res.sendFile(path.join(__dirname,'/static/admin-form.html')); //send authenticated user to the guest-form
        res.redirect('/admin-form');
    }
    else {
        res.send("Access Denied")
    } 
})

app.get('/admin-form', (req, res, next)=>{
    //connect to database
    const db_con= db.newConnection();
    db_con.connect();
    
    //select all from the doodle table
    db_con.query(`SELECT * FROM Doodle`, (err ,rows, fields) =>{
    let dbContent= "";
        for(r of rows){
            dbContent += `<div> <input type= "text" value = '${r.name}' ></input>`
            let i = 1
            for (s of r.slot)
            {
                dbContent += `<input type = "checkbox" `
                if (s==1){
                    dbContent += ` checked>`
                    dbContent += ` Day${i} </input>`
                    i += 1;
                }else{
                    dbContent += ` Day${i} </input>`
                    i += 1;
                }
                    
            }
            dbContent += `</div>`;
        }

        //query function will be called asycn
        let content = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            
            <form action='/admin-form' method='POST'>
                <input type="text" name= "name"/>
                <input type= "checkbox" name= "day1">Day 1</input>
                <input type= "checkbox" name= "day2">Day 2</input>
                <input type= "checkbox" name= "day3">Day 3</input>
                <input type= "checkbox" name= "day4">Day 4</input>
                <input type= "checkbox" name= "day5">Day 5</input>
                <input type= "checkbox" name= "day6">Day 6</input>
                <input type= "checkbox" name= "day7">Day 7</input>
                <input type= "checkbox" name= "day8">Day 8</input>
                <input type= "checkbox" name= "day9">Day 9</input>
                <input type= "checkbox" name= "day10">Day 10</input>
                <input type= "submit" value="Submit" /></button>
            </form> 
            ${dbContent}
        </body>
        </html>`;
        
        res.send(content);
    })

    db_con.end()
})

app.post('/admin-form', (req, res)=>{
    let name = req.body.name;
    let days = "";
    days= req.body.day1?"1":"0";
    days= req.body.day2?days+"1":days+"0";
    days= req.body.day3?days+"1":days+"0";
    days= req.body.day4?days+"1":days+"0";
    days= req.body.day5?days+"1":days+"0";
    days= req.body.day6?days+"1":days+"0";
    days= req.body.day7?days+"1":days+"0";
    days= req.body.day8?days+"1":days+"0";
    days= req.body.day9?days+"1":days+"0";
    days= req.body.day10?days+"1":days+"0";

    const db_con= db.newConnection();
    db_con.connect();

   // update row into doodle table
    db_con.query(`UPDATE Doodle
                  SET slot= '${days}'
                  WHERE name= '${name}'`, (err, rows, field) =>{
        if (err){
            console.log(err);
        }
        
        db_con.end();

        //send the request to another path
        res.redirect('/admin-form');

    });

})

//clicking sign in as guest calls this get request
app.get('/guest-form', (req, res, next)=>{
    //connect to database
    const db_con= db.newConnection();
    db_con.connect();
    
    //select all from the doodle table
    db_con.query(`SELECT * FROM Doodle`, (err ,rows, fields) =>{
    let dbContent= "";
        for(r of rows){
            dbContent += `<div> <input type= "text" value = '${r.name}' ></input>`//removed the disabled
            let i = 1
            for (s of r.slot)
            {
                dbContent += `<input type = "checkbox" ` //removed the disabled
                if (s==1){
                    dbContent += ` checked>`
                    dbContent += ` Day${i} </input>`
                    i += 1;
                }else{
                    dbContent += ` Day${i} </input>`
                    i += 1;
                }
                    
            }
            dbContent += `</div>`;
        }

        //query function will be called asycn
        let content = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            
            <form action='/guest-form' method='POST'>
                <input type="text" name= "name"/>
                <input type= "checkbox" name= "day1">Day 1</input>
                <input type= "checkbox" name= "day2">Day 2</input>
                <input type= "checkbox" name= "day3">Day 3</input>
                <input type= "checkbox" name= "day4">Day 4</input>
                <input type= "checkbox" name= "day5">Day 5</input>
                <input type= "checkbox" name= "day6">Day 6</input>
                <input type= "checkbox" name= "day7">Day 7</input>
                <input type= "checkbox" name= "day8">Day 8</input>
                <input type= "checkbox" name= "day9">Day 9</input>
                <input type= "checkbox" name= "day10">Day 10</input>
                <input type= "submit" value="Submit" /></button>
            </form> 
            ${dbContent}
        </body>
        </html>`;
        
        res.send(content);
    })

    db_con.end()
})

//called from guest-form get request
app.post('/guest-form', (req, res)=>{
    let name = req.body.name;
    let days = "";
    days= req.body.day1?"1":"0";
    days= req.body.day2?days+"1":days+"0";
    days= req.body.day3?days+"1":days+"0";
    days= req.body.day4?days+"1":days+"0";
    days= req.body.day5?days+"1":days+"0";
    days= req.body.day6?days+"1":days+"0";
    days= req.body.day7?days+"1":days+"0";
    days= req.body.day8?days+"1":days+"0";
    days= req.body.day9?days+"1":days+"0";
    days= req.body.day10?days+"1":days+"0";

    const db_con= db.newConnection();
    db_con.connect();

   // insert a new row into doodle table, consists of 2 values: name and days
    db_con.query(`INSERT INTO Doodle VALUES ('${name}', '${days}')`, (err, rows, field) =>{
        if (err){
            console.log(err);
        }
        
        db_con.end();

        //send the request to another path
        res.redirect('/guest-form');

    });

})


app.use(express.static('public'));

app.listen(port, () => {
    console.log('listening on port ${port}...')
});