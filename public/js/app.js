/**
 * Fetches data from the api
 */
function getFiles() {
  return fetch('/api/file')
    .then(response => response.json())
    .then(files => {
      console.log("Files, I got them:", files);
      return files;
    })
    .catch(error => console.error("GETFILES:", error));
}

/**
 * Render a list of files
 */
function renderFiles(files) {
  const listItems = files.map(file => `
    <li class="list-group-item">
      <strong>${file.title}</strong> - ${file.description}
    </li>`);
  const html = `<ul class="list-group">${listItems.join('')}</ul>`;

  return html;
}

/**
 * Fetch files from the API and render to the page
 */
function refreshFileList() {
  getFiles()
    .then(files => {
      const html = renderFiles(files);
      $('#list-container').html(html);
    });
}

function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");
 
  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
  };
 
  fetch('/api/file', {
    method: 'post',
    body: JSON.stringify(fileData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(file => {
      console.log("we have posted the data", file);
      refreshFileList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
  }
 

function cancelFileForm() {
  console.log("Someone should clear the form");
}