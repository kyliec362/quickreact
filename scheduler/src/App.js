import 'rbx/index.css';
import CourseList from './components/CourseList'; 
import { Button, Container, Message, Title } from "rbx";
import React, { useState, useEffect} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { timeParts } from './components/Course/times'

const firebaseConfig = {
    apiKey: "AIzaSyDK454axAEoICoj0T8dZ52xZlnQmgR9Q5U",
    authDomain: "scheduler-883aa.firebaseapp.com",
    databaseURL: "https://scheduler-883aa.firebaseio.com",
    projectId: "scheduler-883aa",
    storageBucket: "scheduler-883aa.appspot.com",
    messagingSenderId: "323894437433",
    appId: "1:323894437433:web:2922305ff91a27015acfe8",
    measurementId: "G-VNGPBQ8DJ8",
  };
  
firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};

export default App;
