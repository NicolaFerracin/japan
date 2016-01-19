app.controller('MyWondersController', function($scope, $http, loggedIn, $location) {

  var myWonders = [];
  var $container = $('.grid');

  // TODO load all wonders by user email
  loggedIn.getUser().then(
    function(payload) {
      if (payload.data) {
        // get all the books owned by the user
        $http.get("/api/wonders/" + payload.data.username)
        .success(function(wonders) {
          appendWonder(wonders);
        })
        .error(function(err) {
          console.log("An error occured: " + err);
        })
      } else {
        $location.path("/login");
        return;
      }
    },
    function(errorPayload) {
      console.log("Error: " + errorPayload)
    });


    // TODO show all wonders loaded above

    // create new wonders
    $scope.createWonder = function(wonder) {
      // check if user logged in
      loggedIn.getUser().then(
        function(payload) {
          if (payload.data) {
            // check if valid images
            $("<img>", {
              src: wonder.link,
              error: function() {
                // if not valid image
                $scope.showUrlError = true;
                $scope.$apply() },
                load: function() {
                  $scope.showUrlError = false;
                  // update Wonder obj with missing info
                  wonder.likes = 0;
                  wonder.user = payload.data.username;
                  // store in database
                  $http.post("/api/wonder", wonder)
                  .success(function(status) {
                    $scope.wonder = null;
                    $('#newWonderModal').modal('hide'); // hide modal for creating new wonder
                    appendWonder(wonder);
                    console.log(status + " Data saved.");
                  })
                  .error(function(err) {
                    console.log("An error occured: " + err);
                  })
                }
              });
            } else {
              $location.path("/login");
              return;
            }
          },
          function(errorPayload) {
            console.log("Error: " + errorPayload)
          });
        }

        // TODO delete wonder



        // refresh view to show a wonder
        var appendWonder = function(wonder) {
          if (wonder.constructor === Array) {
            for (var i = 0; i < wonder.length; i++) {
              var item = generateHtml(wonder[i]);
              $container.prepend(item);
            }
          } else {
            var item = generateHtml(wonder);
            var $item = $(item)
            $container.prepend($item).masonry('prepended', $item);
          }
          $container.masonry({
            itemSelector: '.grid-item',
            columnWidth: 100,
            gutter: 5
          });

        }

        // generate random masonry tile layout for new wonder
        var generateHtml = function(wonder) {
          var pt1 = '<div class="grid-item  black" align="center"><div class="content"><img src="'
          var pt2 = '" class="fit-img"/><hr><h1>'
          var pt3 = '</h1><a href="#" onclick="click()" id="like"><span>'
          var pt4 = ' </span><span class="glyphicon glyphicon glyphicon-thumbs-up" aria-hidden="true"></span></a></div></div>'
          return pt1 + wonder.link + pt2 + wonder.title + pt3 + wonder.likes + pt4;
        }


      function click() {
        console.loog("hahah")
      }
      });
