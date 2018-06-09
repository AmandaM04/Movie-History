(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const tmdb = require('./tmdb');
const fireBaseApi = require('./fireBaseApi');
const {checkLoginStatus,} = require('./auth');

const apiKeys = () => {
  return new Promise((resolve, reject) => {
    $.ajax('./db/apiKeys.json')
      .done((data) => {
        resolve(data.apiKeys);
      })
      .fail((err) => {
        reject(err);
      });
  });
};

const retrieveKeys = () => {
  apiKeys()
    .then((results) => {
      tmdb.setKey(results.tmdb.apiKey);
      fireBaseApi.setConfig(results.firebase);
      firebase.initializeApp(results.firebase);
      checkLoginStatus();
    })
    .catch((err) => {
      console.error('no keys:', err);
    });
};

module.exports = {
  retrieveKeys,
};

},{"./auth":2,"./fireBaseApi":5,"./tmdb":7}],2:[function(require,module,exports){
const {getAllMoviesEvent,} = require('./events'); // if you have multiple function being called from same file. just add a comma inside the curly brackets and write them out {blah, blah, blah,}
const {setUID,} = require('./fireBaseApi');

const checkLoginStatus = () => {
  firebase.auth().onAuthStateChanged ((user) => {
    if (user) {
      setUID(user.uid);
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      $('#movieButt, #navSearch, #logOut').removeClass('hide');
      $('#authentication').addClass('hide');
      getAllMoviesEvent();
    } else {
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
      $('#movieButt, #navSearch, #logOut').addClass('hide');
      $('#authentication').removeClass('hide');
    }
  });
};

module.exports = {
  checkLoginStatus,
};

},{"./events":4,"./fireBaseApi":5}],3:[function(require,module,exports){
const domString = (movieArray, config, whereToPrint, myCollectionMode = false) => {
  let movieString = '';
  movieArray.forEach((movie, index) => {
    if (index % 3 === 0) {
      movieString += `<div class="row">`;
    }
    movieString += `<div class="col-sm-6 col-md-4">`;
    movieString += `<div class="thumbnail movie" data-firebase-id="${movie.id}">`;
    if (myCollectionMode) {
      movieString += `<a class="btn deleteMovieFromCollectionEvent">X</a>`;
    }

    movieString += `<img data-poster="${movie.poster_path}" src="${config.base_url}/w342/${movie.poster_path}" alt="Movie Poster">`;
    movieString += `<div class="caption">`;
    movieString += `<h3 class="movie-title">${movie.original_title ? movie.original_title : movie.title}</h3>`;
    movieString += `<p class="movie-overview">${movie.overview}</p>`;
    if (!myCollectionMode) {
      movieString += `<p><a class="btn btn-default addMovieToWishlist" role="button">Wishlist</a></p>`;
    } else if (myCollectionMode && !movie.isWatched) {
      movieString += `<p><a class="btn btn-primary updateMovieToWatched" role="button">I've Watched It</a></p>`;
    } else {
      movieString += `<p>I'm going to put star rating her one day.</p>`;
    }

    movieString += `</div>`;
    movieString += `</div>`;
    movieString += `</div>`;
    if (index % 3 === 2) {
      movieString += `</div>`;
    }
  });
  printToDom(whereToPrint, movieString);
};

const printToDom = (whereToPrint, stringz) => {
  $(`#${whereToPrint}`).html(stringz);
};

module.exports = {
  domString,
};

},{}],4:[function(require,module,exports){
/* eslint camelcase: 0 */

const tmdb = require('./tmdb');
const fireBaseApi = require('./fireBaseApi');
const dom = require('./dom');

const myLinks = () => {
  $(document).click((e) => {
    if (e.target.id === 'authentication') {
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
    } else if (e.target.id === 'movieButt') {
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      getAllMoviesEvent();
    } else if (e.target.id === 'navSearch') {
      $('#myMovies').addClass('hide');
      $('#search').removeClass('hide');
      $('#authScreen').addClass('hide');
    }
  });
};

const pressEnter = () => {
  // big old keypress event
  $(document).keypress((e) => {
    if (e.key === 'Enter' && !$('#search').hasClass('hide')) {
      const searchWords = $('#searchBar').val().replace('', '%20');
      tmdb.showResults(searchWords);
    }
  });
};

const saveMovieToWishlistEvent = () => {
  $(document).on('click', '.addMovieToWishlist', (e) => {
    const movieToAddCard = $(e.target).closest('.movie'); // target the button with the closet parent that has a class of movie
    const movieToAdd = {
      title: movieToAddCard.find('.movie-title').text(),
      overview: movieToAddCard.find('.movie-overview').text(),
      poster_path: movieToAddCard.find('img').data('poster'),
      rating: 0,
      isWatched: false,
    };
    fireBaseApi.saveMovieToWishlist(movieToAdd)
      .then(() => {
        movieToAddCard.remove();
      })
      .catch((error) => {
        console.error('error in saving movie', error);
      });
  });
};

const getAllMoviesEvent = () => {
  fireBaseApi.getAllMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get all movies', error);
    });
};

const getWatchedMoviesEvent = () => {
  fireBaseApi.getWatchedMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get watched movies', error);
    });
};

const getWishlistMoviesEvent = () => {
  fireBaseApi.getWishlistMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get watched movies', error);
    });
};

const deleteMovieFromFirebase = () => {
  $(document).on('click', '.deleteMovieFromCollectionEvent', (e) => {
    const movieToDeleteId = $(e.target).closest('.movie').data('firebaseId');
    fireBaseApi.deleteMovieFromDb(movieToDeleteId)
      .then(() => {
        getAllMoviesEvent();
      })
      .catch((error) => {
        console.error('error from delete movie', error);
      });
  });
};

