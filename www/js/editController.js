angular.module('controllers')

.controller('EditCtrl', ['$scope', '$rootScope', 'ioService', '$q', '$ionicPopup', '$ionicScrollDelegate', '$state', function ($scope, $rootScope, ioService, $q, $ionicPopup, $ionicScrollDelegate, $state) {
    console.log('EditCtrl');
    var vm = $scope;

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings
    vm.array = JSON.parse(JSON.stringify($rootScope.dictionary)); //pass-by-value


    $scope.$on("$destroy", function () {
        console.log('edit destroy');
    });


    vm.save = function () {
        $rootScope.dictionary = vm.array;
        ioService.saveDictionary(vm.array);
        $state.go('tab.dash', {});
    }


    vm.cancel = function () {
        $state.go('tab.dash', {});
    }


    vm.import = function () {
        $state.go('tab.explorer', { mode: 'import' });
    }

    vm.export = function () {
        $state.go('tab.explorer', {mode: 'export'});
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
    }


    vm.addItem = function () {
        vm.array.push({ w: '', t: '', d: 1, r: 1 });
        $ionicScrollDelegate.scrollBottom();
    }


}])