import React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

const IndexPage = (props) => {
  const signUpHandler = () => {
    console.log('Clicked on signup')
    props.history.push('/signup');

  }
  const signInHandler = () => {
    console.log('Clicked on signin')
    props.history.push('/signin');

  }
  return (
    <>
      <Button onClick={signUpHandler}>Sign up</Button>
      <Button onClick={signInHandler}>Sign in</Button>
    </>
  )
}

export default withRouter(IndexPage);