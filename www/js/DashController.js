angular.module('controllers')

.controller('DashCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    console.log('DashCtrl');
    var vm = $scope;

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings

    vm.start = function () {
        if (!$rootScope.dictionary || $rootScope.dictionary.length == 0) {
            $ionicPopup.alert({ title: 'First you need to load or create a dictionary!' }).then(function () {
                $state.go('tab.edit', {});
            });
        } else {
            $state.go('tab.card', {});
        }
    }

    vm.calculateProgresses = function () {
        vm.progressDir = cardService.calculateProgress('direct');
        vm.progressRev = cardService.calculateProgress('reverse');
        vm.progressBoth = cardService.calculateProgress('both');
    }

    vm.calculateColors = function () {
        vm.colorDir = { color: cardService.calculateColor('direct'), fontFamily: 'cursive', textDecoration: ($rootScope.settings.direction == 'direct') ? 'underline' : 'inherit' };
        vm.colorRev = { color: cardService.calculateColor('reverse'), fontFamily: 'cursive', textDecoration: ($rootScope.settings.direction == 'reverse') ? 'underline' : 'inherit' };
        vm.colorBoth = { color: cardService.calculateColor('both'), fontFamily: 'cursive', textDecoration: ($rootScope.settings.direction == 'both') ? 'underline' : 'inherit' };

    }

    vm.direct = function () {
        $rootScope.settings.direction = 'direct';
        ioService.saveSettings();
        vm.calculateColors();
    }

    vm.reverse = function () {
        $rootScope.settings.direction = 'reverse';
        ioService.saveSettings();
        vm.calculateColors();
    }

    vm.both = function () {
        $rootScope.settings.direction = 'both';
        ioService.saveSettings();
        vm.calculateColors();
    }

    vm.about = function () {
        $ionicPopup.alert({ title: 'Learn Cards App, 2014', template: 'created by Oleksandr Zinchenko<br /><img src="../img/autor.jpg" style="width:60px;" /><br />e-mail: mail2zin@gmail.com' });
    }

    vm.calculateProgresses();
    vm.calculateColors();
}])