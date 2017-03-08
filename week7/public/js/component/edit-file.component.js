angular.module("fileList").component("editFile", {
    templateUrl: "/js/template/edit-file.template.html",
    controller: function EditFileComponent($http) {

        this.save = (file) => {
            if (this.file._id) {
                this.updateFile(file);
            } else if (this.file.filename && this.file.title) {
                this.createFile(file);
            }
        }

        this.createFile = (file) => {
            $http.post('/files', {file})
                .then(response => {
                    console.log("Successfully created file");
                    this.file = response;
                    this.onCreate({file: response.data});
                })
                .catch(err => {
                    console.log("Oops...there was an error", err);
                })
        }

        this.updateFile = (file) => {
        $http.put(`/files/${file._id}`, {file})
            .then(response => {
                console.log("Successfully updated file");
                this.file = response.data;
                this.onUpdate({file: response.data})
            })
            .catch(err => {
                console.log("Oops...there was an error", err);
            })
        }

        this.deleteFile = (file) => {
        $http.delete(`/files/${file._id}`)
            .then(response => {
                console.log("Successfully deleted file");
                this.file = null;
                this.onDelete({file: response.data});
            })
            .catch(err => {
                console.log("Drat...there was an error", err);
            })
        }
    },
    bindings: {
        file: '<',

        onDelete: '&',
        onUpdate: '&',
        onCreate: '&'
    }
});