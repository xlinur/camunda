'use strict';
var _links = [
  {
    label: 'Camunda Blog',
    href: 'https://blog.camunda.org',
    // image: './../assets/image/camunda.plain.svg',
    description: 'News from the Camunda team',
    priority: 99
  },
  {
    label: 'Camunda Forum',
    href: 'https://forum.camunda.org',
    // image: './../assets/image/camunda.plain.svg',
    description: 'Camunda product related forum',
    priority: 100
  }/*,
  {
    label: 'Angular.js Docs',
    href: 'https://code.angularjs.org/1.2.16/docs',
    image: './../assets/image/AngularJS-Shield-large.png',
    description: 'Almost interesting',
    priority: 0
  },
  {
    label: 'XKCD',
    href: 'https://xkcd.org',
    // image: './../assets/image/AngularJS-Shield-large.png',
    description: 'Nerdy comic',
    priority: 0
  },
  {
    label: 'Slashdot',
    href: 'https://slashdot.org',
    // image: './../assets/image/AngularJS-Shield-large.png',
    description: 'News for nerds, stuff that matter',
    priority: 0
  }*/
];

module.exports = [
  '$window',
  function($window) {
    return $window.camWelcomeConf && $window.camWelcomeConf.links ? $window.camWelcomeConf.links : _links;
  }];