// DO NOT FORGET TO INSTALL FILE PLUGIN

angular.module('controllers')

.controller('ExplorerCtrl', ['$scope', '$rootScope', '$cordovaFile', '$q', '$state', function ($scope, $rootScope, $cordovaFile, $q, $state) {
    console.log('ExplorerCtrl');
    var vm = $scope;

    vm.array;

    if (!$rootScope.dictionary) $state.go('tab.dash', {});

    vm.locateRootDir = function (namespace) {
        var deferred = $q.defer();

        $cordovaFile.checkDir(namespace).then(function (res) {
            deferred.resolve(res);
        }, function () {
            console.log('no dir found. Creating one');
            $cordovaFile.createDir(namespace).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });
        });

        return deferred.promise;
    }


    vm.getList = function (namespace) {
        var deferred = $q.defer();

        vm.locateRootDir(namespace).then(function () {
            $cordovaFile.listDir(namespace).then(function (list) {
                deferred.resolve(list);
            }, function (err) {
                deferred.reject(err);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }


    vm.getList('com.learn.cards').then(function (list) {
        console.log(list);
        vm.array = list;
    });


}])