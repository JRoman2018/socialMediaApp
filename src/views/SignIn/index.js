import React from 'react';


export function SignIn({auth, firebase}) {
    const signInWithGoogle = () =>{
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }
    return (
        <button onClick={signInWithGoogle}>Sign in with google</button>
    )
}

export 
