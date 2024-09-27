getQuote = function() {
  fetch('https://movie-quote-api.herokuapp.com/v1/quote/')
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        document.getElementById('text').innerHTML = `<h3>Quote of the day: ${data.quote} (${data.show})</h3>`;
      })
      .catch((error) => {
        console.error('Fehler:', error.message);
      });
};

getShow = function() {
  const apiUrl = 'https://movie-quote-api.herokuapp.com/v1/shows/';

  fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        let text = '<hr/>All shows:<table>';
        for (i = 0; i < data.length; i++) {
          text = text +
          `<tr>
  <td>${i}</td>
  <td>${data[i].name}</td>
  <td><a href="${apiUrl}${data[i].slug}">Quote</a></td>
  <td><div onclick="getShowQuote('${data[i].slug}')"><b>Get quote</b></div></td>
  </tr>`;
        }
        text = text + '</table>';
        document.getElementById('text').innerHTML = text;
      })
      .catch((error) => {
        console.error('Fehler:', error.message);
      });
};

getShowQuote = function(slug) {
  const apiUrl = 'https://movie-quote-api.herokuapp.com/v1/shows/' + slug;

  fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        document.getElementById('quote').innerHTML = `<h3>Quote of the day: ${data.quote} (${data.show})</h3>`;
      })
      .catch((error) => {
        console.error('Fehler:', error.message);
        document.getElementById('quote').innerHTML = `<h3>Quote not found for: ${slug}</h3>`;
      });
};

searchShow = function(query) {
  const apiUrl = `https://api.tvmaze.com/search/shows?q=${query}`;
  fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const results = data.map((element) => element.show);
        renderResults(results);
      });
};

renderResults = function(results) {
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  results.forEach((result) => {
    console.log(JSON.stringify(result));
    const element = document.createElement('li');
    const lName = result.name.toLowerCase();
    element.innerHTML = `<div onclick="getShowQuote('${lName}')">${result.name} <b>Get quote</b></div>`;
    list.appendChild(element);
  });
};

let searchTimeoutToken = 0;

window.onload = () => {
  const searchFieldElement = document.getElementById('searchField');
  searchFieldElement.onkeyup = (event) => {
    clearTimeout(searchTimeoutToken);

    searchTimeoutToken = setTimeout(() => {
      searchShow(searchFieldElement.value);
    }, 250);
  };
};
