angular.module('services').service('explorerService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    console.log('explorerService');
    var vm = this;

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






}]);
