# GameSwap - Cut Out the Gamestop Middleman!

### _URL_:<br>
https://gameswap-aulds.herokuapp.com/

### _API's_ _USED_:<br>
1. [IGDB: Free Video Game Database] (https://www.igdb.com/api)

### _SUMMARY_:<br>
Each user creates an account with his username, password, and city and state. Once created, the user adds specific video games he/she wants to own and ones that he/she has and is willing to trade. These games are selected from a list generated via the search function (which accesses a video game api). Each listing has two buttons: "Games I Own" and "Games I Want". By hitting each button, that game is listed into its respective database in the backend and is reflected on the users profile page. <br>

Once another user in the same city picks complementary games for trade (User A wants Game Y and owns game Z, and User B wants game Z and owns Game Y), they are matched and can make contact on their own to make a trade soemwhere neutral, thus eliminating the need to sell your used games at huge losses to firms like gamestop.

### Goals of This Project:<br>

1. Create a simple client: Most of my time was spent on the API layer of this app, but I made sure to create a simple client prototype that allows non-technical users to do something interesting or valuable with the API.<br>

2. Serve static files: The server, in addition to offering a REST API, will serves the client and any other static assets (for instance, images).<br>

3. Implement a RESTful API with all four CRUD operations: The app supports all four CRUD operations (create, read, update, delete).<br>

4. Comprehensive Tests for the API Layer: Each API endpoint tests coverage. At a minimum that means having tests for the normal case — that means that if you had, say an account creation endpoint, you'd have a test that proves that when the endpoint gets a POST request with the correct data, a new account is created, and the expected response is returned.<br>

5. Use Continuous Integration: I had to set up continuous integration early on in the development process. This gave me the opportunity to practice on the job skills, and ensure that I didn't ship broken code.

### _FUTURE FEATURES_:<br>
1. A midpoint finder that takes specific addresses from each user as well as each user's prefered travel radius and accesses a map api to find a midpoint for the two users to meet. This would be especially useful in larger cities.<br>
2. The ability to charge users (maybe $1 each) for the right to see their match.<br>
3. Support for specific consoles. As this is a MVP and merely a proof of concept, I did not have time to make sure the search results were filtered for platform (PC, PS4, XBOX One, etc). In future iterations, one could choose their system in the signup or profile page, and serch results would be filtered that way. As of right now, choosing a game for a specific platform is messy at best.

### _TECHNOLOGY USED_:<br>
1. Server-side: Node/Express, MongoDB, Socket.io, [OAuth 2.0](https://oauth.net/2/)<br>
2. Client-side: HTML5, LESS, [MaterializeCSS](http://materializecss.com/), jQuery
