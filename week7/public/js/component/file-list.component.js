angular.module("fileList").component("fileList",{
  templateUrl: "/js/template/file-list.template.html",
  controller: function FileListController($http){
    var self = this;

    this.selectFile = (file) => {
      // get the currently selected file and set the `selected`
      // property to false
      const currentlySelected = this.selectedFile;
      this.selectedFile = null;

      // Mark the passed file as selected
      if (!currentlySelected || currentlySelected._id !== file._id) {
        this.selectedFile = angular.copy(file);
      }
    }

    this.getFiles = () => {
      return $http.get("/files").then(function(response){
        return self.files=response.data;
      });
    }
    this.getFiles();

    this.createFile = () => {
      this.selectedFile = {
        filename: "",
        title: ""
      };
    }

    this.onCreate = (file) => {
      this.selectFile(file);
      this.files.push(file);
    }

    this.onUpdate = (file) => {
      this.selectFile(file);
      this.getFiles();
    }

    this.onDelete = (file) => {
      this.selectedFile = null;
      this.getFiles();
    }

  }
});
