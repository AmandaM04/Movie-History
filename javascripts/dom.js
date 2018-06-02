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
