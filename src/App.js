import React from 'react';
import { Switch, Route } from 'react-router-dom';
import IndexPage from './components/IndexPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Principal from './components/Principal';
import Teacher from './components/Teacher';
import DataEntry from './components/DataEntry';
import PrincipalPickup from './components/PrincipalPickup';
import AddStudent from './components/AddStudent';
import DeleteStudent from './components/DeleteStudent';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  return (
    <>
    <Header/>
    <Switch>
      <Route path='/' component={IndexPage} exact />
      <Route path='/signup' component={SignUp} exact />
      <Route path='/signin' component={SignIn} exact />
      <Route path='/principal' component={Principal} exact />
      <Route path='/teacher' component={Teacher} exact />
      <Route path='/dataEntry' component={DataEntry} exact />
      <Route path='/principalPickup' component={PrincipalPickup} exact />
      <Route path='/add' component={AddStudent} exact />
      <Route path='/delete' component={DeleteStudent} exact />
    </Switch>
    <Footer/>
    </>
  );
}

export default App;
