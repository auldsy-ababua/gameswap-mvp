# gameswap

This is my backend capstone app for thinkful's full time career path.
The goals of this project:

Create a simple client: Most of my time was spent on the API layer of this app, but I made sure to create a simple client prototype that allows non-technical users to do something interesting or valuable with the API.

Serve static files: The server, in addition to offering a REST API, will serves the client and any other static assets (for instance, images).

Implement a RESTful API with all four CRUD operations: The app supports all four CRUD operations (create, read, update, delete).

Comprehensive Tests for the API Layer: Each API endpoint tests coverage. At a minimum that means having tests for the normal case — that means that if you had, say an account creation endpoint, you'd have a test that proves that when the endpoint gets a POST request with the correct data, a new account is created, and the expected response is returned.

Use Continuous Integration: I had to set up continuous integration early on in the development process. This gave me the opportunity to practice on the job skills, and ensure that I didn't ship broken code.

The idea of the app is fairly simple (if not so easy for a beginner to code). 

Each user creates an account with his username, password, and city and state. Once created, the user adds specific video games he/she wants to own and ones that he/she has and is willing to trade. These games are selected from a list generated via the search function (which accesses a video game api). Each listing has two buttons: "Games I Own" and "Games I Want". By hitting each button, that game is listed into its respective database in the backend and is reflected on the users profile page. 

Once another user in the same city picks complementary games for trade (User A wants Game Y and owns game Z, and User B wants game Z and owns Game Y), they are matched and can make contact on their own to make a trade soemwhere neutral, thus eliminating the need to sell your used games at huge losses to firms like gamestop.

Future features to be added:
1. A midpoint finder that takes specific addresses from each user and accesses a map api to find a midpoint for the two users to meet. This would be especially useful in larger cities.
2. The ability to charge users (maybe $1 each) for the right to see their match.
3. Support for specific consoles. As this is a MVP and merely a proof of concept, I did not have time to make sure the search results were filtered for platform (PC, PS4, XBOX One, etc). In future iterations, one could choose their system in the signup or profile page, and serch results would be filtered that way. As of right now, choosing a game for a specific platform is messy at best. 
