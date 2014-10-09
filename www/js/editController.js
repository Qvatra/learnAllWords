angular.module('controllers')

.controller('EditCtrl', ['$scope', '$rootScope', 'ioService', '$q', '$ionicPopup', function ($scope, $rootScope, ioService, $q, $ionicPopup) {
    console.log('EditCtrl');
    var vm = $scope;


    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings
    vm.array = $rootScope.dictionary;



    vm.save = function () {

    }


    vm.cancel = function () {

    }


    vm.import = function () {
        var filename = 'dutch.js';
        $ionicPopup.confirm({ title: 'Are you sure?', template: 'You are about to download '+filename+' dictionary. Current dictionary data will be lost.', cancelType: 'button-positive', okType: 'button-balanced' })
            .then(function (ok) {
                if (ok) {
                    ioService.importDictioinary('/' + filename).then(function (result) {
                        vm.array = result;
                        $rootScope.dictionary = vm.array;
                    });
                }
            });
    }


    vm.deleteAll = function () {
        $ionicPopup.confirm({ title: 'Are you sure?', template: 'You are about to delete all items in the dictionary', cancelType: 'button-positive', okType: 'button-balanced' })
            .then(function (ok) {
                if (ok) {
                    $rootScope.dictionary = [];
                    vm.array = [];
                }
            });
    }


    vm.deleteItem = function (idx) {
        vm.array.splice(idx, 1);
        $rootScope.dictionary = vm.array;
    }


    vm.addItem = function () {
        console.log(vm.array);
        vm.array.push({ w: '', t: '', d: 1, r: 1 });
        $rootScope.dictionary = vm.array;
    }


}])