app.controller('HomeController', function($scope, $http) {


  // check if user logged in and set userLoggedIn boolean
  // TODO uncomment if you need to manipulate user data back from the server
  /*
  loggedIn.getUser().then(
  function(payload) {
  if (payload.data) {
  // TODO get the data you need from the User object stored in payload.data
} else {
console.log("The user is logged out")
}
},
function(errorPayload) {
console.log("Error: " + errorPayload)
});
*/
/*

getItems = function() {
  var open = ['<div class="grid-item">', '<div class="grid-item grid-item--height2">', '<div class="grid-item grid-item--height3">', '<div class="grid-item grid-item--height4">', '<div class="grid-item grid-item--height5">'];
  var imgOpen = '<img src="./img/bg_';
  var imgClose = '.jpg" class="fit-img"/>';
  var close = "</div>"
  // generat random content
  var items = '';
  for (var i = 0; i < 50; i++) {
    // create new item elements
    items += open[Math.floor((Math.random() * open.length))] + imgOpen + Math.floor((Math.random() * 10) + 1) + imgClose + close;
  } console.log(items);
  return items;
}
*/

var $container = $('.grid');
/*
// add new images
var items = getItems();
$container.prepend($(items));
// use ImagesLoaded
$container.imagesLoaded()
  .always( function( instance ) {
    //  console.log('all images loaded');
    })
    .done( function( instance ) {
    //  console.log('all images successfully loaded');
    })
    .fail( function() {
    //  console.log('all images loaded, at least one is broken');
    })
    .progress( function( instance, image ) {
      var result = image.isLoaded ? 'loaded' : 'broken';
    //  console.log( 'image is ' + result + ' for ' + image.img.src );
    });
    */

// set masonry grid width
$container.masonry({
  itemSelector: '.grid-item',
  columnWidth: 100,
  gutter: 5
});

});
