import React, { useEffect, useState } from 'react';
import superagent from 'superagent';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { connect } from 'react-redux';
import { populateStudents, updateStatus } from '../store/students-reducer.js';

const mapDispatchToProps = { populateStudents, updateStatus };

const PrincipalPickupPage = (props) => {
  // let pickupReadyStudents = [];
  const [pickupReadyStudents, setPickupReadyStudents] = useState([]);
  const [releasedFromClassStudents, setReleasedFromClassStudents] = useState([]);
  const [chosenChild, setChosenChild] = useState({});
  const pickupIdRef = React.createRef();
  const host = io.connect('https://socket-server-ppc.herokuapp.com/', { transports: ['websocket'] });

  host.on('sendingstudent', (payload) => {
    console.log('student is being sent out from teacher: ', payload.name, payload.teacher, payload.studentStatus);
    props.updateStatus(payload.studentID, payload.studentStatus);
  })

  const pickUpStudent = (e) => {
    e.preventDefault();
    const pickupId = pickupIdRef.current.value;
    // console.log('ID: ', pickupId);
    let chosenStudent = props.allStudents.filter((child) => {
      if (child.studentID === parseInt(pickupId)) return child;
    })
    chosenStudent[0].studentStatus = 'pickupReady';
    setChosenChild(chosenStudent[0]);
    let tempArray = pickupReadyStudents;
    tempArray.unshift(chosenStudent[0])
    setPickupReadyStudents(tempArray);
    console.log('Student Array: ', tempArray)
    props.updateStatus(pickupId, 'pickupReady')
    // updatepickupReadyStudents();
  }

  // const updatepickupReadyStudents = () => {
  useEffect (()=> {
    console.log('PRINCIPALPICKUP useEffect: before ', {pickupReadyStudents});
    let studentsInProcess = props.allStudents.filter(student => {
      if(student.studentStatus === 'pickupReady') return student;
    }) 
    setPickupReadyStudents(studentsInProcess);
    console.log('PRINCIPALPICKUP useEffect: after ', {pickupReadyStudents});

    console.log('PRINCIPALPICKUP useEffect: before ', {releasedFromClassStudents});
    let releasedStudents = props.allStudents.filter(student => {
      if(student.studentStatus === 'releasedFromClass') return student;
    }) 
    setReleasedFromClassStudents(releasedStudents);
    console.log('PRINCIPALPICKUP useEffect: after ', {releasedFromClassStudents});
  },[props.allStudents])

  const sendStudent = (student) => {
    // console.log('PRINCIPALPICKUP sendStudent: ', 'studentID ', student.studentID);
    //Match to teacher
    let teacher = student.teacher;
    // console.log('PRINCIPALPICKUP sendStudent: ', 'teacher ', teacher);
    //Get sibling ID's
    let siblings = student.siblings;
    //if siblings exist, get all teachers /////////////NOT SURE IF THIS NEXT PIECE OF LOGIC WORKS!!!
    // let sibTeachers = [];
    // if(siblings){
    //   let numSiblings = siblings.length;
    //   for (let i=0; i<numSiblings; i++){
    //     props.allStudents.filter(student => {
    //       if(student.studentID === siblings[i]){
    //         return sibTeachers.push[student.teacher];
    //       }
    //     })
    //   }
    // }
    // console.log('PRINCIPALPICKUP sendStudent: ', {sibTeachers});


    //TODO: Use teacher to send socket message, use sibTeachers to send socket message
    // console.log('student', student);

    host.emit('joinRoom', teacher);
    console.log('principal has joined room: ', teacher);
    host.emit('pickupready', student);
  }

  useEffect(() => {
    console.log('PRINCIPALPICKUP useEffect: ', 'props.state ', props.state, 'props.allStudents ', props.allStudents);
  })

  return (
    <>
      { console.log('inside return', chosenChild)}
      <form onSubmit={pickUpStudent}>
        <input type='text' ref={pickupIdRef} />
        <Button type='submit'>Submit</Button>
      </form>
      <div>
        <div>
          {pickupReadyStudents.map((student, idx) => (
            <div key={idx}>
              <Chip
                onClick={() => sendStudent(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`Send out ${student.name}`}
                clickable
                color="secondary"
              />
            </div>
          ))}
        </div>
        <div>
          {releasedFromClassStudents.map((student, idx) => (
            <div key={idx}>
              <Chip
                onClick={() => sendStudent(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`Send out ${student.name}`}
                clickable
                color="primary"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalPickupPage);

// export default withRouter(PrincipalPickupPage);


// if studentList.studentID === pickupIdRef then student name will populate in <p> else === <div>
