angular.module('ngView', ['ngRoute'])

 .controller('MainController', function($scope) {
    $scope.type = 'score';
    $scope.setRoute = function (e) {
        $scope.type = e['target'].innerText;
    };
 })
    //score search controller
    //id: student ID
    //datas: the data which GET form JSONP
    //terms: an Array of terms the student exd, used to output terms list
    //term : used to sort score by term
 .controller('ScoreController', function ($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    var data = window['data'] = function (jsonpdata) {
        $('li.initTerm').addClass('hide');
        $scope.datas = jsonpdata;
        $scope.terms = [];
        angular.forEach($scope.datas, function (v, i) {
            var term = v['Term'];
            $scope.terms.indexOf(term) === -1 && $scope.terms.push(term);
        })
        $scope.terms.sort(function (a, b) {
            return a >= b ? -1 : 1;
        });
        $scope.term = $scope.terms[0];
    };

    $scope.updateTerm = function (e) {
        $scope.term = e['target'].innerText;
    };
    $http.jsonp('http://api.ecjtu.net/score.php?s='+ $scope.id + '&callback=data').
        success(data);
 })

 .controller('CardController', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;

 })

 .controller('ClassController', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;
 })

 .controller('LibraryController', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;
 })

.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/score/:id', {
    templateUrl: '../template/score.html',
    controller: 'ScoreController',
    resolve: {
      // I will cause a 1 second delay
      delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 1000);
        return delay.promise;
      }
    }
  })
  .when('/card/:id', {
    templateUrl: '../template/card.html',
    controller: 'CardController'
  })
  .when('/class/:id', {
    templateUrl: '../template/class.html',
    controller: 'ClassController'
  })
  .when('/library/:id', {
    templateUrl: '../template/library.html',
    controller: 'LibraryController'
  })

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});