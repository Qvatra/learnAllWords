angular.module('controllers')

.controller('EditCtrl', ['$scope', '$rootScope', 'ioService', '$q', function ($scope, $rootScope, ioService, $q) {
    console.log('EditCtrl');
    var vm = $scope;

    vm.array = $rootScope.dictionary;

    vm.importDictioinary = function () {
        ioService.importDictioinary('/dutch.js').then(function (array) {
            $rootScope.dictionary = array;
            vm.array = array;
        });
    }

}])