# Outfit Orbit - Term Project
## Project Details 
### Project Description
Our project is Outfit Orbit, an attempt at allowing users to repurpose and restyle items they have in their wardrobe by offering both a virtual wardrobe representation, but also providing peronalized outfit recommendations based on their pieces. Users are able to sign in to have access to their wardrobe, and are easily able to add and remove pieces which are classified by various fields. Then, users are able to input a prompt for the description of their outfit, and a ChatGPT API call is made which returns an outfit created from the pieces in the wardrobe which matches the inputted description. This outfit is then displayed, and the user has the opportunity to "like" the outfit, which allocates each of the clothing items a point. These points are taken into account when generating outfits, prioritizing pieces with a lower point value to encourage users to use their closet in its entirety and venture out from their most worn pieces. 

**Team Members**: 
Taleena (tchandar): worked on adding Wardrobe + Clothing objects to Firestore Database, parsing the GPT output into a clothing object and displaying style recommendation 
Keya (kkilacha): worked on adding new items to the Wardrobe using form 
Javier (jferna35)
Anastasio (aortiz18)

**Repository link**: https://github.com/cs0320-s2023/OutfitOrbit.git

### Design Choices 

**Frontend**: Our frontend was composed of 3 main components: the Flipcard, the Navbar and the PopUp. These were created into their own classes with css. Our App class, the biggest class of our program, incorporated all these stylized elements while ensuring that all changes made on the backend to the database were reflected and rendered in the frontend. For instance, adding or removing clothing items from the Database was first done in the backend, and then any such changes were recorded using dependencies to ensure that the App would be correctly rendered. 

**Backend**: One of the core classes of the backend was 'firebase.js'

