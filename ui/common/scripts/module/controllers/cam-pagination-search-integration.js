'use strict';

var angular = require('camunda-commons-ui/vendor/angular');

module.exports = [
  '$scope', '$rootScope', 'searchWidgetUtils', 'search',  'exposeScopeProperties',
  CamPaginationSearchIntegrationController
];

function CamPaginationSearchIntegrationController($scope, $rootScope, searchWidgetUtils, search, exposeScopeProperties) {
  this.searchWidgetUtils = searchWidgetUtils;
  this.search = search;
  this.lastSearchQueryString = null;
  this.locationChange = true;

  exposeScopeProperties($scope, this, [
    'config',
    'arrayTypes',
    'variableTypes',
    'onSearchChange',
    'buildCustomQuery',
    'loadingError',
    'loadingState',
    'textEmpty',
    'storageGroup',
    'blocked'
  ]);

  this.arrayTypes = angular.isArray(this.arrayTypes) ? this.arrayTypes : [];
  this.variableTypes = angular.isArray(this.variableTypes) ? this.variableTypes : [];
  this.pages = {
    size: 2,
    total: 0,
    current: this.getCurrentPageFromSearch()
  };

  console.log('initial pages', this.pages);
  console.log('config', this.config);

  // RESULTS CHANGE TRIGGERS
  $scope.$watch('Searchable.pages.current', this.onPageChange.bind(this));
  $scope.$on('$locationChangeSuccess', this.onLocationChange.bind(this));
  $scope.$watch(
    'config.searches',
    this.updateQuery.bind(this),
    true
  );

  $scope.$watch('blocked', this.onBlockedChange.bind(this));

  $rootScope.$on('cam-common:cam-searchable:query-force-change', this.onForcedRefresh.bind(this));
}

CamPaginationSearchIntegrationController.prototype.onForcedRefresh = function() {
  this.resetPage();
  this.executeQueries();
};

CamPaginationSearchIntegrationController.prototype.onBlockedChange = function(newValue, oldValue) {
  if (!newValue && oldValue && this.query) {
    console.log('change blocked', newValue, oldValue);
    this.executeQueries();
  }
};

CamPaginationSearchIntegrationController.prototype.getSearchQueryString = function() {
  return this.search().searchQuery;
};

CamPaginationSearchIntegrationController.prototype.hasSearchQueryStringChanged = function() {
  var searchQuery = this.getSearchQueryString();

  console.log('hasSearchQueryStringChanged', searchQuery, 'last', this.lastSearchQueryString, searchQuery !== this.lastSearchQueryString && (this.lastSearchQueryString || searchQuery !== '[]'));

  return searchQuery !== this.lastSearchQueryString && (this.lastSearchQueryString || searchQuery !== '[]');
};

CamPaginationSearchIntegrationController.prototype.onPageChange = function(newValue, oldValue) {
  // Used for checking if current page change is due to $locationChangeSuccess event
  // If so this change was already passed to updateCallback, so it can be ignored
  var searchCurrentPage = this.getCurrentPageFromSearch();

  console.log('on page change', newValue, oldValue);

  if (newValue == oldValue || newValue === searchCurrentPage) {
    return;
  }

  this.search('page', !newValue || newValue == 1 ? null : newValue);

  if (!this.hasSearchQueryStringChanged()) {
    this.executeQueries();
  }
};

CamPaginationSearchIntegrationController.prototype.onLocationChange = function() {
  var currentPage = this.getCurrentPageFromSearch();

  console.log('on location change', currentPage);

  if (+this.pages.current !== +currentPage) {
    this.pages.current = currentPage;

    if (!this.hasSearchQueryStringChanged()) {
      this.executeQueries();
    } else {
      this.locationChange = true;
    }
  }
};

CamPaginationSearchIntegrationController.prototype.getCurrentPageFromSearch = function() {
  return +this.search().page || 1;
};

CamPaginationSearchIntegrationController.prototype.updateQuery = function(newValue, oldValue) {
  console.log('change query', newValue, oldValue);

  if (this.areSearchesDifferent(newValue, oldValue)) {
    console.log('search query is different');

    this.query = this.buildCustomQuery && this.buildCustomQuery(newValue) || this.createQuery(newValue);

    if (!this.locationChange) {
      this.resetPage();
    }

    this.lastSearchQueryString = this.getSearchQueryString();

    this.executeQueries();
  }
};

CamPaginationSearchIntegrationController.prototype.resetPage = function() {
  console.log('set page to 1');
  var params = this.search();

  this.pages.current = 1;
  params.page = 1;

  // Replace url with old pagination, so browser history is more clean
  this.search.updateSilently(params, true);
};

CamPaginationSearchIntegrationController.prototype.executeQueries = function() {
  if (this.query && !this.blocked) {
    console.log('execute queries', this.query, this.pages);

    this.locationChange = false;
    this
      .onSearchChange({
        query: angular.copy(this.query),
        pages: angular.copy(this.pages)
      })
      .then((function(total) {
        this.pages.total = total;

        console.log('total', total);
      }).bind(this));
  }
};

CamPaginationSearchIntegrationController.prototype.createQuery = function(searches) {
  return this.searchWidgetUtils.createSearchQueryForSearchWidget(searches, this.arrayTypes, this.variableTypes);
};

CamPaginationSearchIntegrationController.prototype.areSearchesDifferent = function(newSearches, oldSearches) {
  var preparedNewSearches = prepareSearchesForComparassion(newSearches);
  var preparedOldSearches = prepareSearchesForComparassion(oldSearches);

  return !angular.equals(
    preparedNewSearches,
    preparedOldSearches
  );
};

function prepareSearchesForComparassion(searches) {
  return searches && searches.map(function(search) {
    return extractMeaningfulInformation(search);
  });
}

function extractMeaningfulInformation(search) {
  var value = search.value && search.value.value;
  var type = search.type && search.type.value.value;
  var operator = search.operator && search.operator.value.key;
  var name = search.name && search.name.value;

  return {
    value: value,
    type: type,
    operator: operator,
    name: name
  };
}
