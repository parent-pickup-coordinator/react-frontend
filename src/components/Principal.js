import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
// import { withRouter } from 'react-router-dom';
import superagent from 'superagent';
// import io from 'socket.io-client';
import { connect } from 'react-redux';
import { populateStudents } from '../store/students-reducer.js';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const mapDispatchToProps = { populateStudents };

const PrincipalPage = (props) => {

  const dataEntryHandler = async () => {
    console.log('going to data entry');
    let currentStudents = await superagent.get('https://parent-pickup-coordinator.herokuapp.com/student')
      .then(response => {
        return response.body;
      })

    props.populateStudents(currentStudents);
    props.history.push('/dataEntry');
    console.log(currentStudents);
  }
  const startParentPickup = async () => {
    console.log('Parent Pickup')
    console.log('inside dataEntry');
    let currentStudents = await superagent.get('https://parent-pickup-coordinator.herokuapp.com/student')
      .then(response => {
        return response.body;
      })

    props.populateStudents(currentStudents);

    props.history.push('/principalPickup');
  }
  const classes = useStyles();

  useEffect(() => {
    // console.log('PRINCIPAL useEffect: ', 'props.state ', props.state, 'props.allStudents ', props.allStudents);
  })

  return (
    <>
      <Card id="teacher-card" >
        <Button className={classes.root} onClick={dataEntryHandler}>Student Records</Button>
        <Button className={classes.root} onClick={startParentPickup}>Start Pickup</Button>
      </Card>
    </>
  )
}



const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(45deg, #2A3EB1 10%, #2C387E 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .5)',
    color: 'white',
    height: 45,
    padding: '30px',
    margin: theme.spacing(1),
  },
}));

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalPage);