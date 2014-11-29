angular.module('ngView', ['ngRoute'])

 .controller('MainController', function($scope, $animation) {
    $scope.type = 'score';
    var stuIdName = 'student_id';
    var cookie = document.cookie;
    var stuIdStart = cookie.indexOf(stuIdName) + stuIdName.length + 1;
    var stuIdEnd = cookie.indexOf(";",stuIdStart);
    $scope.id = cookie.substring(stuIdStart, stuIdEnd);
    $scope.setRoute = function (e) {
        if (document.cookie.indexOf('uc_token') === -1) 
            window.location.href = 'http://user.ecjtu.net/login?redirect=http://www.ecjtu.net';

        $scope.type = e['target']['alt'];
    };
 })
    //Score Search Controller
    //id: student ID
    //datas: the data which GET form JSONP
    //terms: an Array of terms the student exd, used to output terms list
    //term : used to sort score by term
 .controller('ScoreController', function ($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    var data = window['data'] = function (jsonpdata) {
        $scope.datas = jsonpdata;
        $scope.terms = [];
        angular.forEach($scope.datas, function (v, i) {
            var term = v['Term'];
            $scope.terms.indexOf(term) === -1 && $scope.terms.push(term);
        })
        $scope.terms.sort(function (a, b) {
            return a >= b ? -1 : 1;
        });
        $scope.number = $scope.terms.length;
        $scope.term = $scope.terms[0];
    };

    $scope.updateTerm = function (e) {
        $scope.term = e['target'].innerText;
    };
    $http.jsonp('http://api.ecjtu.net/score.php?s='+ $scope.id + '&callback=data').
        success(data);
 })

 .controller('ClassController', function ($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    $scope.day = new Date().getDay() || 7;
    var dayArr = ['一', '二', '三', '四', '五', '六', '日'];
    var toArray = function (obj) {
      var arr = [];
      for(i in obj) {
        if(obj.hasOwnProperty(i)) arr.push(obj[i]);
      }
      return arr;
    };

    var data = window['data'] = function (jsonpdata) {
        $scope.content = jsonpdata.content;
        $scope.datas = toArray($scope.content[$scope.day]);
        $scope.times = toArray($scope.content['0']);
        angular.forEach($scope.datas, function (v, i) {
            $scope.datas[i] = v.replace()
        });
    };
    $scope.updateDay = function (e) {
      $scope.day = dayArr.indexOf(e.target.innerText)*1 + 1;
      $scope.datas = toArray($scope.content[$scope.day]);
    }
    $http.jsonp('http://class.ecjtu.net/api.php?classID=' + $scope.id + '&callback=data').
        success(data);
 })

 .controller('LibraryController', function ($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
 })

 .controller('CardController', function ($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    var tokenName = 'uc_token';
    var cookie = document.cookie;
    var tokenStart = cookie.indexOf(tokenName) + tokenName.length + 1;
    var tokenEnd = cookie.indexOf(";",tokenStart);
    var token = cookie.substring(tokenStart, tokenEnd);
    var data = window['data'] = function (jsonpdata) {
        $scope.data = jsonpdata;
        $scope.user = jsonpdata['user'];
    };
    $http.jsonp('http://api.ecjtu.net/ykt.php?num=' + $scope.id + '&token=' + token + '&callback=data').
        success(data)

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