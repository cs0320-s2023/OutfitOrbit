# Outfit Orbit - Term Project

Find our repository [here](https://github.com/cs0320-s2023/OutfitOrbit)

We have also made this website publicly available [here]()
## Project Details

### Project Description
Our project is Outfit Orbit, an attempt at allowing users to repurpose and restyle items they have in their wardrobe by offering both a virtual wardrobe representation, but also providing peronalized outfit recommendations based on their pieces. Users are able to sign in to have access to their wardrobe, and are easily able to add and remove pieces which are classified by various fields. Then, users are able to input a prompt for the description of their outfit, and a ChatGPT API call is made which returns an outfit created from the pieces in the wardrobe which matches the inputted description. This outfit is then displayed, and the user has the opportunity to "like" the outfit, which allocates each of the clothing items a point. These points are taken into account when generating outfits, prioritizing pieces with a lower point value to encourage users to use their closet in its entirety and venture out from their most worn pieces. 
We attempted to achieve this goal in order to promote sustainability in fashion from a new perspective: rather than focusing on manufacturing, we wanted to encourage and show our users that good style does not have to involve purchasing new clothes. 

**Team Members**:
Taleena (tchandar): worked on adding Wardrobe + Clothing objects to Firestore Database, parsing the GPT output into a clothing object and displaying style recommendation. Worked on parsing chatGPT responses and implementing algorithmic complexity.

Keya (kkilacha): worked on adding new items to the Wardrobe using form, and removing from the firestore. Worked on setting up frontend wardrobe with flipcards.

Javier (jferna35): worked heavily with the frontend and styling elements, set up Google Authentication. Some work on firebase adding
and removing items from firestore db. Set up fetching from chatGPT.

Keya (kkilacha): worked on adding new items to the Wardrobe using form, and removing from the firestore db, focus on accessibility through adding aria-labels

Anastasio (aortiz18): completed the testing suite using mocking, added accessibility elements and elements of defensive programming, as well as organizing our code in packages.

## Design Choices

**Frontend**: Our frontend was composed of 3 main components: `FlipCard.js`, `Navbar.js` and `PopUp.js`. These were created into their own classes with css. Our `App.js` class, the biggest class of our program, incorporated all these stylized elements while ensuring that all changes made on the backend to the database were reflected and rendered in the frontend. For instance, adding or removing clothing items from the Database was first done in the backend, and then any such changes were recorded using dependencies to ensure that the App would be correctly rendered. The frontend was done using mostly javascript since that is the language for which most support was provided with the APIs with which we were working. Typescript, we learnt, gave many many issues.

**Backend**: One of the core classes of the backend was `firebase.js` which handled the functionality of the Firebase Database. This class handles the Google OAuth, that is to allow users to sign in and out of our site along with the NavBar.js class. These logins were tracked in the Firebase with the users name and email. In this class, we also created our Wardrobe element, a third field for each user in the Firebase which contained an array of clothing items. For each clothing item (each object store in the Wardrobe), we created an additional `Clothing.js` class which had the relevant fields for the clothing which we wanted to store. The firebase class also had the relevant methods to add and remove from the closet, while also including the function which added points to the relevant clothing items which the user liked. The firebase file also allows us to read from the firebase databse and update the wardrobe upon the user liking, removing or adding clothing items. The `Gpt3.js` class handled the API requests, by inputting the users wardrobe items, and ensuring the output is in the correct JSON format so as to be able to be correctly rendered into a card in the App. `Main.js` handled the functionality of the search bar and relevant buttons (submit and like), ensuring that the GPT call was made at the correct moment.

## Errors / Bugs

There are occassionally a few bugs with the Sign in/Sign out as there are many parts of the program which rely on databases updating. It is recommended to be patient when doing multiple actions at once, going too fast can result in elements not loading from the database. For example, in certain scenarios, if steps are completed too quickly the wrong wardrobe can display etc. Therefore, in some cases we opted to refresh the page rather than signing in and out.

## Tests

For the firebase functions, unit testing was primarily undertaken, whereas we used integration testing for the App class.

Firebase:

- creating database
- adding a user
- ensuring same user is not added twice
- signing in and out

App.js:

- Integration testing for frontend
- Mocking for testing wardrobe elements adding/removing/displaying
- Mocking to test chatGPT responses

## How to

**Run the tests**:

- run npm test in the terminal to run the testing suites

**Build and Run Program**:

- Run npm install followed by npm start from the terminal (root directory)
- Sign in on our page using Google Authentication
- Add clothes to your wardrobe using the Add to Closet Popup form
- When you want to generate an outfit, input a prompt into the Search Bar and hit search
- If you want to remove clothes from your closet, hit the x in the top right corner
- If you like one of the suggested outfits: hit the like button
