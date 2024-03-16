const { faker } = require('@faker-js/faker');
const mysql=require(`mysql2`);
const express=require('express');
const app=express();
const port=8080;

const methodOverride = require('method-override'); // Corrected spelling
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


const path=require("path");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Ss321;;;;;'
});
let getrandomuser = ()=>  {
    return [
       faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
    ];
  }
q="insert into user (id,username,email,password) values ?";
data=[]
for (let i=0;i<100;i++)
{
    data.push(getrandomuser());
}
app.listen(8080,(req,res)=>
{
console.log(`port ${port}`);
});


app.get("/", (req, res) => {
    try {
      // Select user count with aliasing
      const query = `SELECT COUNT(*) AS user_count FROM user`;
      connection.query(query, (err, result) => {
        if (err) throw err;
  
        const usercount = result[0].user_count; // Access aliased column name
        console.log(result);
        console.log(result[0]); 
        console.log(result[0].user_count);
  
        // Render the home.ejs with user count
        res.render("home.ejs", { usercount });
      });
    } catch (err) {
      console.error("Error fetching user count:", err);
      res.status(500).send("Internal Server Error"); // More informative error response
    }
  });
  
app.get("/user",(req,res)=>
{
    let m=`select *from user`;
    try{
    connection.query(m, (err, result) =>
     {
        if (err) throw err;
        res.render("show.ejs",{result});
      });
    } catch (err) {
      console.error("Error fetching user count:", err);
      res.status(500).send("Internal Server Error"); // More informative error response
    }
});

//this is for just editing get method used for editing and it will redirect to edit ejs thats it
app.get("/user/:id/edit",(req,res)=>
{
    let { id } = req.params;
    let q = `select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result) =>
         {
            if (err) throw err;
          
            console.log(result);
            let user=result[0];
            res.render("edit.ejs",{user});

          });
        } catch (err) {
          console.error("Error fetching user count:", err);
          res.status(500).send("Internal Server Error"); // More informative error response
        }
})
app.patch("/user/:id",(req,res)=>
{
let { id } = req.params;
let q = `select * from user where id='${id}'`;
let {password:newpassword ,username:newusername}=req.body;
try{
    connection.query(q, (err, result) =>
     {
        if (err) throw err;
        let user=result[0];
        console.log(newpassword!=user.password);
        if(newpassword!=user.password)
        {
            res.send("wrong password");
        }
        else{
          let q2=`update user set username=${newusername} where id=${id}`;
          connection.query(q2,(err,result)=>
          {
            if(err) throw err
            res.redirect("/user");
          })
        }
      });
    } catch (err) {
      console.error("Error fetching user count:", err);
      res.status(500).send("Internal Server Error"); // More informative error response
    }
});
  


/*try{
    connection.query(q,[data],(err,result)=>
    {
        if (err) throw err;
        console.log(result);
    });
    }
    catch(err)
    
    {
        console.log(err);
    }

    connection.end();
    */