angular.module('controllers')

.controller('DashCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    //console.log('DashCtrl');
    var vm = $scope;

    $rootScope.winFlag = false; //for card graduation msg
    $rootScope.almostWinFlag = false; //for card graduation msg

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings

    vm.start = function () {
        if (!$rootScope.dictionary || $rootScope.dictionary.length == 0) {
            $ionicPopup.alert({ title: '<h4>Your dictionary is empty!</h4><img src="img/book.png" class="imgBook" /><br /><h5>You need to load or create a dictionary!</h5>' }).then(function () {
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
        $ionicPopup.alert({ title: 'Learn Words App, 2014', template: '<img src="img/autor.jpg" class="imgAuthor"><span>Created by<br>Oleksandr Zinchenko<br>e-mail:<br>mail2zin@gmail.com </span>' });
    }

    vm.help = function () {
        $ionicPopup.alert({
            title: 'How it works...',
            template: '<p><h6>A word gets +1 star with correct quess and -1 star otherwise. \
                    Word\'s probability to appear(adjustable) is related to a number of stars. \
                    Thus, the words that you know beter will appear less frequently.</h6></p>\
                    <p><h6>W->T mode aimed at expanding a passive vocabulary while other 2 modes aimed at your active vocabulary.</h6></p>\
                    <p><h6>Utf-8 files for import should be formatted as: word<strong>;</strong>translation'
            });
    }

    vm.calculateProgresses();
    vm.calculateColors();
}])


//'There is a lot of \'learn words\' apps but this one is unique!<br/>\
//                    The app shows you a word and you should guess its translation.<br />\
//                    A word gets +1 star with correct answer and -1 star otherwise.<br />\
//                    The probability of a word to appear is directly related to a number of stars the word has.<br />\
//                    It means that words that you already know will appear rarely.<br />\
//                    The probabilities are adjustable values and you can set them in settings.<br /><br />\
//                    Another great feature is the "direction of the translation" mode.<br />\
//                    Using T->W or COMBINED modes will help you to expand your active vocabulary while W->T aimed mainly at your passive vocabulary.<br /><br />\
//                    A dictionary could be expanded or modified on the fly while you are learning.<br />\
//                    In addition you can import an external dictionary file or export current dictionary to a file.<br />\
//                    External file should be utf-8 encoded and have the following format:<br />\
//                    word1;translation1<br />\
//                    word2;translation2<br />\
//                    ...<br />\
//                    wordN;translationN'