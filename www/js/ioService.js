angular.module('services').service('ioService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    console.log('io');
    var vm = this;

    vm.initialize = function () {
        $rootScope.dictionary = (localStorage.getItem('dictionary')) ? JSON.parse(localStorage.getItem('dictionary')) : [];
        $rootScope.settings = (localStorage.getItem('settings')) ? JSON.parse(localStorage.getItem('settings')) : { direction: 'both', w1: '5', w2: '15', w3: '30', w4: '50' };
    }


    vm.saveDictionary = function (arr) {
        $timeout(function () {
            localStorage.setItem('dictionary', JSON.stringify(arr));
        });
    }


    vm.saveSettings = function () {
        $timeout(function () {
            localStorage.setItem('settings', JSON.stringify($rootScope.settings));
        });
    }

}]);