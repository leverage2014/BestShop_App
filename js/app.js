
var shoppingApp = angular.module('shoppingApp', ['ui.router', 'shoppingAppCtrl','ngAnimate', 'ui.bootstrap']);

shoppingApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home/100');

    $stateProvider
        .state('home',{
            url: '/home',
            views: {
                '':{
                    templateUrl: 'tmpls/home.html'
                },
                'topNavBar@home':{
                    templateUrl: 'tmpls/topNavBar.html'
                },
                'contents@home':{
                     templateUrl: 'tmpls/products.html'
                },
                'bottomNavBar@home':{
                    templateUrl: 'tmpls/bottomNavBar.html'
                }
            }
        })
        .state('home.products',{
             url: '/{productType:[0-9]{1,4}}',
             views: {
                 '': {
                     templateUrl: "tmpls/products.html"
                 },
                 'contents@home':{
                     templateUrl: "tmpls/products.html"
                 },
                 'productTypes@home.products':{
                     templateUrl: 'tmpls/productTypes.html'
                 },
                 'productList@home.products':{
                     templateUrl:'tmpls/productsListImagesGrid.html'
                 }
              }
        })
        .state('home.myOrder',{
            url: '/myOrder',
            views:{
                '':{
                    template: 'this is default order'
                },
                'contents@home':{
                    templateUrl: 'tmpls/orderDetail.html'
                }
            }
        })
        .state('home.checkout',{
            url: '/checkout',
            views:{
                '':{
                    template: 'this is default page'
                },
                'contents@home':{
                    templateUrl: 'tmpls/checkOut.html'
                }
            }
        });

}]);

shoppingApp.run(['$rootScope','$state','$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.user = {};
    $rootScope.myCart = {
        cartRows: [],
        totalPrice: 0
    };
    $rootScope.logIn = false;
    $rootScope.products = [];

}]);