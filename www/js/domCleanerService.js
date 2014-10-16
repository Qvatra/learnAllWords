angular.module('services').service('domCleaner', ['$rootScope', function ($rootScope) {
    //console.log('domCleanerService');
    var vm = this;

    vm.removeAllChildren = function(element) { //returns number of relesed nodes
        var num = 1;

        while (element.lastChild) {
            num += this.removeAllChildren(element.lastChild);
            element.removeChild(element.lastChild);
        }

        return num;
    }

}]);



