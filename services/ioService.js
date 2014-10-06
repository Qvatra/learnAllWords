angular.module('app').service('ioService', ['$q', '$http', '$timeout', function ($q, $http, $timeout) {
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
                vm.saveDictionary(array);
                deferred.resolve(array);
            }).error(function (data, status, headers, config) {
                console.log('ioService: read failed');
                deferred.reject(dta);
            });

        return deferred.promise;
    };



    vm.saveDictionary = function (arr) {
        $timeout(function () {
            localStorage.setItem('dictionary', JSON.stringify(arr));
        });
    }



    vm.loadDictionary = function () {
        return (localStorage.getItem('dictionary')) ? JSON.parse(localStorage.getItem('dictionary')) : [];
    }



}]);