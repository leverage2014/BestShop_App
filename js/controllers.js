
var shoppingAppCtrl = angular.module('shoppingAppCtrl', []);

shoppingAppCtrl.controller('topBarModalCtrl', ['$scope', '$rootScope','$http', '$uibModal', '$log','$timeout', function ($scope, $rootScope, $http, $uibModal, $log, $timeout) {

    $scope.animationsEnabled = true;
    
    $scope.isEmptyObject = function( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    }

    $rootScope.signInopen = $scope.signInopen = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'tmpls/signInTemp.html',
            controller: 'topBarModalInstanceCtrl',
            resolve: {
                // user: function () {
                //     return $scope.user;
                // }
            }
        });

        modalInstance.result.then(function (user) {

            console.log('enter login modal instance ----------------');

             console.log(user);

            if($scope.isEmptyObject(user)){
                alert('Please enter your information');
                return;
            }

             $scope.verifyUser(user);

        }, function () {
            $log.info('signInopen Modal dismissed at:'+new Date());
        });
    };

    $scope.registerOpen = function () {
        console.log('21212112');
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'tmpls/registerTemp.html',
            controller: 'topBarModalInstanceCtrl',
            resolve: {
                // user: function () {
                //     return $scope.user;
                // }
            }
        });

        modalInstance.result.then(function (user) {
            //  $scope.user = user;

            console.log("---> new register user");
            // console.log(user);
            //
            // $scope.testData.push(user);
            // console.log("all users");
            // console.log($scope.testData);

            //  $scope.signInopen();

        }, function () {
            $log.info('registerOpen Modal dismissed at:'+new Date());
        });
    };
    
    $scope.signOut = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'tmpls/signOutTemp.html',
            controller: 'topBarModalInstanceCtrl',
            resolve:{

            }
        });

        modalInstance.result.then(function (user) {

            console.log('enter: ----- sign out -------');
          //  console.log(user);
           // console.log("传进的user和全局user:"+ (user == $scope.user));
            //  alert('logIn');
           // $scope.logIn = false;
           // alert('$scope.logIn'+ $scope.logIn);
           // $rootScope.user = {};


           // $rootScope.myCart.lines = [];
           // $rootScope.myCart.totalPrice = 0;

            $rootScope.user = {};
            $rootScope.myCart = {
                cartRows: [],
                totalPrice: 0
            };

            $rootScope.logIn = false;

            console.log('logout后的global cart');
            console.log($rootScope.myCart);
            console.log('left: ----- sign out -------');
        });
    }

    $scope.verifyUser = function (user) {

        $http.post('/verifyUser', user).success(function (response) {
            console.log("resposne:");
            console.log(response);

            if(response){
                console.log("enter here");
                $rootScope.user.name = response.name;
                $rootScope.user.email = response.email;

                console.log("login verify user");
                console.log($rootScope.user);

                // ------------------------------
                console.log('登录的用户是:');
                console.log($rootScope.user);

                $scope.user = $rootScope.user;
                alert('Welcome '+$rootScope.user.name+" come back!");
                $rootScope.logIn = true;
                //
                console.log('登录后的初始myCart:');
                console.log($rootScope.myCart);

            } else {
                alert('Please enter correct information!');
            }
        });

    };

    $scope.showCart = function () {
        // $rootScope.updateCart();
        $scope.myCart = $rootScope.myCart;
        console.log('----- modalctrl: show_cart: ------');
        console.log($scope.myCart);
        console.log($rootScope.myCart);
        console.log('end: ----- modalctrl: show_cart: ------');

    };


    //----- add to cart之后自动弹出 my cart
    $scope.$on('add_to_cart', function (ev) {
        console.log('接收 add to cart 事件');
        console.log(ev);
        //dropdown();

        $('#myCart').css('background','#A9E2F3');
        $('#myCartDetails').css("display",'block');

        $timeout(function () {
            $('#myCartDetails').css("display",'');
            $('#myCart').css('backgroundImage','linear-gradient(to bottom,#086ed5,#055db5)');
        },1500);

    });
    
}]);

