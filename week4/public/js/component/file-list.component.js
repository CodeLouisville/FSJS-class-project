angular.module("fileList").component("fileList",{
  templateUrl: "/js/template/file-list.template.html",
  controller: function FileListController($http){
    var self = this;
    $http.get("/files").then(function(response){
      self.files=response.data;
    });
  }
});
