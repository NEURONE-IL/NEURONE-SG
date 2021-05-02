// Adapted from: https://pumpingco.de/blog/environment-variables-angular-docker/
// Original work by: Robin-Manuel Thiel

(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["rootUrl"] = "http://localhost:3002";
  window["env"]["coreRoot"] = "http://localhost:3000";
})(this);
