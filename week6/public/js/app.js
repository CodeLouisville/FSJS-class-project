

function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getFiles()", err);
      throw err;
    });
}


function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {
      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}


function toggleAddFileForm() {
  console.log("Baby steps...");
  toggleAddFileFormVisibility();
}

function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
  };

  $.ajax({
    type: "POST",
    url: '/api/file',
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileForm();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your file data", fileData);
}

function cancelFileForm() {
  toggleAddFileFormVisibility();
}
