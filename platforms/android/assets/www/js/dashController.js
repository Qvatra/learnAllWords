angular.module('controllers')

.controller('DashCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    console.log('DashCtrl');
    var vm = $scope;

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings

    vm.progressDir = cardService.calculateProgress('direct');
    vm.progressRev = cardService.calculateProgress('reverse');
    vm.progressBoth = cardService.calculateProgress('both');
    vm.colorDir = cardService.calculateColor('direct');
    vm.colorRev = cardService.calculateColor('reverse');
    vm.colorBoth = cardService.calculateColor('both');


    vm.start = function () {
        if ($rootScope.dictionary.length != 0) {
            $state.go('tab.card', {});
        } else {
            $ionicPopup.alert({ title: 'First you need to load or create a dictionary!' }).then(function () {
                $state.go('tab.edit', {});
            });
        }
    }


}])