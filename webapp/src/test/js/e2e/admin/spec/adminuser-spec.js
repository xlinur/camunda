'use strict';

var CamSDK = require('camunda-bpm-sdk-js');

var resetUrl = 'http://localhost:8080/camunda/ensureCleanDb/default';
var request = require('request');


request(resetUrl, function (err, res, body) {
  if (err) {
    throw err;
  }

  body = JSON.parse(body);
  console.info('res body', body.clean);

  var camClient = new CamSDK.Client({
    mock: false,
    apiUri: 'http://localhost:8080/engine-rest'
  });

  var userService = new camClient.resource('user');

  userService.delete({
    id: 'admin'
  }, function deleted(err, user) {
    if(err) {
      throw err;
    }

    console.log(user);
  });

});


var usersPage = require('../pages/users');

describe('admin user -', function() {

  it('should validate admin setup page', function () {

    console.log('\n' + 'adminusers-spec');

    // when
    usersPage.navigateToWebapp('Admin');

    // then
    expect(usersPage.adminUserSetup.pageHeader()).toBe('Setup');
    expect(usersPage.adminUserSetup.createNewAdminButton().isEnabled()).toBe(false);
  });


  it('should enter new admin profile', function() {

    // when
    usersPage.adminUserSetup.userIdInput('Admin');
    usersPage.adminUserSetup.passwordInput('admin123');
    usersPage.adminUserSetup.passwordRepeatInput('admin123');
    usersPage.adminUserSetup.userFirstNameInput('Über');
    usersPage.adminUserSetup.userLastNameInput('Admin');
    usersPage.adminUserSetup.userEmailInput('uea@camundo.org');

    usersPage.adminUserSetup.createNewAdminButton().click();

    // then
    expect(usersPage.adminUserSetup.statusMessage()).toBe('User created You have created an initial user.');
  });


  it('should login as new Admin', function() {

    // when
    usersPage.navigateToWebapp('Admin');
    usersPage.authentication.userLogin('Admin', 'admin123');

    // then
    expect(usersPage.userFirstNameAndLastName(0)).toBe('Über Admin');
  });

});

