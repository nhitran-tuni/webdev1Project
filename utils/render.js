const path = require('path');
const fs = require('fs');

const NOT_FOUND_TEMPLATE = path.resolve(__dirname, '../public/404.html');

/**
 * Render file from ./public directory (calls response.end())
 *
 * @param {string} filePath filepath
 * @param {http.ServerResponse} response http response
 * @returns {void} void
 */
const renderPublic = (filePath, response) => {
  if (!filePath) return renderNotFound(response);

  const ext = splitPath(filePath)[1];
  const contentType = getContentType(ext);
  const fullPath = getFullFilePath(filePath);

  if (!fullPath) return renderNotFound(response);
  renderFile(fullPath, contentType, response);
};

/**
 * Render ../views/404.html (calls response.end())
 *
 * @param {http.ServerResponse} response http response
 * @returns {void} void
 */
const renderNotFound = response => {
  renderFile(NOT_FOUND_TEMPLATE, getContentType('html'), response);
};

/**
 * Get Content-Type based on file extension
 *
 * @param {string} fileExtension file extension
 * @returns {string} contentType
 */
const getContentType = fileExtension => {
  let contentType = 'text/html';
  switch (fileExtension.toLowerCase().replace('.', '')) {
    case 'js':
      contentType = 'text/javascript';
      break;
    case 'css':
      contentType = 'text/css';
      break;
    case 'json':
      contentType = 'application/json';
      break;
    case 'png':
      contentType = 'image/png';
      break;
    case 'jpg':
      contentType = 'image/jpg';
      break;
    case 'svg':
      contentType = 'image/svg+xml';
      break;
    case 'wav':
      contentType = 'audio/wav';
      break;
    default:
      contentType = 'text/html';
  }
  return contentType;
};

/**
 * 
 * @param {string} filePath filepath
 * @param {string} contentType contenttype
 * @param {http.ServerResponse} response http response
 */

const renderFile = (filePath, contentType, response) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.statusCode = 500;
      if (error.code === 'ENOENT') {
        // console.error(`File does not exist: ${filePath}`);
        response.statusCode = 404;
        if (filePath !== NOT_FOUND_TEMPLATE) return renderNotFound(response);
      } else if (error.code === 'EACCES') {
        console.error(`Cannot read file: ${filePath}`);
      } else {
        console.error(
          'Failed to read file: %s. Received the following error: %s: %s ',
          filePath,
          error.code,
          error.message
        );
      }

      return response.end();
    }

    const status = filePath !== NOT_FOUND_TEMPLATE ? 200 : 404;
    response.writeHead(status, { 'Content-Type': contentType });
    response.end(content, 'utf-8');
  });
};

/**
 * 
 * @param {string} fileName file name 
 */
const getFullFilePath = fileName => {
  const basePath = 'public';
  return path.resolve(
    __dirname,
    `../${basePath}/${fileName[0] === '/' ? fileName.substring(1) : fileName}`
  );
};

/**
 * 
 * @param {string} filePath file path 
 */
const splitPath = filePath => {
  const tmpPath = filePath.split('?')[0];
  const filename = path.basename(tmpPath);
  const ext = path.extname(filename);
  return [filename, ext];
};

module.exports = { renderPublic, renderNotFound, getContentType };
