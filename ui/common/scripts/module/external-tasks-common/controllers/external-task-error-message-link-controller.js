'use strict';

module.exports = [
  '$scope', 'Uri', 'exposeScopeProperties',
  ExternalTaskErrorMessageLink
];

function ExternalTaskErrorMessageLink($scope, Uri, exposeScopeProperties) {
  exposeScopeProperties($scope, this, ['taskId']);

  this.Uri = Uri;
}

ExternalTaskErrorMessageLink.prototype.getStacktraceUrl = function() {
  return this.Uri.appUri(
    'engine://engine/:engine/history/external-task-log/' +
    this.taskId +
    '/error-details'
  );
};
