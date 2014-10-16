angular.module('controllers')

.controller('EditCtrl', [
    '$scope',
    '$rootScope',
    'ioService',
    '$q',
    '$ionicPopup',
    '$ionicScrollDelegate',
    '$state',
    'cardService',
    'domCleaner',
    '$cordovaFile',
    function (
        $scope,
        $rootScope,
        ioService,
        $q,
        $ionicPopup,
        $ionicScrollDelegate,
        $state,
        cardService,
        domCleaner,
        $cordovaFile
    ) {
    //console.log('EditCtrl');
    var vm = $scope;

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings
    vm.array = JSON.parse(JSON.stringify($rootScope.dictionary)); //pass-by-value


    $scope.$on("$destroy", function () {
        //console.log('edit destroy');
        domCleaner.removeAllChildren(document.getElementById('dictionary'));
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
        $state.go('tab.explorer', { mode: 'export' });
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
        //vm.array.push({ w: '', t: '', d: 1, r: 1 });
        vm.array.splice(0, 0, { w: '', t: '', d: 1, r: 1 });
        //$ionicScrollDelegate.scrollBottom();
    }

    vm.isDone = function (item) {
        if (item.r == 4 && item.d == 4) return { color: 'rgb(0, 252, 41)' };
        if (item.r < 4 && item.d == 4 || item.r == 4 && item.d < 4) return { color: 'darkorange' };
        if (item.r < 4 && item.d < 4) return { color: 'rgba(128, 128, 128, 0.2)' };
    }


}])