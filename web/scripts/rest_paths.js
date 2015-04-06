  //RestPaths Class -----------------------------------------------------
  // A class to manage and handle the paths to REST API calls
  var RestPaths = function() {
    this.paths = {};
    this.paths.events = 'api/v1/events';
    this.paths.tooltip_template = 'api/v1/tooltiptemplate';
    //Keeping this as example of using dynamic paths
    this.paths.product_releases = 'api/v1/product/#PRODUCT#/releases';
  }
  RestPaths.prototype.events = function() {
    return this.paths.events;
  };
  RestPaths.prototype.tooltip_template = function() {
    return this.paths.tooltip_template;
  };
  //Keeping this as an example of using dynamic paths
  RestPaths.prototype.product_releases = function(product_id) {
    if (!product_id) {
      throw "ERROR: RestPaths.product_releases() requires a 'product_id' parameter";
    }
    return this.paths.product_releases.replace(/#PRODUCT#/g, product_id);
  };
  