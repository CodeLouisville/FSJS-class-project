angular
.module('fileListApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/files', {
          template: '<file-list></file-list>'
        }).
        when('/files/:fileId', {
          template: '<file-detail></file-detail>'
        }).
        otherwise('/files');
    }
  ]);

  //  http://localhost:8080/#!/files
