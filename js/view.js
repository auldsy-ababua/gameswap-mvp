import GameswapServices from './model.js';

export default class GameswapView {

    constructor() {
        this.services = new GameswapServices();
        console.log("ready!");
        $("#home").show();
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

    getGames() {
        $("#gamesIOwn").empty();
        $("#gamesIWant").empty();
        var myClass = this;
        var callback = function(response) {
            console.log(response);
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
        let gamesearch = $(gameIput).val();

        $("#gamescontainer").empty();
        let callback = function(response) {
            if (response) {
                console.log(response);
            }
        };
        this.services.games(gamesearch, callback);
    }

    signin() {
        let first_name = $("#first_name").val();
        let last_name = $("#last_name").val();
        let email = $("#email").val();
        let password = $("#password").val();
        let city = $("#city").val();
        let state = $("#state").val();

        let callback = function(response) {
            if (response) {
                localStorage.username = email;
                localStorage.password = password;
            }
        };
        this.services.signin(first_name, last_name, email, password, city, state, callback);
    }

    showSearchResults(owned, wanted, city) {
        $("#match-data").empty();
        function callback(data) {
            var container = $("#match-data");
            console.log(data);
            data.forEach(function(value, index) {
                $.ajax({
                    type: "GET",
                    url: "/users/" + value._id,
                    dataType: 'json',
                    async: false,
                    success: function(response) {
                        var matchTemplate = $("#template-parent .profile-template").clone();
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
                    var li = myClass.showGame(response);
                    $(container).append(li);
                    console.log("response.game");
                }
            });
        };
    }

    showGame(response) {
        var li = $("<li></li>");

        var removeGameButton = $("<button type='button' class='waves-effect waves-light btn'>Delete</button>");

        li.append(response.game);
        li.append(removeGameButton);

        removeGameButton.click(this.deleteClosure(response._id, response.own, li));
        return li;
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
