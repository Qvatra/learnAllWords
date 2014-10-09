angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {
})

.controller('EditCtrl', function ($scope) {

})

.controller('SettingsCtrl', ['$scope', '$state', function ($scope, $state) {
    vm = $scope;

    vm.edit = function () {
        console.log('edit');
        $state.go('tab.edit', {});
    }
}]);
