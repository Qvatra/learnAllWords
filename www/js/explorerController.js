// DO NOT FORGET TO INSTALL FILE PLUGIN

angular.module('controllers')

.controller('ExplorerCtrl', ['$scope', '$rootScope', '$cordovaFile', '$q', '$state', 'explorerService', function ($scope, $rootScope, $cordovaFile, $q, $state, explorerService) {
    console.log('ExplorerCtrl');
    var vm = $scope;

    vm.array;
    vm.currentUrl = 'cur url';

    if (!$rootScope.dictionary) $state.go('tab.dash', {});



    if (ionic.Platform.isWebView()) {
        explorerService.getList('com.learn.cards').then(function (list) {
            console.log(list);
            vm.array = list;
        });
    } else {
        vm.array = [
            { name: 'file1', isFile: true, isDirectory: false },
            { name: 'file2', isFile: true, isDirectory: false },
            { name: 'Directory1', isFile: false, isDirectory: true },
            { name: 'Directory2', isFile: false, isDirectory: true },
            { name: 'file3', isFile: true, isDirectory: false },
            { name: 'Directory3', isFile: false, isDirectory: true }
        ];
    }


    vm.folderClick = function (url) {
        console.log(url);
    }


    vm.fileClick = function (url) {
        console.log(url);
    }

    vm.save = function () {
        console.log('save');
    }

    vm.cancel = function () {
        console.log('cancel');
    }

    vm.goBack = function () {

    }

}])