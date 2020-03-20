import React, { useContext, useEffect } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.config'
import { useState, createContext } from "react";
import {Route, Redirect} from 'react-router-dom'

firebase.initializeApp(firebaseConfig);

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
    const auth = Auth();
    return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

export const PrivateRoute = ({ children, ...rest }) => {
    const auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

const getUser = user => {
    const { displayName, email, photoURL } = user;
    const shortenUser = { name: displayName, email, photo: photoURL };
    return shortenUser;
}

const Auth = () => {
    const [user, setUser] = useState(null);

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider)
            .then(res => {
                const signedInUser = getUser(res.user);
                setUser(signedInUser);
                return res.user;
            })
            .catch(err => {
                setUser(null);
                return err.message;
            })
    }

    const signOut = () => {
        firebase.auth().signOut().then(function () {
            setUser(null);
        }).catch(function (error) {
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const currentUser = getUser(user);
                setUser(currentUser);
            } else {
                // No user is signed in.
            }
        });
    }, [])

    return {
        user,
        signInWithGoogle,
        signOut
    }
}

export default Auth;