shoppingAppCtrl.controller('topBarModalInstanceCtrl', ['$scope', '$rootScope', '$uibModalInstance','$http', function ($scope,$rootScope, $uibModalInstance,$http){

    $scope.ok = function () {
       // alert('OK1');
        $uibModalInstance.close($scope.user);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.signOutConfirm = function () {
        $uibModalInstance.close($rootScope.user);
    };

    $scope.createUser = function () {
        console.log('enter createUser');
        console.log($scope.user);
        console.log($scope.agreeTerm);
        // ------------ 写进数据库 ------------------

        var pendingUser = {};
        pendingUser.name = $scope.user.name;
        pendingUser.email = $scope.user.email;

        $http.post('/verifyUser', pendingUser).success(function (response) {
            console.log("resposne:");
            console.log(response);

            if (response) {
                // 用户已经存在
                console.log('+++++ enter if ++++++++');
                alert("The username or email are aleady registed!");
                $rootScope.user = {};
                $scope.user = {};
                $scope.cancel();
            } else {
                console.log('+++++ enter else ++++++++');
                // 用户不存在,写入数据库中
                $http.post('/registUser', $scope.user).success(function (response) {
                    if(!response){
                        alert('You are sucessfully registed! Please continue to login!');
                        $scope.cancel();
                        $rootScope.user = {};
                        $scope.user = {};
                        $rootScope.signInopen();
                    } else {
                        alert("System error! Please registe later!");
                        $scope.cancel();
                        $scope.user = {};
                        $rootScope.user = {};
                    }
                });

            }
        })
    }

}]);

shoppingAppCtrl.controller('shopping',['$rootScope','$scope', '$http','$state','$stateParams','$timeout', function ($rootScope, $scope, $http, $state, $stateParams, $timeout) {
    
    $scope.addToCart = function (item) {
        console.log('===== enter addToCart ========');
        console.log($rootScope.user);
        if(angular.equals($rootScope.user,{})){
            alert("please login first!");
            return;
        }

        console.log('前: my cart ******');
        console.log($rootScope.myCart);

        console.log('addtocart user');
        console.log($rootScope.user);

        console.log('enter addtoCart:'+ item.id);

        if(!item.id) return;

        var cartRow = {};

        if(!angular.equals($rootScope.myCart.cartRows),[]){
           // alert('empty cart');
            console.log('==== enter if');
            angular.forEach($rootScope.myCart.cartRows, function (value, key) {
                if(item.id == value.productId){
                    cartRow = value;
                    console.log('new added cartRow');
                    console.log(cartRow);
                    value.quantity ++;
                }
            });
            console.log('==== left if, and cartRow:');
            console.log(cartRow);

        }

        if($rootScope.myCart.cartRows.length == 0 || angular.equals(cartRow, {})){
            console.log('enter else =====');
            cartRow.productId = item.id;
            cartRow.label = item.label;
            cartRow.price = item.price;
            cartRow.quantity = 1;
            console.log('left else =====, and cartRow');
            console.log(cartRow);

            $rootScope.myCart.cartRows.push(cartRow);
        }

        $rootScope.myCart.totalPrice += parseInt(item.price);
        console.log( $rootScope.myCart.cartRows);

        // ---------- 触发自动弹出 my cart 事件 --------
        console.log('***********  begin add to cart event');
        $rootScope.$broadcast('add_to_cart', '');
        console.log('finish add to cart');

    }

    $scope.decrementQuantity = function (cartRow) {
        console.log('====== enter decrementQuantity ==========');
        // updateCart();
        --cartRow.quantity;
        $rootScope.myCart.totalPrice -= parseInt(cartRow.price);
        console.log('====== left decrementQuantity ==========');
    }

    $scope.incrementQuantity = function(cartRow){
        console.log('====== enter incrementQuantity ==========');
        //  updateCart();
        console.log('incrementQuantity');
        console.log($rootScope.myCart);
        cartRow.quantity++;
        $rootScope.myCart.totalPrice += parseInt(cartRow.price);
        console.log('====== left incrementQuantity ==========');
    }

    $scope.removeFromCart = function(cartRow){
        angular.forEach($rootScope.myCart.cartRows, function (value, key) {
            if(angular.equals(value, cartRow)){
                $rootScope.myCart.cartRows.splice(key, 1);
                $rootScope.myCart.totalPrice -= parseInt(cartRow.price)*parseInt(cartRow.quantity);
            }
        });
    }

    $scope.checkOut = function () {
        console.log('checkout 时候的 $rootScop.myCart');
        console.log($rootScope.myCart);


        // ---- send $rootScope.myCart to server

        var orderDetailsRecord = {};
        var date = new Date();
        orderDetailsRecord.orderDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        orderDetailsRecord.username = $rootScope.user.name;
        orderDetailsRecord.email = $rootScope.user.email;
        orderDetailsRecord.products = $rootScope.myCart.cartRows;
        orderDetailsRecord.totalPrice = $rootScope.myCart.totalPrice;


        $http.post('/checkout', orderDetailsRecord).success(function (response) {
            console.log("checkout resposne:");
            console.log(response);
            $rootScope.orderNumber = response;  // 这个显示有问题!!!!

            $timeout(function () {
                $state.go('home.checkout');
            }, 1000);

            if(response){


            } else {
                alert('System error! Please try again later!');
            }
        });

    };

    console.log('传来stateParams是:');
    console.log($stateParams);
    $scope.getSelectedCategory = function () {
        console.log('=== enter getSelectedCategory ===');
        console.log($stateParams.productType);

        // 从服务器端获取数据
        $http.get('/home/'+$stateParams.productType)
            .success(function (data) {
                console.log('enter $http');
               $rootScope.products = data;
                console.log(data);
            });

        console.log('=== left getSelectedCategory ===');

    }
    $scope.getSelectedCategory();

}]);