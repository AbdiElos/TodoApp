const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");

const app = express();

const con = require('./models/taskModel')
app.use(express.static('public'));

app.engine('hbs', hbs.engine({
    helpers: {
        isCompleted: function (status) {
            if (status == "completed") {
                return true
            } else {
                return false
            }
        },
    },
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())


app.get('/', (req, res) => {

    let query = "SELECT * FROM Todo";
    let items = []
    con.query(query, (err, result) => {
        if (err) throw err;
        items = result
        console.log(items)
        res.render('index', {
            items: items
        })
    })

});


app.post('/', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO Todo (task, status) VALUES ?";
    data = [
        [req.body.task, "ongoing"]
    ]
    con.query(query, [data], (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/')
    })


})
app.get('/:id', (req, res) => {
    console.log(req.params)
    let query = "DELETE FROM Todo WHERE task_id=" + req.params.id
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/')
    })
});




// port where app is served
app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});