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

    this.updateFile = (file) => {
      $http.put(`/files/${file._id}`, {file})
        .then(response => {
          console.log("Successfully updated file");
          return this.getFiles();
        })
        .catch(err => {
          console.log("Oops...there was an error", err);
        })
    }



    this.deleteFile = (file) => {
      $http.delete(`/files/${file._id}`)
        .then(response => {
          console.log("Successfully deleted file");
          this.selectedFile = null;
          return this.getFiles();
        })
        .catch(err => {
          console.log("Drat...there was an error", err);
        })
    }

  }
});
