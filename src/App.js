import './App.css';
import React from 'react'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import photoURL from './logo.svg'
import './App.css'

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyB07xYkU15Hlc5CGPsgrbtJ69pmqpD-ctE",
    authDomain: "socialape-f074e.firebaseapp.com",
    projectId: "socialape-f074e",
    storageBucket: "socialape-f074e.appspot.com",
    messagingSenderId: "36632071515",
    appId: "1:36632071515:web:b85b7a980be7f9f9fa1e7e",
    measurementId: "G-ZJF9NREFGV"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
       
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
    const signInWithGoogle = () =>{
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }
    return (
        <button onClick={signInWithGoogle}>Sign in with google</button>
    )
}

function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const dummy = React.useRef();

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = React.useState('');

  const sendMessage = async (e) =>{
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <main>
        <SignOut/>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={e => setFormValue(e.target.value)}/>
        <button type="submit">send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt=""/>
      <p>{text}</p>
    </div>
  )
}


export default App;
