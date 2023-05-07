import React from 'react';
import Navbar from '../frontend/Components/Navbar.js';
import {WardrobeDB} from '../backend/firebase.js';
import AddClothingForm from '../backend/components/AddClothingForm';

type AppProps = {
  isSignedIn?: boolean;
  GPTresponse?: string;
};

const App: React.FC<AppProps> = ({ isSignedIn = false, GPTresponse = '' }) => {
  return (
    <div className="App">
      <Navbar />
      {isSignedIn && GPTresponse ? (
        <WardrobeDB wardrobeItems={JSON.parse(GPTresponse)} />
      ) : !isSignedIn ? (
        <p>Please log in to see your wardrobe!</p>
      ) : (
        <p>Enter a prompt for a personalized recommendation</p>
      )}
      <AddClothingForm />
    </div>
  );
};

export default App;