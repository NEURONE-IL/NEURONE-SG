// Adapted from: https://pumpingco.de/blog/environment-variables-angular-docker/
// Original work by: Robin-Manuel Thiel

(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["rootUrl"] = "${SERVER_ROOT}";
  window["env"]["coreRoot"] = "${NEURONE_URL}";
})(this);
