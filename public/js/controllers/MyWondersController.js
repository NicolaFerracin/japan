app.controller('MyWondersController', function($scope, $http, loggedIn, $location) {

  $scope.myWonders = [];

  // load all wonders by username
  loggedIn.getUser().then(
    function(payload) {
      if (payload.data) {        
        $scope.userLoggedIn = true;
        $scope.user = payload.data
        // get all the books owned by the user
        $http.get("/api/wonders/" + payload.data)
        .success(function(wonders) {
          if (wonders.length == 0) {
            return;
          }
          loop(wonders.length - 1);
          function loop (i) {
            setTimeout(function () {
              $scope.myWonders.push(wonders[i]);
              $scope.$apply();
              if (i > 0) {
                i--;
                loop(i);
              }
            }, 100)
          }(wonders.length);
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

    // create new wonders
    $scope.createWonder = function(wonder) {
      // while creating disable all likes and delete and new wonder buttons
      $scope.isProcessing = true;
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
                  wonder.user = payload.data;
                  // store in database
                  $http.post("/api/wonder", wonder)
                  .success(function(status) {
                    $scope.wonder = null;
                    jQuery.noConflict(); // avoid bootstrap conflicts
                    $('#newWonderModal').modal('hide'); // hide modal for creating new wonder
                    $scope.myWonders.unshift(wonder);
                    console.log(status + " Data saved.");
                    // re-enable all buttons
                    $scope.isProcessing = false;
                  })
                  .error(function(err) {
                    console.log("An error occured: " + err);
                    // re-enable all buttons
                    $scope.isProcessing = false;
                  })
                }
              });
            } else {
              $location.path("/login");
              return;
            }
          },
          function(errorPayload) {
            console.log("Error: " + errorPayload);
            // re-enable all buttons
            $scope.isProcessing = false;
          });
        }

        // delete wonder
        $scope.deleteWonder = function(index) {
          // while deleting disabled all likes and delete and new wonder buttons
          $scope.isProcessing = true;
          // check if user logged in
          loggedIn.getUser().then(
            function(payload) {
              if (payload.data) {
                // make sure user is owner
                if (payload.data != $scope.myWonders[index].user) {
                  $location.path("/login");
                }
                // delete wonder from DB using its id
                $http.delete('/api/wonder/' + $scope.myWonders[index]._id)
                .success(function(status) {
                  // update view
                  $scope.myWonders.splice(index, 1);
                  console.log(status + " Wonder deleted.");
                  // re-enable all buttons
                  $scope.isProcessing = false;
                })
                .error(function(err) {
                  console.log("An error occured: " + err);
                  // re-enable all buttons
                  $scope.isProcessing = false;
                })
              } else {
                $location.path("/login");
                return;
              }
            },
            function(errorPayload) {
              console.log("Error: " + errorPayload);
              // re-enable all buttons
              $scope.isProcessing = false;
            });
          }

          // update likes counter
          $scope.like = function(index) {  // while creating disable all likes and delete and new wonder buttons
            $scope.isProcessing = true;
            // check if user logged in
            loggedIn.getUser().then(
              function(payload) {
                if (payload.data) {
                  // make sure user is owner
                  if (payload.data != $scope.myWonders[index].user) {
                    $location.path("/login");
                  }
                  // update entry in database. Send id and user
                  $http.put("/api/wonder", $scope.myWonders[index])
                  .success(function(status) {
                    $scope.myWonders[index].likes++;
                    console.log(status + " Likes count updated.");
                    // re-enable all buttons
                    $scope.isProcessing = false;
                  })
                  .error(function(err) {
                    alert("An error occured: " + err);
                    // re-enable all buttons
                    $scope.isProcessing = false;
                  })
                } else {
                  $location.path("/login");
                  return;
                }
              },
              function(errorPayload) {
                console.log("Error: " + errorPayload);
                // re-enable all buttons
                $scope.isProcessing = false;
              });
            }



          });
