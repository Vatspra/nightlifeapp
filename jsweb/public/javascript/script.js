// Code goes here

var app = angular.module('myApp',["ngRoute"]).run(function($rootScope) {
  $rootScope.dhaba =[];
  $rootScope.authenticated =false;
  });
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl : "main.html",
        controller : "mainController"
     })
     .when("/login",{
         templateUrl : "login.html",
         controller : "loginController"
      })
      .when("/register",{
          templateUrl : "register.html",
          controller : "loginController"
       })
})
var cityname ="";
app.controller('mainController',function($scope,$http,$location,$rootScope){
  $scope.city ="";
  $scope.search = function(){
    cityname = $scope.city;
    alert(cityname);
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

    console.log(data);

   })
  })

 }
 $scope.going = function(element) {
      $scope.a = element.currentTarget.value;
      for(var i =0;i<$rootScope.dhaba.length;i++){
        if($scope.a ==$rootScope.dhaba[i].name){
          $rootScope.dhaba[i].count +=1;
         }
      }
      $http.post('/users/updaterestaurant',{city:cityname,restaurant:$rootScope.dhaba}).then(function(data){
        console.log(data.data);
      })
   };

})

app.controller('loginController',function($scope,$http){
 $scope.msg ="";
 $scope.user ={name:"",email:"",password:""};
 $scope.signuser={email:"",password:""};
 $scope.signup = function(){
   $http.post('/users/register',$scope.user).then(function(data){
     $scope.msg =data.data.msg;
   })
 }
})
