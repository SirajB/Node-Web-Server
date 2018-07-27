const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
//Weather api
const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    address: {
      demand: true,
      alias: 'a',
      descrive: 'Address to fetch weather for',
      string: true,
    },
  })
  .help()
  .alias('help', 'h')
  .argv;
const googleApiKey = 'AIzaSyCwn-SI7Qi2DfGp77DhirijUp0tlSLqM_c';
const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;


function farenheightToCelsius(temperature) {
  return Math.round((((temperature - 32) * 5) / 9) * 100) / 100;
}

//Weather Api end




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

app.post('/weather-app', (req, res) => {
    request(geocodeUrl, (err, responce, body) =>{
        if (err){
            axios.get(geocodeUrl).then((responce)=> {
                if (responce.data.status === 'ZERO_RESULTS'){
                    throw new Error('Unable to find that address');
                }
                const lat = response.data.results[0].geometry.location.lat;
                const lng = response.data.results[0].geometry.location.lng;
                 const weatherUrl = `https://api.darksky.net/forecast/b7982ff2d7186a3ca6b3bf1db8dfeea6/${lat},${lng}`;
                 console.log(response.data.results[0].formatted_address);
                return axios.get(weatherUrl);
            }).then((responce) => {
                const temperature = responce.data.currently.temperature;
                const apparentTemperature = response.data.currently.apparentTemperature;
                let weatherText =`It is currently ${temperature}.  It feels like ${apparentTemperature}.` +'\n'+`This would be ${farenheightToCelsius(temperature)} degrees Celsius. Which would feel like ${farenheightToCelsius(apparentTemperature)} degrees Celsius`;
            }).catch((e)=> {
                if (e.code === 'ENOTFOUND') {
                    console.log('Unable to connect to API servers');
                } else {
                    console.log(e.message);
                }
            })
        } else {
            axios.get(geocodeUrl).then((responce)=> {
                if (responce.data.status === 'ZERO_RESULTS'){
                    throw new Error('Unable to find that address');
                }
                const lat = response.data.results[0].geometry.location.lat;
                const lng = response.data.results[0].geometry.location.lng;
                 const weatherUrl = `https://api.darksky.net/forecast/b7982ff2d7186a3ca6b3bf1db8dfeea6/${lat},${lng}`;
                 console.log(response.data.results[0].formatted_address);
                return axios.get(weatherUrl);
            }).then((responce) => {
                const temperature = responce.data.currently.temperature;
                const apparentTemperature = response.data.currently.apparentTemperature;
                let weatherText =`It is currently ${temperature}.  It feels like ${apparentTemperature}.` +'\n'+`This would be ${farenheightToCelsius(temperature)} degrees Celsius. Which would feel like ${farenheightToCelsius(apparentTemperature)} degrees Celsius`;
            }).catch((e)=> {
                if (e.code === 'ENOTFOUND') {
                    console.log('Unable to connect to API servers');
                } else {
                    console.log(e.message);
                }
            })
        }
    })
})


app.get('/bad', (req,res) => {
    res.send({
       errorMessage: 'Error cannot handle request'
    });
});


app.listen(port, () => {
    console.log(`Sever is up on port ${port}`)
});