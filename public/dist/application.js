'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin');
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if (!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pending-events');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Articles',
      state: 'articles.create',
      roles: ['user']
    });
    
  }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    /*
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
	*/
  }
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      name: 'home',
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('home.contact', {
      url: 'contact',
      templateUrl: 'modules/core/client/views/contact.client.view.html',
    })
    .state('home.events', {
      url: 'events',
      templateUrl: 'modules/core/client/views/events.client.view.html',
    })
    .state('home.calendar', {
      url: 'calendar',
      templateUrl: 'modules/core/client/views/calendar.client.view.html',
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

angular.module('core').controller('MainCtrl', ["$scope", function ($scope){
  $scope.events = [
    { 
      name: 'Event1', 
      location: 'my house', 
      date: new Date('2014', '03', '08'), 
      img: 'http://www.realtimetext.org/sites/default/files/images/FastText-logo_outline_300.png',
      description: 'bla',
      attending: 0,
    }, 
    { 
      name: 'Event2', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'Event3', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBISEg4VFBAXGRQSERUUEA8QFhIWFRUXGBQSFhUYHiggGBopHBQUITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGzckICUvLCw0MCwvMCw0LzQsNDAsLCwsLSwsLCwsLCwsLCwsLSwsLCwsLCwsLCwsLCwsLCwsLP/AABEIAMgAyAMBEQACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QANBAAAgECBAQEBAUEAwAAAAAAAAECAxEEEiExE0FRYQUicYGxweHwFDKRodEjM1JyNEJD/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAMCAQQF/8QALBEBAAICAQQBAwMDBQAAAAAAAAECAxESBBMhMVEiYXEUMkFDofAzNEKB4f/aAAwDAQACEQMRAD8A+mgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEpWAkAAAiUbgRGXJ7/HugLAAAAAAAAAAAAAAAAAAAAAhuwERXN+y6fUCwAAAAiUb/ewERlye/xAsAAAAAAAAAAAAAAAAAADdgKxV9X7Lp9QLAAAAAAAiUbgRGXJ79eoFgAAAAAAAAAAAAAAABuwFYq+r9l8wLAAAAAAAAAIkrgRF8n7Pr9QLAAAAAAAAAAAAAANgUSvq/ZfNgXAAAAAAAAAAACSuBWLez9n/IFgAAAAAAAAAAAAolfV7cl82BcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCrS/EuGby5b206HjjJb9Tw340jynua/h0zxdON05pNb+5e2fHWdTZub1j3KPxtK1+JG3qc/UYtb5Hcp8tKVWMleMk12KVvW8brO2omJ8wz/G0r24kb+vzJ/qMW9cme5T5bOSSu3p1KzMR5lvbml4hSX/ov3IT1WGI/cn3afLerWjFXlJJcrlb5KUjdp03NojzKKOIhP8sk/QUy0v8AtnbkWi3pobaAAAAAAAAAAAAAAAAADzY/8t/6/I8Ef7v/AKQ/rIw8E8TUuk7K6vrbY5jrE9VfblYicsq4ClHj1fKtNtNrnOnx179416MdY5yYBxhOv/gtbfqc6ea0vk+I/wDXMeqzb4ZTvOlLLRjGmtr/AJvVE7bvhnjSIr/dydzSdR4XxClLCxtrtf0V/oby8rdJGnbbnFDLGTpzjTjSXn7KzWnP3J57Y8la1xR9TN5raIivtpVlKWIl5M+VaJyypba7G7Ta3Uz9PLX307O5yettI0ajrRmqWTlK0k7/ALIpGPJOaL8ePz5a425xbWnqH0HoAAAAAAAAAAAAAAAAADlWEfG4mbS1rW7Hn7E97ubT4fXyTRwrjVnUvpJWtbbb+BTDNctsm/ZFNWmyMPhXGpOd7qXK2wx4ZpktffsrTVplWngbSqtyup8lpYzXptWvMz4s5GPzO/5ZR8PqZcnG8naGvpuTjpcnDhz8fhntW1x34TUw2WhklUSX+VmuezO2w8cHC1tfd2aapxmWGIjOjDOqseVkoRSa+ZHLF8NOcXj8REaYtukbiXVVwjm41IyyTsr6XTutmei2CbzGSs6tpSce9WidS1oUqid51FJbWUbe5XHTJFt3tv7aarW0TuZdBZsAAAAAAAAAAAAAAAAAAAAAAAVqU4yVpJNdzNqVvGrRtyYifbCn4fSi7qCv7sjXpcVZ3FWIxUjzp0noUAAAAAAAAAAAAAAUr1MkZSteyvba5jJfhWbfDNp1G3nrxWVszoPJ1Ur/ACPFHW21ymnj5/yEe/Ot8XRWxq4TqQ19b9dbl79RHa7lG5yfRyh0UJ5oxk92k/1LY7cqxPypWdxErm3QAAArVlaLfRN/ojN51WZcmdRtj4fiHUgpNJO7WnYl0+WcuPlLOO02rt0F2wDkx+KdNwsk8zs737fyebqM045rr+ZTyXmutOs9Kjm8QxLpwzJJu6WtyHU5ZxU5QnktNK7h0Qd0n1SZas7iJUj0k6AAAAAAAAADDH/2p+jI9R/pW/DGT9svMw2OtSUI05SlZrbTX4nz8fUzGLhWszKFcmqcYhedBwwrT33fbXY3bHOPpZifbs1muLy7I/2I+fJ5V5uh6v6EanXj2p/w96ebVxKhaVOrOVn5s12n+p4L5opq2O0z+fSE3ivmsu3GVZSqxpRllVrya3sevNe98sYqzr5WvaZtxiW1HCOMk1Vk481J5r9HcrjwTS24tMx9/LVaTWfbz44pVZSc6zhFaRjFtX73R4ozRltM3vxj+IhGLxafqnTTCYlviwz54qMnGXt9TeHNM88e9xqfLtLz5rvfhTA4Vyo5uJJfmypOyVuvUxgwzbDy5THtzHSZpvbeljpfh871kvL73smWp1Fo6fnPv03GSe3yV/Dz4XE4s89s++nW1jPZydrnynet+/DnCePLfljia7qQoSe+az9U0Ty5e5THaflm1uUVl2+KYmUIpR/NJ2Xb7uj1dXmtjrEV9yrlvNY8OPxLCOFO7qSk7q922n7cjy9VgmmLc2mUsuPjX20xmKeaFPPkjlTlLnqtimbNPKuPfGNRuWr38xXemf4lU5wyVnOLdpJtyt3uzHdjHevC/KJ9x7Z5RWY4ztdxnPETjxJKO7s3tpouhqYvfqLV5TEfl3UzkmNvSoUskbZm+8nd/qe/HThXW9/l6KxqNNDboAAAAAGONi3TmkruzsSzxM47RDN43WVPDYONKKas9dPcx0tZriiJZxRMViJT4hRc6corfl7HeppN8c1h3JWbVmIcValOpQUcjUo2TT/7WW6PLel8mDjrUx/dKYm2PWlMbxKlNRjQlFKzd7dLWS5mM/cy44rWmtf54cvytXUQ3xNKanGtCN9LSjsy2Wl4vGakb+YatFuUXh0UcTOUl/ScY83JpO/ZFqZr3tH06j7t1vMz68OOhSlQlJcNzg3dNJNr2f3oebHS2CZjjyrPwnWJpOtbh1wk5Qn/AEnB2aSdrvTsemszelvp17UidxPjTPw6nKNCzTT82hjpqWrg1MefLOOJimpY4bCSlh3Bq0rtq/7EcWC1unmk+JZrSZx8ZONV4fD4Ms1st9LW2ud55e32+E79fY5X48dK4jAzjTpqKzOLzNeupnJ01646xXzMeXLY5isa/ht4hRlVhGUU1NO6i7X9P2RXqMdstK2rGpjzpvJWb1iY9scfVqVaeXgSTum9rexLqL5MuPjwnbGSbXrrTTE4ealCpGOaySlHnsby4r1tXJWN+PMNWrMTFohvRrOUkuA4rnJqKt00LUyTa2uGvvLdbbn9umVClJYicsrytaPlyJ46WjqbW14ZrE9yZege1YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACM2tvtASAAAAAAAAAAAABsCIu4EgAAAAAAAAAACspclv8ADuBMY2AkAAAAAAAAAAAAAFWua911+oExlcCQAAAAAAAAFZS5Lf4dwJjG3z7gSAAAAAAAAAAAAAAAArKPNb8+4ExlcCQAAAAAARKXJb/eoCMbfPuBIAAAAAAAAAAAAAAAAAArKPNb/ECYyuBIAAAAiUrev3qAjG3rzYEgAAAAAAAAAAAAAAAAAAAArKPNb/HsBMZX+9gJAAAIjG3qBIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'EventN', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRddUP_I34xRtgUdDUP9J67QfsK1mMBJ8qNMBJyzcLHLxU8W-KI',
      description: 'bla2',
      attending: 0,
    }   

  ];
  $scope.plusOne = function(index) {
    $scope.events[index].attending += 1;
  };
  $scope.minusOne = function(index) {
    $scope.events[index].attending += 1;
  };




  $scope.todos = ["Learn Angular", "Learn node"];
  $scope.newItem = "";

  $scope.todosEditor = [false, false]; //Array that holds "false" if the
                                       //corresponding edit form should
                                       //be hidden, true otherwise.

  $scope.warningText = "";             //Text that displays any warnings
                                       //if the user performs an illegal
                                       //action.  

  $scope.completeItems = [false, false];

  $scope.counter = 2;
  
  $scope.addItem = function(){
    console.log("in add");
    if ($scope.newItem !== ""){
      if($scope.todos.indexOf($scope.newItem) === -1){
        $scope.todos.push($scope.newItem);
        $scope.todosEditor.push(false);
        $scope.completeItems.push(false);
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = ""; //Get rid of error message.
        $scope.counter += 1;
      }
      else{
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = "Error! No repeats allowed!";
      }

    }
  };
    
  $scope.deleteItem = function(item){
    console.log("in delete");
    var index = $scope.todos.indexOf(item);
    $scope.todos.splice(index, 1);
    $scope.completeItems.splice(index, 1);
    $scope.todosEditor.splice(index, 1);
    $scope.counter -=1;
  };

  $scope.showEditor = function(item){   //Shows the appropriate edit
                                        //form.
    var index = $scope.todos.indexOf(item);
    $scope.todosEditor[index] = true;
  };

  $scope.cancelEdit = function(item){   //Cancels the editing action
    var index = $scope.todos.indexOf(item);
    $scope.todos[index] = item;
    $scope.todosEditor[index] = false;
  };

  $scope.editItem = function(item, editedItem){ //Performs the actual
                                                //edit. Lots of
                                                //debugging is implemented
                                                //so nothing should crash
                                                //the webpage.

    if(typeof editedItem === 'undefined'){ //Prevent users from adding blank entries!
      $scope.cancelEdit(item);
      return;
    }

    if(editedItem === ""){   //Prevent users from adding blank entries (that used
                            //to be not blank but were then subsequently erased)
      $scope.cancelEdit(item);
    } 
    else{ //The entry was not blank

      if($scope.todos.indexOf(editedItem) === -1 || item === editedItem){ //We have not a repeat
                                                                        //or we are renaming the item
                                                                        //the same thing.
        var index = $scope.todos.indexOf(item);

        $scope.todos[index] = editedItem;
        $scope.todosEditor[index] = false;  //Close the editing window.

        $scope.warningText = "";            //Get rid of error message.
      }
      else{
        $scope.warningText = "Error! No repeats allowed!";
        return;
      }
      
    }
  };

  $scope.completeItem = function(item){
    var index = $scope.todos.indexOf(item);
    $scope.completeItems[index] = true;
  };

  /* The following function iterates through the
     completeItems array and if element is equal 
     to true it calls delete item on that element 
     in the todos array.*/
  $scope.clearComplete = function(){ 
    var i = 0; // initialize i
    while(i < $scope.counter){
      if($scope.completeItems[i] === true){
        $scope.deleteItem($scope.todos[i]);
        continue; // return to beginning of while loop
      }
      i++;
    }
  };
  
}]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

// CEN3031 Group 7C
'use strict';

var myApp = angular.module('app', []);

myApp.controller('MainCtrl', ["$scope", function ($scope){
  $scope.events = [
    { 
      name: 'Event1', 
      location: 'my house', 
      date: new Date('2014', '03', '08'), 
      img: 'http://www.realtimetext.org/sites/default/files/images/FastText-logo_outline_300.png',
      description: 'bla',
      attending: 0,
    }, 
    { 
      name: 'Event2', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'Event3', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/jpeg;base64,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',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'EventN', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRddUP_I34xRtgUdDUP9J67QfsK1mMBJ8qNMBJyzcLHLxU8W-KI',
      description: 'bla2',
      attending: 0,
    }   

  ];
  $scope.plusOne = function(index) {
    $scope.events[index].attending += 1;
  };
  $scope.minusOne = function(index) {
    $scope.events[index].attending += 1;
  };




  $scope.todos = ["Learn Angular", "Learn node"];
  $scope.newItem = "";

  $scope.todosEditor = [false, false]; //Array that holds "false" if the
                                       //corresponding edit form should
                                       //be hidden, true otherwise.

  $scope.warningText = "";             //Text that displays any warnings
                                       //if the user performs an illegal
                                       //action.  

  $scope.completeItems = [false, false];

  $scope.counter = 2;
  
  $scope.addItem = function(){
    console.log("in add");
    if ($scope.newItem !== ""){
      if($scope.todos.indexOf($scope.newItem) === -1){
        $scope.todos.push($scope.newItem);
        $scope.todosEditor.push(false);
        $scope.completeItems.push(false);
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = ""; //Get rid of error message.
        $scope.counter += 1;
      }
      else{
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = "Error! No repeats allowed!";
      }

    }
  };
    
  $scope.deleteItem = function(item){
    console.log("in delete");
    var index = $scope.todos.indexOf(item);
    $scope.todos.splice(index, 1);
    $scope.completeItems.splice(index, 1);
    $scope.todosEditor.splice(index, 1);
    $scope.counter -=1;
  };

  $scope.showEditor = function(item){   //Shows the appropriate edit
                                        //form.
    var index = $scope.todos.indexOf(item);
    $scope.todosEditor[index] = true;
  };

  $scope.cancelEdit = function(item){   //Cancels the editing action
    var index = $scope.todos.indexOf(item);
    $scope.todos[index] = item;
    $scope.todosEditor[index] = false;
  };

  $scope.editItem = function(item, editedItem){ //Performs the actual
                                                //edit. Lots of
                                                //debugging is implemented
                                                //so nothing should crash
                                                //the webpage.

    if(typeof editedItem === 'undefined'){ //Prevent users from adding blank entries!
      $scope.cancelEdit(item);
      return;
    }

    if(editedItem === ""){   //Prevent users from adding blank entries (that used
                            //to be not blank but were then subsequently erased)
      $scope.cancelEdit(item);
    } 
    else{ //The entry was not blank

      if($scope.todos.indexOf(editedItem) === -1 || item === editedItem){ //We have not a repeat
                                                                        //or we are renaming the item
                                                                        //the same thing.
        var index = $scope.todos.indexOf(item);

        $scope.todos[index] = editedItem;
        $scope.todosEditor[index] = false;  //Close the editing window.

        $scope.warningText = "";            //Get rid of error message.
      }
      else{
        $scope.warningText = "Error! No repeats allowed!";
        return;
      }
      
    }
  };

  $scope.completeItem = function(item){
    var index = $scope.todos.indexOf(item);
    $scope.completeItems[index] = true;
  };

  /* The following function iterates through the
     completeItems array and if element is equal 
     to true it calls delete item on that element 
     in the todos array.*/
  $scope.clearComplete = function(){ 
    var i = 0; // initialize i
    while(i < $scope.counter){
      if($scope.completeItems[i] === true){
        $scope.deleteItem($scope.todos[i]);
        continue; // return to beginning of while loop
      }
      i++;
    }
  };
  
}]);

/*************************
 * Homework (not rly):
 * - "enter" button functionality instead of clicking button
 * - edit button functionality  <--- Done! Miles got it.
 * - button to mark item as "complete"
 * - have a total number of items at the top
 * - make it prettier
 * - add a due date
 * - add reminder (setInterval)
 * 
 * *********************/
'use strict';

// Configuring the Pending events module
angular.module('pending-events').run(['Menus',
	function(Menus) {
		// Add the Pending events dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Pending events',
			state: 'pending-events',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'pending-events', {
			title: 'List Pending events',
			state: 'pending-events.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'pending-events', {
			title: 'Create Pending event',
			state: 'pending-events.create'
		});
	}
]);
'use strict';

//Setting up route
angular.module('pending-events').config(['$stateProvider',
	function($stateProvider) {
		// Pending events state routing
		$stateProvider.
		state('pending-events', {
			abstract: true,
			url: '/pending-events',
			template: '<ui-view/>'
		}).
		state('pending-events.list', {
			url: '',
			templateUrl: 'modules/pending-events/views/list-pending-events.client.view.html'
		}).
		state('pending-events.create', {
			url: '/create',
			templateUrl: 'modules/pending-events/views/create-pending-event.client.view.html'
		}).
		state('pending-events.view', {
			url: '/:pendingEventId',
			templateUrl: 'modules/pending-events/views/view-pending-event.client.view.html'
		}).
		state('pending-events.edit', {
			url: '/:pendingEventId/edit',
			templateUrl: 'modules/pending-events/views/edit-pending-event.client.view.html'
		});
	}
]);
'use strict';

// Pending events controller
angular.module('pending-events').controller('PendingEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PendingEvents',
	function($scope, $stateParams, $location, Authentication, PendingEvents ) {
		$scope.authentication = Authentication;

		// Create new Pending event
		$scope.create = function() {
			// Create new Pending event object
			var pendingEvent = new PendingEvents ({
				name: this.name
			});

			// Redirect after save
			pendingEvent.$save(function(response) {
				$location.path('pending-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pending event
		$scope.remove = function( pendingEvent ) {
			if ( pendingEvent ) { pendingEvent.$remove();

				for (var i in $scope.pendingEvents ) {
					if ($scope.pendingEvents [i] === pendingEvent ) {
						$scope.pendingEvents.splice(i, 1);
					}
				}
			} else {
				$scope.pendingEvent.$remove(function() {
					$location.path('pending-events');
				});
			}
		};

		// Update existing Pending event
		$scope.update = function() {
			var pendingEvent = $scope.pendingEvent ;

			pendingEvent.$update(function() {
				$location.path('pending-events/' + pendingEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pending events
		$scope.find = function() {
			$scope.pendingEvents = PendingEvents.query();
		};

		// Find existing Pending event
		$scope.findOne = function() {
			$scope.pendingEvent = PendingEvents.get({ 
				pendingEventId: $stateParams.pendingEventId
			});
		};
	}
]);
'use strict';

//Pending events service used to communicate Pending events REST endpoints
angular.module('pending-events').factory('PendingEvents', ['$resource',
	function($resource) {
		return $resource('api/pending-events/:pendingEventId', { pendingEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.unshift(function (password) {
          var result = PasswordValidator.getResult(password);
          var strengthIdx = 0;

          // Strength Meter - visual indicator for users
          var strengthMeter = [
            { color: "danger", progress: "20" },
            { color: "warning", progress: "40"},
            { color: "info", progress: "60"},
            { color: "primary", progress: "80"},
            { color: "success", progress: "100"}
          ];
          var strengthMax = strengthMeter.length;

          if (result.errors.length < strengthMeter.length) {
            strengthIdx = strengthMeter.length - result.errors.length - 1;
          }

          scope.strengthColor = strengthMeter[strengthIdx].color;
          scope.strengthProgress = strengthMeter[strengthIdx].progress;

          if (result.errors.length) {
            scope.popoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.errors;
            modelCtrl.$setValidity('strength', false);
            return undefined;
          } else {
            scope.popoverMsg = '';
            modelCtrl.$setValidity('strength', true);
            return password;
          }
        });
      }
    };
}]);

'use strict';

angular.module('users')
  .directive("passwordVerify", function() {
    return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, modelCtrl) {
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || modelCtrl.$viewValue) {
            combined = scope.passwordVerify + '_' + modelCtrl.$viewValue;
          }
          return combined;
        }, function(value) {
          if (value) {
            modelCtrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                modelCtrl.$setValidity("passwordVerify", false);
                return undefined;
              } else {
                modelCtrl.$setValidity("passwordVerify", true);
                return viewValue;
              }
            });
          }
        });
     }
    };
});

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = "Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.";
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
