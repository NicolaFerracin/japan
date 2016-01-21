app.controller('HomeController', function($scope, $http, loggedIn, $location) {

  $scope.myWonders = []

  // load all wonders by username
  loggedIn.getUser().then(
    function(payload) {
      if (payload.data) {
        $scope.userLoggedIn = true;
        $scope.user = payload.data
      }
    },
    function(errorPayload) {
      console.log("Error: " + errorPayload)
    });


    // get all Wonders
    $http.get("/api/wonders")
    .success(function(wonders) {
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
    });


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
