const domString = (movieArray, config, whereToPrint) => {
  let movieString = '';
  movieArray.forEach((movie, index) => {
    if (index % 3 === 0) {
      movieString += `<div class="row">`;
    }
    movieString += `<div class="col-sm-6 col-md-4">`;
    movieString += `<div class="thumbnail movie">`;
    movieString += `<img data-poster="${movie.poster_path}" src="${config.base_url}/w342/${movie.poster_path}" alt="Movie Poster">`;
    movieString += `<div class="caption">`;
    movieString += `<h3 class="movie-title">${movie.original_title ? movie.original_title : movie.title}</h3>`;
    movieString += `<p class="movie-overview">${movie.overview}</p>`;
    movieString += `<p><a href="#" class="btn btn-primary" role="button">Review</a> <a class="btn btn-default addMovieToWishlist" role="button">Wishlist</a></p>`;
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
