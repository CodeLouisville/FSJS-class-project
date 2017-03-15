angular.module('fileDetail').
  component('fileDetail', {
    templateUrl: '/js/template/file-detail.template.html',
    controller: ['$routeParams', '$http', '$location',
      function FileDetailController($routeParams, $http, $location) {
        this.fileId = $routeParams.fileId;

        var self = this;

        this.getFile = () => {
          return $http.get(`/files/${this.fileId}`)
            .then(response => {
              return self.file = response.data;
            });
        }
        this.getFile();

        this.edit = () => {
          this.editFile = angular.copy(this.file);
        }

        this.onUpdate = (file) => {
          this.file = file;
          this.edit();
        }

        this.onDelete = (file) => {
          $location.url('/#!/files');
        }

      }
    ]
  });
