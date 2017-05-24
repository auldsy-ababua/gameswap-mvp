"use strict";

var $ = require('jquery');
var materialize = require('materialize-css');

import GameswapView from './view.js';

$(document).ready(function() {

    window.gameswapApp = new GameswapView();
    $("#logoutMenu").hide();
    $("#searchMenu").hide();
    $("#profileMenu").hide();

    $("#signinForm").submit(function(event) {
        event.preventDefault();
        console.log("The signin");
        gameswapApp.signin(function (res) {
          if ( res == 'success' ) {
            $(".nav #profileMenu").trigger('click');
            $("#loginMenu").hide();
            $("#logoutMenu").show();
            $("#searchMenu").show();
            $("#profileMenu").show();
          }
        });
        return false;
    });

    $("#add-owned").submit(function(event) {
        event.preventDefault();
        console.log("add-owned here is real game search");
         $("#loadergame").html('<img src="images/loader.gif"/>');

        gameswapApp.searchGames("#gamesearch");
        return false;
    });

    //go to login page
    $("#loginMenu").click(e => {
        $("#search").hide();
        $("#loginform").show();
        $(".nav").show();
        $("#create-profile").hide();
        $("#home").hide();
    });

    $("#logoutMenu").click(e => {
        $("#gamesearch").val('');
        $("ul#gamescontainer li").remove();
        console.log('logged out the user', localStorage.username);
        delete localStorage.username;
        delete localStorage.password;
        $("#loginMenu").show();
        $("#logoutMenu").hide();
        $("#searchMenu").hide();
        $("#profileMenu").hide();
        $(".nav").show();
        $("#home").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#search").hide();
        $("#profile").hide();
    });

    //login and go home
    $("#loginform #login-button").click(e => {
        gameswapApp.login(function (res) {
            $(".nav #profileMenu").trigger('click');
            console.log('goint to profile');

        });
        
    });

    //hit sign up at bottom of login to go to make profile page
    $("#makeProfile a").click(e => {
        $(".nav").show();
        $("#create-profile").show();
        $("#loginform").hide();
        $("#home").hide();
        $("#search").hide();
    });

    //hit GameSwap logo button on nav to go home
    $(".nav .brand-logo").click(e => {
        $(".nav").show();
        $("#home").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#search").hide();
        $("#profile").hide();
    });

    //hit home button on nav to go home
    $(".nav #homeMenu").click(e => {
        $(".nav").show();
        $("#home").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#search").hide();
        $("#profile").hide();
    });

    //hit search button on nav to go to search screen
    $(".nav #searchMenu").click(e => {
        $(".nav").show();
        $("#profile").hide();
        $("#search").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#home").hide();
        gameswapApp.showSearchResults(".games-owned", ".games-wanted", ".city");
    });

    //hit profile button on nav to go to myprofile screen
    $(".nav #profileMenu").click(e => {
        $(".nav").show();
        $("#profile").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#home").hide();
        $("#search").hide();
        $("gamesearch").val();
    
        gameswapApp.getGames();
        gameswapApp.showSearchResults(".games-owned", ".games-wanted", ".city");

    });

    //page refresh
    if (localStorage.username !== undefined && localStorage.password !== undefined) {
        $("#loginMenu").hide();
        $("#logoutMenu").show();
        $("#searchMenu").show();
        $("#profileMenu").show();
    } else {
        $("#homeMenu").show();
        $("#loginMenu").show();
        $("#logoutMenu").hide();
        $("#searchMenu").hide();
        $("#profileMenu").hide();
    }
    $(".dropdown-button").dropdown();

});
