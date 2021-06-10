import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyCT-epBCfgPveel24d6Jw1lLWRmtozIyqM",
  authDomain: "superchat-ed55c.firebaseapp.com",
  databaseURL: "https://superchat-ed55c-default-rtdb.firebaseio.com",
  projectId: "superchat-ed55c",
  storageBucket: "superchat-ed55c.appspot.com",
  messagingSenderId: "205831443791",
  appId: "1:205831443791:web:cfa51171de0256ecb3a13a",
  measurementId: "G-242QZQTSH9"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <header>
              <SignOut />
            </header>
            <section>
              {user ? <ChatRoom /> : <SignIn />}
            </section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };
    return <button className="signin" onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
    return (
        auth.currentUser && (
            <button className="signout" onClick={() => auth.signOut()}>Sign Out</button>
        )
    );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

    return (
      <>
      
        <main>
            <div>
                {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} /> )}
            </div>
        </main>

        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <button type="submit" disabled={!formValue}>Send!</button>
        </form>

      </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    return (
        <div className={`message ${messageClass}`}>
          <img src={photoURL} alt='https://api.adorable.io/avatars/23/abott@adorable.png' />
            <p>{text}</p>
        </div>
    );
}

export default App;
