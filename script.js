///API key -- 68f1fefa

const key = '68f1fefa';

var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');


fetch('http://www.omdbapi.com/?i=tt3896198&apikey=68f1fefa')
    .then(response => response.json())
    .then(data => console.log(data))

// upon keypress-- function findmovies is intiated 
searchInput.addEventListener('input', findMovies);


async function singleMovie() {
    // finding id of the movie from the URL 
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

    // Making the output html by string interpolition
    var output = `

      <div class="movie-poster">
          <img src=${data.Poster} alt="Movie Poster">
      </div>
      <div class="movie-details">
          <div class="details-header">
              <div class="dh-ls">
                  <h2>${data.Title}</h2>
              </div>
              <div class="dh-rs">
                  <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
              </div>
          </div>
          <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                      style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
          <ul class="details-ul">
              <li><strong>Actors: </strong>${data.Actors}</li>
              <li><strong>Director: </strong>${data.Director}</li>
              <li><strong>Writers: </strong>${data.Writer}</li>
          </ul>
          <ul class="details-ul">
              <li><strong>Genre: </strong>${data.Genre}</li>
              <li><strong>Release Date: </strong>${data.DVD}</li>
              <li><strong>Box Office: </strong>${data.BoxOffice}</li>
              <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
          </ul>
          <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
          <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
              <i class="fa-solid fa-award"></i>
              &thinsp; ${data.Awards}
          </p>
      </div> 
      `
    // Appending the output
    document.querySelector('.movie-container').innerHTML = output

}


async function addTofavorites(id) {
    console.log("fav-item", id);

    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);// math.random for the unique key and value pair
    alert('Movie Added to Watchlist!');
}

// removing the movie from the favorite list and alert 

async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        // If the ID passed as argument matches with value associated with key, then removing it 
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    //Alerting the user and refreshing the page
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}

///Displaying the movie on the search page according to the user 

async function displayMovieList(movies) {
    var output = '';
    // traversing over movie list which is passed as an argument
    for (i of movies) {
        var img = ''
        if (i.poster !== 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'img/blank-ppster.webp';
        }
        var id = i.imdbID
    }

    // Appending the output through string interpolation

    output += `
    
    <div class="fav-item">
    <div class="fav-poster">
    <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
    </div>
    <div class="fav-details">
        <div class="fav-details-box">
            <div>
                <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
            </div>
            <div>
                <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
            </div>
        </div>
    </div>
</div>

`

    // Appending this to the movie display class of the our html page 

    document.querySelector('.fav-container').innerHTML = output;
    console.log("here is movie list...", movies)
}




async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Search) {
        //Calling the function to display list of the movies related to the user search
        displayMovieList(data.Search)
    }
}

// Favorite movies are loaded on to the fav page from local storage 
async function favoritesMovieLoader() {

    var output = ''
    //Traversing over all the movies in the localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            //Fetching the movie through id 
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);


            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;
            //Adding all the movie html in the output using interpolition
            output += `

        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
        }

    }
    //Appending the html to the movie-display class in favorites page 
    document.querySelector('.fav-container').innerHTML = output;
}
