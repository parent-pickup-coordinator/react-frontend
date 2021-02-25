import React, { useState, useEffect } from 'react';
//import FormGroup from '@material-ui/core/FormGroup';
//import Input from '@material-ui/core/Input';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import superagent from 'superagent';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { populateStudents, updateStatus } from '../store/students-reducer.js';

const mapDispatchToProps = { populateStudents, updateStatus };

const TeacherPage = (props) => {
  const [name, setName] = useState('');
  const [pickupReadyStudents, setPickupReadyStudents] = useState([]);
  const [releasedFromClassStudents, setReleasedFromClassStudents] = useState([]);
  const [inClassStudents, setInClassStudents] = useState([]);
  // const [classRoster, setClassRoster] = useState([]);
  const teacherNameRef = React.createRef();
  const host = io.connect('https://socket-server-ppc.herokuapp.com/', { transports: ['websocket'] });
  
  host.on('pickupready', (payload) => {
    console.log('this is the pickup on teacherPage, student:', payload.name);
    props.updateStatus(payload.studentID, payload.studentStatus);
  })

  const updateStudent = () => {
    props.history.push('/dataEntry');
  }

  const classList = async (e) => {
    e.preventDefault();
    const teacherName = teacherNameRef.current.value;
    // console.log('TEACHER NAME: ', teacherName);
    joinRoom(teacherName);
    let students = await superagent.get('https://parent-pickup-coordinator.herokuapp.com/student')
      .then(response => {
        return response.body;
      })
      .catch(err => {
        console.error(err);
      });
    // eslint-disable-next-line array-callback-return
    let filteredStudents = students.filter((item) => {
      if (item.teacher === teacherName) {
        return item;
      }
    })
    // setClassRoster(filteredStudents);
    props.populateStudents(filteredStudents);
  }

  const searchName = (e) => {
    // console.log(e.target.value);
    let teacherName = e.target.value;
    setName(teacherName);
  }

  const joinRoom = (teacherName) => {
    // const host = io.connect('http://localhost:3001', { transports: ['websocket'] });
    host.emit('joinRoom', (teacherName));
    console.log(`${teacherName} has joined a room`);
  }

  const studentReleased = (student) => {
    // console.log('TODO: make magic happen like a check mark');
    console.log('TEACHER studentReleased: ', {student});
    //Match to teacher
    student.studentStatus = 'releasedFromClass';
    console.log('TEACHER studentReleased: updatedStatus ', {student});
    props.updateStatus(student.ID, student.studentStatus);
    let teacher = student.teacher;
    //TODO: Use teacher to send socket message, use sibTeachers to send socket message
    host.emit('sendingstudent', student);

  }

  useEffect (()=> {
    //generate list of students that have status of pickupReady
    console.log('PRINCIPALPICKUP useEffect: before ', {pickupReadyStudents});
    let studentsInProcess = props.classRoster.filter(student => {
      if(student.studentStatus === 'pickupReady') return student;
    }) 
    setPickupReadyStudents(studentsInProcess);
    console.log('PRINCIPALPICKUP useEffect: after ', {pickupReadyStudents});

    //generate list of students that have a status of releasedFromClass
    console.log('PRINCIPALPICKUP useEffect: before ', {releasedFromClassStudents});
    let releasedStudents = props.classRoster.filter(student => {
      if(student.studentStatus === 'releasedFromClass') return student;
    }) 
    setReleasedFromClassStudents(releasedStudents);
    console.log('PRINCIPALPICKUP useEffect: after ', {releasedFromClassStudents});

    //generate list of students that have a status of classRoom
    console.log('PRINCIPALPICKUP useEffect: before ', {inClassStudents});
    let waitingStudents = props.classRoster.filter(student => {
      if(student.studentStatus === 'classRoom') return student;
    }) 
    setInClassStudents(waitingStudents);
    console.log('PRINCIPALPICKUP useEffect: after ', {inClassStudents});
  },[props.classRoster])

  useEffect(() => {
    console.log('TEACHER useEffect: ', 'props.classRoster', props.classRoster);
  })

  return (

    <>
      {/* { console.log('inside return', classRoster)} */}
      <Button onClick={updateStudent}>Update Student</Button>

      <form onSubmit={classList}>
        <input onChange={searchName} type='text' ref={teacherNameRef} placeholder="Teacher Last Name"/>
        <Button type='submit'>Submit</Button>
      </form>
      {/* <div>
        {props.classRoster.map((student, idx) => (
          <div key={idx}>
            <p onClick={() => studentReleased(student)}>{student.name}</p>
          </div>
        ))}
      </div> */}
      <div>
        <div>
          {pickupReadyStudents.map((student, idx) => (
            <div key={idx}>
              <Chip
                onClick={() => studentReleased(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`${student.name}`}
                clickable
                color="secondary"
              />
            </div>
          ))}
        </div>
        <div>
          {inClassStudents.map((student, idx) => (
            <div key={idx}>
              <Chip
                onClick={() => studentReleased(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`${student.name}`}
                clickable
                color="gray"
              />
            </div>
          ))}
        </div>
        <div>
          {releasedFromClassStudents.map((student, idx) => (
            <div key={idx}>
              <Chip
                onClick={() => studentReleased(student)}
                variant="outlined"
                size="medium"
                icon={<FaceIcon />}
                label={`${student.name}`}
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
  classRoster: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPage);

// export default withRouter(TeacherPage);