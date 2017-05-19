
var mockData = {
    "profile": [{
        "name": "Mario",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8288",
        "gameOwned": "Grand Theft Auto 5 (PS4)",
        "gameWanted": "Battlefield 4 (PS4)",
        "publishedAt": new Date()
    }, {
        "name": "Colin",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8287",
        "gameOwned": "Battlefield 4 (PS4)",
        "gameWanted": "Grand Theft Auto 5 (PS4)",
        "publishedAt": new Date()
    }, {
        "name": "Bryan",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8280",
        "gameOwned": "Grand Theft Auto 5 (PS4)",
        "gameWanted": "Battlefield 4 (PS4)",
        "publishedAt": new Date()
    }],
    "city": ["Los Angeles", "New York"],
    "game": ["Battlefield 4 (PS4)", "Grand Theft Auto 5 (PS4)"]
};

export default class GameswapServices {
    cities() {
        return mockData.city;
    }
    games(name,callback) {
      var apikey = "1c320a06c5560acfd91bd4b90e98f6244e2cf1f3";
      $.ajax({
          url: "http://api.giantbomb.com/search/",
          type: "get",
          data: {api_key : apikey, query: name, field_list : "name, image", format : "jsonp", json_callback : "gamer", limit: 10 },
          dataType: "jsonp",
          success: function(response) {
            callback(response);
          }
        });

      /*
      $.ajax({
          type: "GET",
          crossDomain: true,
          dataType:"jsonp",
          url: "http://www.giantbomb.com/api/games/?json_callback=?&api_key=446f10052bfc7212c109acba1d61a98f2c5ff30f&filter=name:"+name,
          success: function(response) {
            callback(response);
          }
      });
      */

    }


    // brainium code

      doLogin(username,password,callback) {
        let data = {
          "username": username,
          "password": password,
          
        };

        $.ajax({
            type: "POST",
            url: "/dologin",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {

                //console.log("doLogin > response : ", response);
                callback(response);
            }
        });
    }
    // brainium code

    //bind for add games endpoint
    signin(first_name, last_name,email,password,city,state,callback) {
        let data = {
          "first_name": first_name,
          "last_name": last_name,
          "username": email,
          "password": password,
          "city": city,
          "state": state
        };

        $.ajax({
            type: "POST",
            url: "/users",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
              console.log(response)
               callback(response);
            }
        });
    }

      //bind for search games endpoint
      getgames(username, password,callback) {

          $.ajax({
              type: "GET",
              url: "/games",
              dataType: 'json',
              headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
              },
              async: false,
              success: function(response) {
                  console.log(response);
                  callback(response);
              }
          });
      }

      //bind for my games endpoint
      mygames(usernameVal, passwordVal,callback) {
          $.ajax({
              type: "GET",
              url: "/mygames",
              dataType: 'json',
              headers: {
                "Authorization": "Basic " + btoa(usernameVal + ":" + passwordVal)
              },
              async: false,
              success: function(response) {
                  console.log(response);
                  callback(response);
              }
          });
      }

      //bind for add games endpoint
      addgame(username, password) {
          let usernameVal = $(username).val();
          let passwordVal = $(password).val();

          $.ajax({
              type: "POST",
              url: "/mygames",
              dataType: 'json',
              async: false,
              success: function(response) {
                  console.log(response);
                  //response should be from game search?
                  $("#profile .gamesOwned span").html().append(response);
              }
          });
      }

      //bind for remove games endpoint
      deletegame(username, password,callback) {
          let usernameVal = $(username).val();
          let passwordVal = $(password).val();

          $.ajax({
              type: "DELETE",
              url: "/mygames/:id",
              dataType: 'json',
              async: false,
              success: function(response) {
                  callback(response);
                  console.log(response);

              }
          });
      }
}
