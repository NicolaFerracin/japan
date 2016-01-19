app.controller('IndexController', function($scope, $http, loggedIn, $location) {

  // at page load
  // check if user logged in and set userLoggedIn boolean
  loggedIn.getUser().then(
    function(payload) {
      if (payload.data) {
        $scope.userLoggedIn = true;
        $scope.username = payload.data.username;
      } else {
        console.log("The user is not logged in")
      }
    },
    function(errorPayload) {
      console.log("Error: " + errorPayload)
    });

    // show a random background
    var url = "./img/bg_" + Math.floor((Math.random() * 10) + 1) + ".jpg";
    $('body').css("background-image", "url(" + url + ")");


    $scope.logout = function() {
      // user is logging out
      $http.get("/logout")
      .success(function() {
        $scope.userLoggedIn = false;
        var privateLocations = ['/myWonders']; // include any private route as "/privateView"
        if (privateLocations.indexOf(window.location.pathname) > -1) {
          $location.path("/login");
        }
      })
      .error(function(err) {
        console.log("An error occured: " + err);
      })
    }
  });
