// Code goes here

var app = angular.module('myApp',["ngRoute","ngStorage"]).run(function($rootScope,$localStorage,$location) {
  $rootScope.dhaba =[];
  $rootScope.authenticated = false;
  $rootScope.showSearchBar = false;
  $rootScope.logout = function(){
    alert('successfull loged out');
    $localStorage.user  = {};
    $rootScope.authenticated =false;
    $rootScope.dhaba = [];
    $location.path('/');
  }
  if($localStorage.user.success){
  $rootScope.authenticated =true;
  //console.log("hi i run")
    }
  });
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl : "main.html",
        controller : "mainController"
     })
     .when("/login",{
         resolve:{
           "check":function($rootScope,$location){
             if($rootScope.authenticated){
               $location.path('/');
             }
             else{
               if($rootScope.msg=='new user created please login'){
                 $rootScope.msg="";

               }
             }
           }
         },
         templateUrl : "login.html",
         controller : "loginController"

      })
      .when("/register",{
          resolve:{
            "check":function($location,$rootScope){
              if($rootScope.authenticated){
                $location.path('/');
              }

            }
          },
          templateUrl : "register.html",
          controller : "loginController"

       })
})
var cityname ="";
var dhabaname ="";
app.controller('mainController',function($scope,$http,$location,$rootScope,$localStorage){
  $rootScope.showSearchBar = true
  $scope.city ="";
  $scope.search = function(){
  cityname = $scope.city;
  //alert(cityname);
  $rootScope.dhaba =[];
  var rest =[];
  var a = {name:"",img:"",count:0};
  var url ='https://developers.zomato.com/api/v2.1/search?entity_type=city&q='+$scope.city;
  $http({
    method: 'GET',
    url: url,
    headers: {
        'user-key':'7613be427d3a3363e21a01fdf0e72198',
        'Accept': 'application/json'
    }
}).then(function(response){
  //alert("i m going to respond")
  var x =response.data.restaurants;
  //var arr =[];
  for(var i =0;i<x.length;i++){
    a.name = x[i].restaurant.name;
    a.img =x[i].restaurant.thumb;
    if(a.name!=""&&a.img!="" ){
       rest.push(a);
     }
    a={name:"",img:"",count:0};
  }
  var restuDetail ={city :$scope.city,restaurant:rest}
  $http.post('/users/addrestaurant', restuDetail).then(function(data){
    $rootScope.dhaba =data.data.restaurant;
   })
  })

 }
 $scope.going = function(element) {
   var c ;
    if($rootScope.authenticated){
      $scope.a = element.currentTarget.value;
        for(var i =0;i<$rootScope.dhaba.length;i++){
        if($scope.a ==$rootScope.dhaba[i].name){
          dhabaname = $rootScope.dhaba[i].name;
          c =i;
        //  $rootScope.dhaba[i].user_id.push($localStorage.user.user.id);
        $http.post('/users/updateuser',{restaurant:dhabaname,id:$localStorage.user.user.id}).then(function(response){
          if(response.data.success){
            $rootScope.dhaba[c].count +=1;
            $http.post('/users/updaterestaurant',{city:cityname,restaurant:$rootScope.dhaba}).then(function(response){

            })
          }
          if(!response.data.success){
          //  console.log($rootScope.dhaba[c])
              $rootScope.dhaba[c].count -=1;
              $http.post('/users/deleteRestaurant',{restaurant:dhabaname,id:$localStorage.user.user.id}).then(function(response){
                if(response.data.success){
                  $http.post('/users/updaterestaurant',{city:cityname,restaurant:$rootScope.dhaba}).then(function(response){
                  //  console.log(response.data);
                  })
                }

              })
          }
        })
       }
      }


      //
    /*  $http.post('/users/updaterestaurant',{city:cityname,restaurant:$rootScope.dhaba}).then(function(data){
        console.log('updated',data.data);
      })*/
    }
    else{
      if(confirm("please login to take this action")){
      $rootScope.showSearchBar = false;
       $location.path('/login');
        $rootScope.msg = "you have to login to take this action"
     }
   }
   };

})

app.controller('loginController',function($scope,$http,$rootScope,$localStorage,$location){
 //$rootScope.msg ="";
 $rootScope.showSearchBar = false;
 $scope.user ={name:"",email:"",password:""};
 $scope.signuser={email:"",password:""};
 $scope.signup = function(){
   $http.post('/users/register',$scope.user).then(function(data){
     $rootScope.msg =data.data.msg +' please login';
   })
 }
 $scope.login = function(){
   $rootScope.msg="";
     $http.post('/users/authenticate',$scope.signuser).then(function(data){
      if(data.data.success){
        $localStorage.user  = data.data;
        $rootScope.authenticated=true;
        $rootScope.showSearchBar = true
        $location.path('/');
        $rootScope.msg = data.data.msg;
      }

       //console.log($localStorage.user);
     })
  }


})
