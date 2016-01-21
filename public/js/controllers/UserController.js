app.controller('UserController', function($scope, $http, loggedIn, $location, $routeParams) {

  $scope.myWonders = [];
  $scope.requestedUser = $routeParams.user;

  // get all the books owned by the user
  $http.get("/api/wonders/" + $routeParams.user)
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
