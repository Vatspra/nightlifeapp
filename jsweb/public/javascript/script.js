// Code goes here

var app = angular.module('myApp',["ngRoute"]).run(function($rootScope) {
  $rootScope.dhaba =[];
  });
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.html",
        controller : "mainController"
    })

})
app.controller('mainController',function($scope,$http,$location,$rootScope){
  //console.log($rootScope.dhaba)
  //$scope.dhaba =[];
  $scope.city ="";


  /*$http({
    method: 'GET',
    url: 'https://developers.zomato.com/api/v2.1/search?entity_type=city&q=chandigarh',
    headers: {
        'user-key':'7613be427d3a3363e21a01fdf0e72198',
        'Accept': 'application/json'
    }
}).then(function(response){

  var x =response.data.restaurants
  for(var i =0;i<x.length;i++){

    a.name = x[i].restaurant.name;
    a.img =x[i].restaurant.thumb;
    $rootScope.dhaba.push(a);
    a = {name:"",img:""};
  }
  //alert(response.data.restaurants[0].restaurant.name);
 })*/

 $scope.search = function(){
  $rootScope.dhaba =[];
  console.log($rootScope.dhaba)
  //$scope.city ="";
  var a = {name:"",img:"",add:""};
  alert($scope.city)
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
  var x =response.data.restaurants
  for(var i =0;i<x.length;i++){

    a.name = x[i].restaurant.name;
    a.img =x[i].restaurant.thumb;
  //  a.add =x[i].restaurant.location.address;
    if(a.name!=""&&a.img!=""){
      $rootScope.dhaba.push(a);
    }

    a={name:"",img:"",add:""};
  }
  console.log($rootScope.dhaba)
  $location.path('/');
  //alert(response.data.restaurants[0].restaurant.name);
 })
 console.log($rootScope.dhaba);
 console.log(url);

 }


})
