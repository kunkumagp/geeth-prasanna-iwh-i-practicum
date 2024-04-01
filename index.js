const express = require('express');
const axios = require('axios');
require('dotenv').config()
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const BASEAPI = process.env.BASEAPI;

const PARAMS = 'limit=10&properties=name&properties=year&properties=genres&archived=false';

app.get('/', async (req, res) => {
    const movies = `${BASEAPI}?${PARAMS}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(movies, { headers });
        const data = resp.data.results;
        console.log(data);
        res.render('movies', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/add', async (req, res) => {
    res.render('add_movies', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/add', async (req, res) => {
    const add = {
        properties: {
            "name": req.body.movieName,
            "year": req.body.releasedYear,
            "genres": req.body.movieGenre,
        }
    }

    const addMovie = `${BASEAPI}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(addMovie, add, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

app.get('/movie-update', async (req, res) => {
    const movies = `${BASEAPI}?${PARAMS}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(movies, { headers });
        const data = resp.data.results;
        res.render('update_movie', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });      
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', async (req, res) => {

    const id = req.query.ObjectId;
    const getMovie = `${BASEAPI}/${id}?properties=name,year,genres`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getMovie, { headers });
        const data = response.data;

        res.render('edit_movie', {name: data.properties.name, year: data.properties.year, genre: data.properties.genres});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update-cobj', async (req, res) => {
    
    const update = {
        properties: {
            "name": req.body.movieName,
            "year": req.body.releasedYear,
            "genres": req.body.movieGenre,
        }
    }

    const id = req.query.ObjectId;
    const updateMovie = `${BASEAPI}/${id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateMovie, update, { headers } );
        res.redirect('/movie-update');
    } catch(err) {
        console.error(err);
    }

});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));