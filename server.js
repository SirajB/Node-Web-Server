const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log)
    fs.appendFile('server.log', log + '\n', (err)=>{
        if (err) {
            console.log('Unable to append to server.log')
        }
    });
    next();
});

// app.use((req,res,next)=>{
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname+'/public'));




hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) =>{
    return text.toUpperCase();
});


app.get('/',(req, res,) =>{
   res.render('home.hbs',{
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear(),
        welcomeMessage: 'Welcome to this basic site'
   })
});

app.get('/about', (req, res) => {
    res.render('about.hbs',{
        pageTitle: 'About Page',
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs',{
        pageTitle: 'Projects Page',
        welcomeMessage: 'This is where you can access my projects'
    });
});

app.get('/weather-app', (req, res) => {
    res.render('weather-app.hbs',{
        pageTitle: 'Weather App',
        welcomeMessage: 'Find the weather depending on what your city + country or address or postcode are! !'
    });
});


app.get('/bad', (req,res) => {
    res.send({
       errorMessage: 'Error cannot handle request'
    });
});


app.listen(port, () => {
    console.log(`Sever is up on port ${port}`)
});