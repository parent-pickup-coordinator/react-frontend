import React, { useEffect } from 'react';
// import Button from '@material-ui/core/Button';
// import { withRouter } from 'react-router-dom';
import superagent from 'superagent';
// import io from 'socket.io-client';
import { connect } from 'react-redux';
import { populateStudents } from '../store/students-reducer.js';
// import Chip from '@material-ui/core/Chip';
// import Card from '@material-ui/core/Card';
// import { makeStyles } from '@material-ui/core/styles';

const mapDispatchToProps = { populateStudents };

const PrincipalPage = (props) => {

  const dataEntryHandler = async () => {
    //TODO: remove ability to get into data entry from this page
    //TODO: rename "principal" to "monitor"
    //TODO: add "admin" page that allows for data entry/deleting students, as well as signing up new staff members/adjusting permissions
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
  // const classes = useStyles();

  useEffect(() => {
    // console.log('PRINCIPAL useEffect: ', 'props.state ', props.state, 'props.allStudents ', props.allStudents);
  })

  return (
    <>
      <div id="background-image">
        <div id="card-image" variant="outlined">
          <div id="card-inset">
            <button class="teacherButtons" id="button1" onClick={dataEntryHandler}>Student Records</button>
            <button class="teacherButtons" id="button2" onClick={startParentPickup}>Start Student Pickup</button>
          </div>
        </div>
      </div>
    </>
  )
}


// className={classes.root}
// const useStyles = makeStyles((theme) => ({
//   root: {
//     background: 'linear-gradient(45deg, #2A3EB1 10%, #2C387E 90%)',
//     border: 0,
//     borderRadius: 3,
//     boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .5)',
//     color: 'white',
//     height: 45,
//     padding: '30px',
//     margin: theme.spacing(1),
//   },
// }));

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalPage);