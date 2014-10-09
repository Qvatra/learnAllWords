angular.module('controllers')

.controller('SettingsCtrl', ['$scope', '$state', function ($scope, $state) {
    var vm = $scope;

    vm.edit = function () {
        console.log('edit');
        $state.go('tab.edit', {});
    }
}]);