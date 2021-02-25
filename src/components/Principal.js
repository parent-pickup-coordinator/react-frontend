import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
// import { withRouter } from 'react-router-dom';
import superagent from 'superagent';
// import io from 'socket.io-client';
import { connect } from 'react-redux';
import { populateStudents } from '../store/students-reducer.js';
import Chip from '@material-ui/core/Chip';

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

  useEffect(() => {
    // console.log('PRINCIPAL useEffect: ', 'props.state ', props.state, 'props.allStudents ', props.allStudents);
  })

  return (
    <>
      <Button onClick={dataEntryHandler}>Student Records</Button>
      <Button onClick={startParentPickup}>Start Pickup</Button>
    </>
  )
}

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalPage);