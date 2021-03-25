import React, { useEffect, useState } from 'react';
import superagent from 'superagent';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { connect } from 'react-redux';
import { populateStudents, updateStatus } from '../store/students-reducer.js';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const mapDispatchToProps = { populateStudents, updateStatus };

const PrincipalPickupPage = (props) => {
  // let pickupReadyStudents = [];
  const [pickupReadyStudents, setPickupReadyStudents] = useState([]);
  const [releasedFromClassStudents, setReleasedFromClassStudents] = useState([]);
  const [waitingStudents, setWaitingStudents] = useState([]);
  const [chosenChild, setChosenChild] = useState({});
  const [chosenBusStudents, setChosenBusStudents] = useState([]);

  const pickupIdRef = React.createRef();
  const pickupNameRef = React.createRef();
  const pickupBusRef = React.createRef();

  // const host = io.connect('https://parent-pickup-coordinator.herokuapp.com/', { transports: ['websocket'] }); //USE THIS ONE FOR DEPLOYMENT
  const host = io.connect('https://socket-server-ppc.herokuapp.com/', { transports: ['websocket'] }); //USE THIS ONE FOR TESTING

  host.on('sendingstudent', (payload) => {
    console.log('student is being sent out from teacher: ', payload.name, payload.teacher, payload.studentStatus);
    props.updateStatus(payload.studentID, payload.studentStatus);
  })

  const pickUpStudent = (e) => {
    e.preventDefault();
    const pickupId = pickupIdRef.current.value;
    // const pickupId = e.target.studentNum.value;

    let chosenStudent = props.allStudents.filter((child) => {
      if (child.studentID === parseInt(pickupId)) return child;
    })
 
    chosenStudent[0].studentStatus = 'pickupReady';
    setChosenChild(chosenStudent[0]);
    let tempArray = pickupReadyStudents;
    tempArray.unshift(chosenStudent[0])
    setPickupReadyStudents(tempArray);
    // console.log('Student Array: ', tempArray)
    props.updateStatus(pickupId, 'classRoom')
    
    // e.target.reset(); THIS WILL BREAK IT DO NOT USE!!!!!!!!!!!!!!!!!!!
  }
const pickUpStudentByName = (e) => {
  e.preventDefault();
  const pickupId = pickupNameRef.current.value;
  //console.log('All Students: -----', props.allStudents);
  let chosenStudent = props.allStudents.filter((child) => {
    console.log('Line 57 child', child);
    if (child.name === pickupId) return child;
  })
  console.log('Chosen Student: ----', chosenStudent);
  chosenStudent[0].studentStatus = 'pickupReady';
  setChosenChild(chosenStudent[0]);
  let tempArray = pickupReadyStudents;
  tempArray.unshift(chosenStudent[0])
  setPickupReadyStudents(tempArray);
  props.updateStatus(pickupId, 'classRoom')
}

const pickUpStudentByBus = (e) => {
  e.preventDefault();
const pickupId = pickupBusRef.current.value;
let busStudent = props.allStudents.filter((child) => {
  if(child.busRoute === pickupId) return child;
})
let chosenStudent = busStudent.forEach((child) => {
  child.studentStatus = 'pickupReady';
  setChosenBusStudents(chosenStudent);
}) // TODO: Add chosenBusStudent (new piece of state) into useEffect 
// Do this because it is for full array not just one object 03/11/2021 - Tina & Stacy 
}
  
  useEffect (()=> {
    console.log('PRINCIPALPICKUP useEffect: before ', {waitingStudents});
    let studentsWaiting = props.allStudents.filter(student => {
      if(student.studentStatus === 'classRoom') return student;
    }) 

    let firstStudent = studentsWaiting.filter(student => {
      if(student.studentID === chosenChild.studentID) return student;
    })

    setWaitingStudents(firstStudent);
    console.log('PRINCIPALPICKUP useEffect: after ', {waitingStudents});

    console.log('PRINCIPALPICKUP useEffect: before ', {pickupReadyStudents});

    let studentsInProcess = props.allStudents.filter(student => {
      if (student.studentStatus === 'pickupReady') return student;
    })
    setPickupReadyStudents(studentsInProcess);
    console.log('PRINCIPALPICKUP useEffect: after ', { pickupReadyStudents });

    console.log('PRINCIPALPICKUP useEffect: before ', { releasedFromClassStudents });
    let releasedStudents = props.allStudents.filter(student => {
      if (student.studentStatus === 'releasedFromClass') return student;
    })
    setReleasedFromClassStudents(releasedStudents);
    console.log('PRINCIPALPICKUP useEffect: after ', { releasedFromClassStudents });
  }, [props.allStudents])


  const sendStudent = (student) => {
    props.updateStatus(student.studentID, 'pickupReady')
    sendStudentTwo(student);
  }

  const sendStudentTwo = (student) => {
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


  const classes = useStyles();
  /* <input type='text' /> */
  return (
    <>
      { console.log('inside return', chosenChild)}

      <Card id="teacher-card" >

      <form onSubmit={pickUpStudent}>
         <input type='text' ref={pickupIdRef} placeholder="Enter Student ID #" style={{marginLeft: 13}}/>
        <Button className={classes.root} type='submit'>Search By ID #</Button>
      </form>

      <form onSubmit={pickUpStudentByName}>
         <input type='text' ref={pickupNameRef} placeholder="Enter Student Name" style={{marginLeft: 13}}/>
        <Button className={classes.root} type='submit'>Search By Name</Button>
      </form>

      <form onSubmit={pickUpStudentByBus}>
         <input type='text' ref={pickupBusRef} placeholder="Enter Bus Route" style={{marginLeft: 13}}/>
        <Button className={classes.root} type='submit'>Search By Bus</Button>
      </form>

        {/* <form onSubmit={pickUpStudent}>
          <TextField
            ref={pickupIdRef}
            id="outlined-with-placeholder"
            label="Enter Student ID"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            name="studentNum"
          />
          <Button className={classes.root} type='submit'>Find Student</Button>
        </form> */}
        
         <div id="chipcontainer">
          {waitingStudents.map((student, idx) => (
            <div id="chipchild" key={idx}>
              <Chip
                onClick={() => sendStudent(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`Send out ${student.name}`}
                clickable
                color="default"
                style={{borderColor: 'gray', borderWidth: 2, margin: 3, marginLeft: 10}}
              />
            </div>
          ))}
        </div>
        
          <div id="chipcontainer">
            {pickupReadyStudents.map((student, idx) => (
              <div id="chipchild" key={idx}>
                <Chip
                  onClick={() => sendStudent(student)}
                  variant="outlined"
                  size="medium"
                  icon={<FaceIcon />}
                  label={`${student.name} has been requested.`}
                  clickable
                  color="default"
                  style={{borderColor: 'red', borderWidth: 2, margin: 3, marginLeft: 10}}
                />
              </div>
            ))}
          </div>
          <div id="chipcontainer">
            {releasedFromClassStudents.map((student, idx) => (
              <div id="chipchild" key={idx}>
                <Chip
                  onClick={() => sendStudent(student)}
                  variant="outlined"
                  size="medium"
                  icon={<FaceIcon />}
                  label={`${student.name} is on the way out.`}
                  clickable
                  color="default"
                  style={{borderColor: 'green', borderWidth: 2, margin: 3, marginLeft: 10}}
                />
              </div>
            ))}
          </div>
        
      </Card>
    </>
  )
}


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  root: {
    background: 'linear-gradient(45deg, #2A3EB1 10%, #2C387E 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .5)',
    color: 'white',
    height: 20,
    padding: '22px',
    margin: theme.spacing(1),
  },
}));


const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalPickupPage);

// export default withRouter(PrincipalPickupPage);
