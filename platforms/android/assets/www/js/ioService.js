angular.module('services').service('ioService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    console.log('io');
    var vm = this;

    //var deferred = $q.defer();
    //deferred.resolve();
    //return deferred.promise;

    vm.initialize = function () {
        $rootScope.dictionary = (localStorage.getItem('dictionary')) ? JSON.parse(localStorage.getItem('dictionary')) : [];
        $rootScope.settings = (localStorage.getItem('settings')) ? JSON.parse(localStorage.getItem('settings')) : { direction: 'both', w1: '5', w2: '15', w3: '30', w4: '50' };
    }


    vm.saveDictionary = function (arr) {
        $timeout(function () {
            localStorage.setItem('dictionary', JSON.stringify(arr));
        });
    }

    
    vm.importDictioinary = function (filepath) {
        var deferred = $q.defer();

        $http.get(filepath)
            .success(function (data, status, headers, config) {
                var pairs = data.split('\n');
                var array = pairs.map(function (item) {
                    return { w: item.split(';')[0].trim(), t: item.split(';')[1].trim(), d: 1, r: 1 };
                });
                vm.saveDictionary(array);
                deferred.resolve(array);
            }).error(function (data, status, headers, config) {
                console.log('ioService: import failed');
                deferred.reject(data);
            });

        return deferred.promise;
    }


}]);