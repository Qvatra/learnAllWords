angular.module('services').service('explorerService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    console.log('explorerService');
    var vm = this;

    vm.action; //open or save

    vm.initialize = function (act) {
        vm.action = act;

    }

    /* show the content of a directory */
    vm.listDir = function(directoryEntry) {
        currentDir = directoryEntry; // set current directory

        var directoryReader = directoryEntry.createReader();
        directoryReader.readEntries(function (entries) {
            var dirContent = $('#dirContent');
            dirContent.empty();

            var dirArr = new Array();
            var fileArr = new Array();
            for (var i = 0; i < entries.length; ++i) { // sort entries
                var entry = entries[i];
                if (entry.isDirectory && entry.name[0] != '.') dirArr.push(entry);
                else if (entry.isFile && entry.name[0] != '.') fileArr.push(entry);
            }

            var sortedArr = dirArr.concat(fileArr); // sorted entries
            var uiBlock = ['a', 'b', 'c', 'd'];

            for (var i = 0; i < sortedArr.length; ++i) { // show directories
                var entry = sortedArr[i];
                var blockLetter = uiBlock[i % 4];
                if (entry.isDirectory)
                    dirContent.append('<div style="height:57px;" class="ui-block-' + blockLetter + '"><div class="folder"><p class="folderText">' + entry.name + '</p></div></div>');
                else if (entry.isFile)
                    dirContent.append('<div style="height:57px;" class="ui-block-' + blockLetter + '"><div class="file"><p class="fileText">' + entry.name + '</p></div></div>');
            }
            //---
            var explorerH = 42 + (Math.floor((sortedArr.length - 1) / 4) + 1) * 57;
            var screenH = window.screen.height - 110;
            if (screenH < explorerH) {
                $('#explorerBody').css('height', explorerH + 'px');
            } else {
                $('#explorerBody').css('height', screenH + 'px');
            }
        }, function (error) {
            console.log('listDir readEntries error: ' + error.code);
        });
        $('#explorerPath').html("root://" + currentDir.toURL().substring(rootLength + slash));
    };




}]);







