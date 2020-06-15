const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '2c51fc2ac7331f8f597f',
      database : 'smart-brain'
    }
});


db.select('*')
.from('users').withSchema('public')
.then((data) => {
    console.log(data);
});

const app = express();

const database = {
    users:[
        {
            id:'123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
   login: [
    {
        id:'987',
        hash: '',
        email: 'john@gmail.com'
    }
]
}

app.use(bodyParser.json());

app.use(cors());

app.get('/', (req,res)=> {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in')
        }
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
   db('users').insert({
       email: email,
       name: name,
       joined: new Date()
   }).then(console.log)
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res) => {
const { id } = req.params;
const found = false;
database.users.forEach(user => {
    if (user.id === id) {
        found = true;
       return res.json(user);
    } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
const { id } = req.body;
let found = false;
database.users.forEach(user => {
    if (user.id === id) {
        found = true;
        user.entries++
       return res.json(user.entries);
    } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000,() => {
    console.log('app is running on port 3000');
})

/*
Setting up the database #302 

1.

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

2.

CREATE TABLE login (
    id serial PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
)

*/