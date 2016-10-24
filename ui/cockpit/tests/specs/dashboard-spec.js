'use strict';

var testHelper = require('../../../common/tests/test-helper');
var setupFile = require('./dashboard-setup');

var dashboardPage = require('../pages/dashboard');


describe('Cockpit Dashboard Spec', function() {
  before(function() {
    return testHelper(setupFile.setup1, function() {
      dashboardPage.navigateToWebapp('Cockpit');
      dashboardPage.authentication.userLogin('admin', 'admin');
    });
  });

  it('should display all sections of the page in the header', function() {
    expect(dashboardPage.navbarItem(0).getText()).to.eventually.eql('More');

    dashboardPage.navbarDropDown().click();
    expect(dashboardPage.navBarDropDownItem(0)).to.eventually.eql('Reports');
    expect(dashboardPage.navBarDropDownItem(1)).to.eventually.eql('Deployments');
    expect(dashboardPage.navBarDropDownItem(2)).to.eventually.eql('Batches');
  });
});
