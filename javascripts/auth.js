const {getAllMoviesEvent,} = require('./events'); // if you have multiple function being called from same file. just add a comma inside the curly brackets and write them out {blah, blah, blah,}

const checkLoginStatus = () => {
  firebase.auth().onAuthStateChanged ((user) => {
    if (user) {
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
