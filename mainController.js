angular.module('app', [])
  .controller('mainController', ['$scope', function ($scope) {
      $scope.mode = 'home';
      $scope.word = 'word';
      $scope.translate = 'слово';


      $scope.home = function () {
          console.log('home');
          $scope.mode = 'home';
      };

      $scope.card = function () {
          console.log('card');
          $scope.mode = 'card';
      };

      $scope.rate = function () {
          console.log('rate');
          $scope.mode = 'rate';
      };

      $scope.settings = function () {
          console.log('settings');
          $scope.mode = 'settings';
      };

  }]);