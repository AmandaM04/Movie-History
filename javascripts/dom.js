const domString = (movieArray, config) => {
  let movieString = '';
  movieArray.forEach((movie, index) => {
    if (index % 3 === 0) {
      movieString += `<div class="row">`;
    }
    movieString += `<div class="col-sm-6 col-md-4">`;
    movieString += `<div class="thumbnail">`;
    movieString += `<img src="${config.base_url}/w342/${movie.poster_path}" alt="Movie Poster">`;
    movieString += `<div class="caption">`;
    movieString += `<h3>${movie.original_title}</h3>`;
    movieString += `<p>${movie.overview}</p>`;
    movieString += `<p><a href="#" class="btn btn-primary" role="button">Review</a> <a href="#" class="btn btn-default" role="button">Wishlist</a></p>`;
    movieString += `</div>`;
    movieString += `</div>`;
    movieString += `</div>`;
    if (index % 3 === 2) {
      movieString += `</div>`;
    }
  });
  printToDom(movieString);
};

const printToDom = (stringz) => {
  $('#movies').html(stringz);
};

module.exports = {
  domString,
};
