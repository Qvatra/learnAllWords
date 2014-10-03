﻿angular.module('app').service('ioService', ['$q', '$http', function ($q, $http) {
    console.log('io');
    var vm = this;

    vm.parseDictionary = function (filepath) {
        var deferred = $q.defer();

        $http.get(filepath)
            .success(function (data, status, headers, config) {
                var pairs = data.split('\n');
                var array = pairs.map(function (item) {
                    return { w: item.split(';')[0].trim(), t: item.split(';')[1].trim(), d: 1, r: 1};
                });
                deferred.resolve(array);
            }).error(function (data, status, headers, config) {
                console.log('ioService: read failed');
                deferred.reject(dta);
            });

        return deferred.promise;
    };


}]);