define('Explorer', ['Global', 'cordova', 'jquery', 'Scripts/explorer/jQueryMobile/jquery.mobile-1.0.1'], function (Global, cordova, $, jqm) {
    function Explorer(action) {
        var root = null; // File System root variable
        var currentDir = null; // Current DirectoryEntry listed
        var activeItem = null; // The clicked item
        var activeItemType = null; // d-directory, f-file
        var clipboardItem = null; // file or directory for copy or move 
        var clipboardAction = null; // c-copy, m-move
        var rootLength;
        var str = '' + (window.screen.height - 110) + 'px';
        var slash;

        if (Global.cordova == '2x') slash = 1;
        else if (Global.cordova == '3x') slash = 0;

        $('#explorerBody').css('height', str);

        if (action == 'save') {
            $('#explorerOk').html('Save');
            $('#em-fname').prop('value', 'model');
        } else if (action == 'open') {
            $('#explorerOk').html('Open');
            $('#em-fname').prop('value', '');
            $('#em-fname').prop('placeholder', 'select file and open it');
        } else if (action == 'load png') {
            $('#explorerOk').html('Load png');
            $('#em-fname').prop('value', '');
            $('#em-fname').prop('placeholder', 'select texture and load it');
        } else if (action == 'saveSheet') {
            $('#explorerOk').html('Save image');
            $('#em-fname').prop('value', 'spriteSheet');
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, requestFS, fail);

        function requestFS(fileSystem) {
            root = fileSystem.root;
            rootLength = root.toURL().length;
            Global.vm.explorerPath('');
            listDir(root);
            defineTouchEvent();

            $('#backBtn').touchstart(backclick); //no return in android
            $('#homeBtn').touchstart(homeclick);
            $('#backBtn').hide();
        };

        function defineTouchEvent() {
            $(document).on('touchstart', '.folder', folderclick);
            $(document).on('touchstart', '.file', fileclick);
        };

        ///* show the content of a directory */
        //function listDir(directoryEntry) {
        //    currentDir = directoryEntry; // set current directory

        //    if (currentDir.toURL() == root.toURL()) {
        //        $('#backBtn').hide(); //no return in android
        //    } else {
        //        $('#backBtn').show();
        //    }

        //    var directoryReader = directoryEntry.createReader();
        //    directoryReader.readEntries(function (entries) {
        //        var dirContent = $('#dirContent');
        //        dirContent.empty();

        //        var dirArr = new Array();
        //        var fileArr = new Array();
        //        for (var i = 0; i < entries.length; ++i) { // sort entries
        //            var entry = entries[i];
        //            if (entry.isDirectory && entry.name[0] != '.') dirArr.push(entry);
        //            else if (entry.isFile && entry.name[0] != '.') fileArr.push(entry);
        //        }

        //        var sortedArr = dirArr.concat(fileArr); // sorted entries
        //        var uiBlock = ['a', 'b', 'c', 'd'];

        //        for (var i = 0; i < sortedArr.length; ++i) { // show directories
        //            var entry = sortedArr[i];
        //            var blockLetter = uiBlock[i % 4];
        //            if (entry.isDirectory)
        //                dirContent.append('<div style="height:57px;" class="ui-block-' + blockLetter + '"><div class="folder"><p class="folderText">' + entry.name + '</p></div></div>');
        //            else if (entry.isFile)
        //                dirContent.append('<div style="height:57px;" class="ui-block-' + blockLetter + '"><div class="file"><p class="fileText">' + entry.name + '</p></div></div>');
        //        }
        //        //---
        //        var explorerH = 42 + (Math.floor((sortedArr.length - 1) / 4) + 1) * 57;
        //        var screenH = window.screen.height - 110;
        //        if (screenH < explorerH) {
        //            $('#explorerBody').css('height', explorerH + 'px');
        //        } else {
        //            $('#explorerBody').css('height', screenH + 'px');
        //        }
        //    }, function (error) {
        //        console.log('listDir readEntries error: ' + error.code);
        //    });
        //    $('#explorerPath').html("root://" + currentDir.toURL().substring(rootLength + slash));
        //};

        function openItem(type) {
            if (type == 'd') {
                listDir(activeItem);
                Global.vm.explorerPath(activeItem.toURL().substring(rootLength + slash));
            } else if (type == 'f') {
                if (action == 'open' || action == 'load png') $('#em-fname').prop('value', activeItem.toURL().substring(rootLength + slash));
                Global.vm.explorerPath(activeItem.toURL().substring(rootLength + slash));
            }
        };

        /* get active item  */
        function getActiveItem(name, type, callback) {
            if (type == 'd' && currentDir != null) {
                currentDir.getDirectory(name, { create: false },
                    function (dir) { // success find directory
                        activeItem = dir;
                        activeItemType = type;
                        callback();
                    },
                    function (error) { // error find directory
                        console.log('Unable to find directory: ' + error.code);
                    }
                );
            } else if (type == 'f' && currentDir != null) {
                currentDir.getFile(name, { create: false },
                    function (file) { // success find file
                        activeItem = file;
                        activeItemType = type;
                        callback();
                    },
                    function (error) { // error find file
                        console.log('Unable to find file: ' + error.code);
                    }
                );
            }
        };

        function folderclick() {
            var name = $(this).text();
            getActiveItem(name, 'd', function () { openItem(activeItemType); });
        };

        function fileclick() {
            var name = $(this).text();
            getActiveItem(name, 'f', function () { openItem(activeItemType); });
        };

        function backclick() { // go one level up
            currentDir.getParent(function (parentDir) { // success get parent
                Global.vm.explorerPath(parentDir.toURL().substring(rootLength + 1));
                listDir(parentDir);
            }, function (error) { // error get parent
                alert('Get parent error: ' + error.code);
            });
        };

        function homeclick() { // go to root
            if (root != null) {
                Global.vm.explorerPath('');
                listDir(root);
            }
        };

        function fail(error) {
            alert(error.code);
        };
    }
    return Explorer;
});