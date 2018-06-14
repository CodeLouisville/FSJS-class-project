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
