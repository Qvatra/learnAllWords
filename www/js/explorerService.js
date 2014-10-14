angular.module('services').service('explorerService', ['$rootScope', '$q', '$timeout', '$cordovaFile', function ($rootScope, $q, $timeout, $cordovaFile) {
    //console.log('explorerService');
    var vm = this;

    vm.array4browser = [
        { name: 'file1', isFile: true, isDirectory: false },
        { name: 'file2', isFile: true, isDirectory: false },
        { name: 'Directory1', isFile: false, isDirectory: true },
        { name: 'Directory2', isFile: false, isDirectory: true },
        { name: 'file3', isFile: true, isDirectory: false },
        { name: 'Directory3', isFile: false, isDirectory: true }
    ];

    vm.locateRootDir = function (namespace) {
        var deferred = $q.defer();

        $cordovaFile.checkDir(namespace).then(function (res) {
            deferred.resolve(res);
        }, function () {
            //console.log('no dir found. Creating one');
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

        if (ionic.Platform.isWebView()) {
            vm.locateRootDir(namespace).then(function () {
                $cordovaFile.listDir(namespace).then(function (list) {
                    deferred.resolve(list);
                }, function (err) {
                    deferred.reject(err);
                });
            }, function (err) {
                deferred.reject(err);
            });
        } else {
            deferred.resolve(vm.array4browser);
        }

        return deferred.promise;
    }






}]);
