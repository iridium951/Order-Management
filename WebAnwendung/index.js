import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';


const app = express();
const port = process.env.PORT || 8080;

const __dirname = path.resolve();

app.use('/', express.static('public'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.get('/', (request, response) => {
  response.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.listen(port, () => {
  console.log('Server gestartet auf Port: ' + port);
});


const osVersion = os.version();

app.get('/dyna', (request, response) => {
  const message = 'OS Version: ' + osVersion;
  console.log(message);
  response.send('<html><head></head><body>This is your OS Version:<br/>' +
    message +'</body></html>');
});


app.get('/quote', (request, response) => {
  console.log('hi');

  fetch('https://movie-quote-api.herokuapp.com/v1/quote/')
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        response.send('<html><head></head><body>Quote: <br/>' +
    data.quote +' ('+data.show+')</body></html>');
      })
      .catch((error) => {
        console.error('Fehler:', error.message);
      });
});