const updateMovieEvent = () => {
  $(document).on('click', '.updateMovieToWatched', (e) => {
    const movieToUpdateId = $(e.target).closest('.movie').data('firebaseId');
    const movieToUpdateCard = $(e.target).closest('.movie'); // target the button with the closet parent that has a class of movie
    const updatedMovie = {
      title: movieToUpdateCard.find('.movie-title').text(),
      overview: movieToUpdateCard.find('.movie-overview').text(),
      poster_path: movieToUpdateCard.find('img').data('poster'),
      rating: 0,
      isWatched: true,
    };
    fireBaseApi.updateMovieToWatchedInDb(updatedMovie, movieToUpdateId)
      .then(() => {
        getAllMoviesEvent();
      })
      .catch((error) => {
        console.error('error from update movie', error);
      });
  });
};

const filterEvents = () => {
  $('#filterButtons').on('click', (e) => {
    const classList = e.target.classList;
    if (classList.contains('showWishlist')) {
      // show only isWatched: false
      getWishlistMoviesEvent();
    } else if (classList.contains('showWatched')) {
      // show only isWatched: true
      getWatchedMoviesEvent();
    }
    else if (classList.contains('showAll')) {
      getAllMoviesEvent();
    };
  });
};

const authEvents = () => {
  $('#signIn-btn').click((e) => {
    e.preventDefault();
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        $('#signin-error-msg').text(error.message);
        $('#signin-error').removeClass('hide');
        console.error('error from auth events', error);
      });
  });

  $('#register-btn').click(() => {
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        $('#register-error-msg').text(error.message);
        $('#register-error').removeClass('hide');
        console.error('error from registration events', error);
      });
  });

  $('#register-link').click(() => {
    $('#login-form').addClass('hide');
    $('#registration-form').removeClass('hide');
  });

  $('#logIn-link').click(() => {
    $('#login-form').removeClass('hide');
    $('#registration-form').addClass('hide');
  });

  $('#logOut').click(() => {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
      console.error('error from auth events', error);
    });
  });
};

const initializer = () => {
  myLinks();
  pressEnter();
  saveMovieToWishlistEvent();
  deleteMovieFromFirebase();
  updateMovieEvent();
  filterEvents();
  authEvents();
};

module.exports = {
  initializer,
  getAllMoviesEvent,
};

},{"./dom":3,"./fireBaseApi":5,"./tmdb":7}],5:[function(require,module,exports){
let fireBaseConfig = {};
let uid = '';

const setConfig = (fbConfig) => {
  fireBaseConfig = fbConfig;
};

const setUID = (newUID) => {
  uid = newUID;
};

const saveMovieToWishlist = (newMovie) => {
  newMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `${fireBaseConfig.databaseURL}/movies.json`,
      data: JSON.stringify(newMovie),
    })
      .done((uniqueKey) => {
        resolve(uniqueKey);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getAllMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET', // READ
      url: `${fireBaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            allMoviesObject[fbKey].id = fbKey;
            allMoviesArray.push(allMoviesObject[fbKey]);
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWatchedMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${fireBaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            if (allMoviesObject[fbKey].isWatched) {
              allMoviesObject[fbKey].id = fbKey;
              allMoviesArray.push(allMoviesObject[fbKey]);
            }
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWishlistMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${fireBaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            if (!allMoviesObject[fbKey].isWatched) {
              allMoviesObject[fbKey].id = fbKey;
              allMoviesArray.push(allMoviesObject[fbKey]);
            }
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const deleteMovieFromDb = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `${fireBaseConfig.databaseURL}/movies/${movieId}.json`,
    })
      .done(() => {
        resolve();
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const updateMovieToWatchedInDb = (updatedMovie, movieId) => {
  updatedMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `${fireBaseConfig.databaseURL}/movies/${movieId}.json`,
      data: JSON.stringify(updatedMovie),
    })
      .done((modifiedMovie) => {
        resolve(modifiedMovie);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

module.exports = {
  saveMovieToWishlist,
  setConfig,
  setUID,
  getAllMovies,
  getWatchedMovies,
  getWishlistMovies,
  deleteMovieFromDb,
  updateMovieToWatchedInDb,
};

},{}],6:[function(require,module,exports){
const apiKeys = require('./apiKeys');
const events = require('./events');

apiKeys.retrieveKeys();
events.initializer();

},{"./apiKeys":1,"./events":4}],7:[function(require,module,exports){
/* eslint camelcase: 0 */
const dom = require('./dom');

let tmdbKey = '';
let imageConfig = {};

const setKey = (key) => {
  tmdbKey = key;
  getConfig();
};

const getImageConfig = () => {
  return imageConfig;
};

const getConfig = () => {
  tmdbConfiguration()
    .then((result) => {
      imageConfig = result.images;
    })
    .catch((err) => {
      console.error('error with tmdb config:', err);
    });
};

const tmdbConfiguration = () => {
  return new Promise ((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`)
      .done((data) => {
        resolve(data);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const searchTMD = (txt) => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${txt}&language=en-US&page=1&include_adult=false`)
      .done((result) => {
        resolve(result.results);
      })
      .fail((err) => {
        reject(err);
      });
  });
};

const showResults = (searchText) => {
  searchTMD(searchText)
    .then((result) => {
      dom.domString(result, imageConfig, 'movies');
    })
    .catch((err) => {
      console.error('search error:', err);
    });
};

module.exports = {
  showResults,
  setKey,
  getImageConfig,
};

},{"./dom":3}]},{},[6]);
