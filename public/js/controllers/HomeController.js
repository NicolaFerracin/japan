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

// set masonry grid width
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: 105
});

getItems = function() {
  var open = ['<div class="grid-item">', '<div class="grid-item grid-item--height2">', '<div class="grid-item grid-item--height3">', '<div class="grid-item grid-item--height4">', '<div class="grid-item grid-item--height5">'];

  var imgOpen = '<img src="./img/bg_';
  var imgClose = '.jpg" class="fit-img"/>';

  var close = "</div>"
  // generat random content
  var items = '';
  for (var i = 0; i < 100; i++) {
    // create new item elements
    items += open[Math.floor((Math.random() * open.length))] + imgOpen + Math.floor((Math.random() * 10) + 1) + imgClose + close;
  }
  return items;
}

$.fn.masonryImagesReveal = function( $items ) {
  var msnry = this.data('masonry');
  var itemSelector = msnry.options.itemSelector;
  // hide by default
  $items.hide();
  // append to container
  this.append( $items );
  $items.imagesLoaded().progress( function( imgLoad, image ) {
    // get item
    // image is imagesLoaded class, not <img>, <img> is image.img
    var $item = $( image.img ).parents( itemSelector );
    // un-hide item
    $item.show();
    // masonry does its thing
    msnry.appended( $item );
  });
  return this;
};


var $container = $('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: 105
});

var $items = getItems();
$container.masonryImagesReveal($items);


});
