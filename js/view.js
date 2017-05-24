import GameswapServices from './model.js';

export default class GameswapView {
    
    constructor() {
        this.services = new GameswapServices();
        console.log("ready!");
        $("#gamesearch").val('');
        $("#home").show();
        $("#gamescontainer").val('');
        this.showForm();
        this.profArray = [];
    }
    
    showForm() {
        let cities = this.services.cities();
        for (let city in cities) {
            $('#myselect').append(`<option>${city}</option>option>`);
        }
    }
    
    games() {
        let usernameVal = $("#username").val();
        let passwordVal = $("#password").val();
        
        let callback = function(response) {
            if (response) {
                localStorage.username = usernameVal;
                localStorage.password = passwordVal;
            }
        };
        this.services.mygames(usernameVal, passwordVal, callback);
    }
    
    // brainium code
    login(done){
        event.preventDefault();
        
        var username=$("#Loginusername").val()
        var password=$("#Loginpassword").val()
        
        /*let callback = function(response) {
            if (response) {
                console.log('response',response);
            }
        };*/
        $("#error_text").hide().fadeIn().html('<img src="images/loader.gif"/>');
        
        this.services.doLogin(username, password, function(loginResponse){
            console.log(loginResponse)
            $("#error_text").hide().fadeIn().html('');
            
            if(loginResponse.status==true){
                
                localStorage.setItem('username',username)
                localStorage.setItem('password',password)
                
                $("#loginMenu").hide();
                $("#logoutMenu").show();
                $("#searchMenu").show();
                $("#profileMenu").show();

                console.log("adsflaskdfjawieofjaew");
                done('success');
                
            }else{
                
                console.log(loginResponse.message)
                $("#error_text").hide().fadeIn().html(loginResponse.message);
                
            }            
        });
    }
    
    getGames() {
        $("#gamesIOwn").empty();
        $("#gamesIWant").empty();
        var myClass = this;
        var callback = function(response) {
            console.log("Get Games : ",response.length);
            if(response.length <= 0){
              $("#emptyMsgContainer").text('You have no games added to your profile! You can’t match with anyone until we know what you want and what you have. Use the search bar above to find games to add to your profile!')
            }
            response.forEach(function(game) {
                console.log(game);
                myClass.showGame(game);
                var li = myClass.showGame(game);
                if (game.own == true) {
                    $("#gamesIOwn").append(li);
                } else {
                    $("#gamesIWant").append(li);
                }
            });
        };
        this.services.mygames(localStorage.username, localStorage.password, callback);
    }
    
    searchGames(gameIput) {
        console.log("22222");
        let gamesearch = $(gameIput).val();
        
        $("#gamescontainer").empty();
        
        let callback = function(response) {
            console.log("333");
            if (response) {
                console.log("11111111111");
                console.log(response);
                
            }
        };
        
        this.services.games(gamesearch, callback);
        
    }
    
    signin(cb) {
        
        let first_name = $("#first_name").val();
        let last_name = $("#last_name").val();
        let email = $("#email").val();
        let password = $("#signinForm #password").val();
        let city = $("#city").val();
        let state = $("#state").val();
        
        // let callback = function(response) {
            //     if (response) {
                //         localStorage.username = email;
                //         localStorage.password = password;
                //         cb('success');
                //     } else {
                    //         cb('fail');
                    //     }
                    // };
                    
                    $("#error_text_signup").hide().fadeIn().html('<img src="images/loader.gif"/>');
                    
                    this.services.signin(first_name, last_name, email, password, city, state, function(response){
                        console.log(response)
                        
                        if(response.status==true){
                            $("#first_name").val('');
                            $("#last_name").val('');
                            $("#email").val('');
                            $("#signinForm #password").val('');
                            $("#city").val('');
                            $("#state").val('');
                            
                            localStorage.username = email;
                            localStorage.password = password;
                            cb('success');
                            $("#error_text_signup").hide().fadeIn().html('');
                            
                        }else{
                            
                            console.log(response.message)
                            $("#error_text_signup").hide().fadeIn().html(response.message);
                            
                        }            
                    });
                    
                }
                
                showSearchResults(owned, wanted, city) {
                    $("#match-data").empty();
                    function callback(data) {
                        var container = $("#match-data");
                        if(data.length <= 0){
                            $("#match-data").append('<p class="profileText">This is where you come to see your matches within your city. To match with others, please go to your profile and fill out the form to let us know what games you want and what games you own</p>');
                        }
                        data.forEach(function(value, index) {
                            $.ajax({
                                type: "GET",
                                url: "/users/" + value._id,
                                dataType: 'json',
                                async: false,
                                success: function(response) {
                                    var matchTemplate = $("#template-parent .profile-template").clone();
                                    console.log("match : ",response.games.length);
                                    response.games.forEach(function(userGames) {
                                        //and if for spans game owned and game wanted
                                        if (userGames.own == true) {
                                            $(matchTemplate).find(".theyOwn span").append(userGames.game);
                                        } else {
                                            $(matchTemplate).find(".theyWant span").append(userGames.game);
                                        }
                                    });
                                    $(matchTemplate).find(".email span").html(response.user.email);
                                    $(matchTemplate).find(".city span").html(response.user.city);
                                    
                                    container.append(matchTemplate);
                                    console.log(response.user);
                                }
                            });
                        });
                    }
                    this.services.getgames(localStorage.username, localStorage.password, callback);
                }
                
                addClosure(game, type) {
                    var myClass = this;
                    
                    return function() {
                        var container = "#gamesIOwn";
                        var own = true;
                        if (type == "want") {
                            container = "#gamesIWant";
                            own = false;
                        }
                        
                        $.ajax({
                            type: "POST",
                            url: "/mygames",
                            data: {
                                "game": game,
                                "own": own
                            },
                            headers: {
                                "Authorization": "Basic " + btoa(localStorage.username + ":" + localStorage.password)
                            },
                            async: false,
                            success: function(response) {
                                console.log("Res : ",response);
                                var li = myClass.showGame(response);
                                $(container).append(li);
                                $("#emptyMsgContainer").hide();
                                //console.log("response.gameeeeeee");
                            }
                        });
                    };
                }
                
                showGame(response) {
                    if(response.game) {
                        var li = $("<li></li>");
                        var removeGameButton = $("<button type='button' class='waves-effect waves-light btn del-button' id='del-button'>Delete</button>");
                        li.append(response.game);
                        li.append(removeGameButton);
                        removeGameButton.click(this.deleteClosure(response._id, response.own, li));
                        return li;
                    } else{
                        alert("Duplicate entry");
                    }
                }
                
                deleteClosure(id, own, li) {
                    return function() {
                        
                        $.ajax({
                            type: "DELETE",
                            url: "/mygames/" + id,
                            headers: {
                                "Authorization": "Basic " + btoa(localStorage.username + ":" + localStorage.password)
                            },
                            async: false,
                            success: function(response) {
                                console.log(response);
                                li.remove();
                            }
                        });
                    };
                }
            }
            