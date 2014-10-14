// DO NOT FORGET TO INSTALL FILE PLUGIN

angular.module('controllers')

.controller('ExplorerCtrl', ['$scope', '$rootScope', '$cordovaFile', '$q', '$state', 'explorerService', 'ioService', '$ionicPopup', function ($scope, $rootScope, $cordovaFile, $q, $state, explorerService, ioService, $ionicPopup) {
    //console.log('ExplorerCtrl');
    var vm = $scope;

    vm.fileName = '';
    vm.array;
    vm.currentUrl = '../com.learn.cards';
    vm.mode = $state.params.mode;

    //console.log($state.params.mode);

    if (!$rootScope.dictionary) $state.go('tab.dash', {});
    explorerService.getList(vm.currentUrl.substr(3)).then(function (list) {
        //console.log(list);
        vm.array = list;
    });



    vm.folderClick = function (url) {
        //console.log(url);
        explorerService.getList(url.substr(1)).then(function (list) {
            //console.log(list);
            vm.array = list;
            vm.currentUrl = '..' + url;
            vm.fileName = '';
        });
    }

    vm.fileClick = function (name) {
        //console.log(name);
        vm.fileName = name;
    }

    vm.goBack = function () {
        var url = vm.currentUrl.substr(3, vm.currentUrl.lastIndexOf('/') - 3);
        explorerService.getList(url).then(function (list) {
            //console.log(list);
            vm.array = list;
            vm.currentUrl = '../' + url;
            vm.fileName = '';
        });
    }



    vm.save = function () {
        //console.log('save');

        if (vm.fileName || vm.fileName.trim() != '') {
            var dictionary = $rootScope.dictionary.map(function (item) { //\r\n
                return item.w + ';' + item.t;
            });

            var dic2save = '';
            dictionary.forEach(function (item) {
                dic2save += item + '\r\n';
            });

            var url = (vm.currentUrl.substr(3) == '') ? '' : vm.currentUrl.substr(3) + '/';

            $cordovaFile.writeFile(url + vm.fileName, dic2save).then(function () {
                $state.go('tab.edit', {});
            }, function () {
                $ionicPopup.alert({ title: 'Error', template: 'File not saved' });
            });
        } else {
            $ionicPopup.alert({ title: 'Export', template: 'Please enter a file name.' });
        }
    }


    vm.load = function () {
        if (vm.fileName || vm.fileName.trim() != '') {
            $ionicPopup.confirm({ title: 'Are you sure?', template: 'You are about to download ' + vm.fileName + ' dictionary. Current dictionary data will be lost.', cancelType: 'button-positive', okType: 'button-balanced' })
                .then(function (ok) {
                    if (ok) {
                        var url = (vm.currentUrl.substr(3) == '') ? '' : vm.currentUrl.substr(3) + '/';

                        $cordovaFile.readAsText(url + vm.fileName).then(function (data) {
                            try {
                                var pairs = data.split('\n');
                                if (pairs[pairs.length - 1] == '') pairs.pop();
                                var array = pairs.map(function (item) {
                                    return { w: item.split(';')[0].trim(), t: item.split(';')[1].trim(), d: 1, r: 1 };
                                });
                                ioService.saveDictionary(array);
                                $rootScope.dictionary = array;

                                $state.go('tab.edit', {});
                            } catch (err) {
                                $ionicPopup.alert({ title: 'Import', template: 'Wrong file format.' });
                            }
                        }, function () {
                            $ionicPopup.alert({ title: 'Import', template: 'Wrong file name.' });
                        });
                    }
                });
        } else {
            $ionicPopup.alert({ title: 'Import', template: 'No file selected.' });
        }
    }


    vm.cancel = function () {
        //console.log('cancel');
        $state.go('tab.edit', {});
    }


}])