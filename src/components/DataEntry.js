import React, { useState, useEffect } from 'react';
// import Button from '@material-ui/core/Button';
import superagent from 'superagent';
// import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { populateStudents, updateStatus } from '../store/students-reducer.js';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import './DataEntry.scss';

const mapDispatchToProps = { populateStudents, updateStatus };


const DataEntry = (props) => {

  const [allStudentsData, setAllStudentsData] = useState([]);
  const [chosenChild, setChosenChild] = useState({});
  const [retrieveStudentForm, setRetrieveStudentForm] = useState(false);
  const [addStudentForm, setAddStudentForm] = useState(false);
  const [updateStudentForm, setUpdateStudentForm] = useState(false);
  const [deleteStudentForm, setDeleteStudentForm] = useState(false);

  const pickupIdRef = React.createRef();
  const studentNameRef = React.createRef();
  const studentIDRef = React.createRef();
  const studentGradeRef = React.createRef();
  const studentTeacherRef = React.createRef();
  const studentParentsRef = React.createRef();
  const studentBusRef = React.createRef();
  const studentDistrictRef = React.createRef();
  const studentSchoolRef = React.createRef();
  const studentSiblingsRef = React.createRef();

  // const studentIDref = React.createRef();

  useEffect(() => {
    getAll();
  }, [])

  const getAll = async () => {

    console.log('inside dataEntry');
    let studentsFromDB = await superagent.get('https://parent-pickup-coordinator.herokuapp.com/student')
      .then(response => {
        console.log('Line 11 response body', response.body);
        return response.body;
      })

    setAllStudentsData(studentsFromDB);
  }

  const updateStudent = () => {

    // e.preventDefault();
    const studentId = pickupIdRef.current.value;
    console.log('DATAENTRY updateStudent ID: ', studentId);
    let chosenStudent = allStudentsData.filter((child) => {
      if (child.studentID === parseInt(studentId)) return child;
    })
    if (chosenStudent.length < 1) {
      chosenStudent[0] = { name: 'Enter Student Name', studentID: 0, grade: 0, teacher: 'Enter Teacher', busRoute: 'Enter Bus Route #', parents: 'Enter Parents', siblings: 'Enter Sibling ID #\'s', district: 'Enter School District #', schoolName: 'Enter School Name', studentStatus: 'classRoom' };
    }
    setChosenChild(chosenStudent[0]);
  }

  const updateOneStudent = (e) => {
    // console.log('inside dataEntry');
    e.preventDefault();
    console.log('this is the updated child', chosenChild)
    console.log(chosenChild.studentID);
    let id = chosenChild.studentID;
    superagent.put(`https://parent-pickup-coordinator.herokuapp.com/student/${id}`)
      .send({
        "name": chosenChild.name,
        "studentID": chosenChild.studentID,
        "grade": chosenChild.grade,
        "teacher": chosenChild.teacher,
        "parents": chosenChild.parents,
        "busRoute": chosenChild.busRoute,
        "district": chosenChild.district,
        "schoolName": chosenChild.schoolName
      })
      .then(response => {
        console.log('Line 11 response body', response.body);
      })
  }

  useEffect(() => {
    // console.log('DATA ENTRY useEffect: ', 'props.state ', props.state, 'props.allStudents ', props.allStudents);
  })

  const addStudentRecord = async () => {
    console.log('DATAENTRY addStudentRecord');

    let studentName = studentNameRef.current.value;
    let studentID = studentIDRef.current.value;
    let studentTeacher = studentTeacherRef.current.value;
    let studentGrade = studentGradeRef.current.value;
    let studentParents = studentParentsRef.current.value;
    let studentBus = studentBusRef.current.value;
    let studentDistrict = studentDistrictRef.current.value;
    let studentSchool = studentSchoolRef.current.value;
    let studentSiblings = studentSiblingsRef.current.value;

    await superagent.post('https://dina-cors-anywhere.herokuapp.com/https://parent-pickup-coordinator.herokuapp.com/student/')
      .send({
        "name": studentName,
        "studentID": studentID,
        "grade": studentGrade,
        "teacher": studentTeacher,
        "parents": [studentParents],
        "busRoute": studentBus,
        "district": studentDistrict,
        "schoolName": studentSchool,
        "siblings": [studentSiblings],
        "studentStatus": "classRoom"
      })
      .then(response => {
        console.log('Line 11 response body', response.body);
        console.log('Student Added to DB');
      })
    setAddStudentForm(false);
  }

  const updateStudentRecord = async () => {
    console.log('DATAENTRY updateStudentRecord');

    let studentName = studentNameRef.current.value;
    let studentID = studentIDRef.current.value;
    let studentTeacher = studentTeacherRef.current.value;
    let studentGrade = studentGradeRef.current.value;
    let studentParents = studentParentsRef.current.value;
    let studentBus = studentBusRef.current.value;
    let studentDistrict = studentDistrictRef.current.value;
    let studentSchool = studentSchoolRef.current.value;
    let studentSiblings = studentSiblingsRef.current.value;

    let id = chosenChild._id;

    await superagent.put(`https://parent-pickup-coordinator.herokuapp.com/student/${id}`)
      .send({
        "name": studentName,
        "studentID": studentID,
        "grade": studentGrade,
        "teacher": studentTeacher,
        "parents": [studentParents],
        "busRoute": studentBus,
        "district": studentDistrict,
        "schoolName": studentSchool,
        "siblings": [studentSiblings],
        "studentStatus": "classRoom"
      })
      .then(response => {
        console.log('Line 11 response body', response.body);
        console.log('Student Added to DB');
      })
    setUpdateStudentForm(false);
  }

  const deleteStudent = () => {
    console.log('inside dataEntry', { chosenChild });
    let id = chosenChild._id;
    superagent.delete(`https://parent-pickup-coordinator.herokuapp.com/student/${id}`)
      .then(response => {
        console.log('Line 11 response body', response.body);
        console.log('Student # ', id, ' deleted.')
      })
    setDeleteStudentForm(false);
  }

  const [item, setItem] = useState({});

  const handleInputChange = e => {
    setItem({ ...item, [e.target.name]: e.target.value });
    console.log('item in handleInputChange', item);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    e.target.reset();
    console.log('this is the item', item);
    props.handleSubmit(item);
    setItem({});
  };

  const retrieve = () => {
    console.log('DATAENTRY retrieve', pickupIdRef.current.value);
    updateStudent();
    setRetrieveStudentForm(true)
  }

  const add = () => {
    console.log('DATAENTRY add', pickupIdRef.current.value);
    updateStudent();
    setAddStudentForm(true)
  }

  const update = () => {
    console.log('DATAENTRY update', pickupIdRef.current.value);
    updateStudent();
    setUpdateStudentForm(true)
  }

  const deleteChosen = () => {
    console.log('DATAENTRY deleteChosen', pickupIdRef.current.value);
    updateStudent();
    setDeleteStudentForm(true)
  }
  const classes = useStyles();
  return (
    <div>
      <h1>Update Student</h1>
      {/* <Button onClick={getAll}>Get All Students</Button> */}
      <Card>
        <form>
          <div id="buttons">
            <div>
              <input id="dataStuff" type='text' ref={pickupIdRef} placeholder="Enter Student ID #" />
            </div>
            <div>
              <Button id="dataStuff" className={classes.root} onClick={retrieve} type='button'>Retrieve Student Record</Button>
            </div>
            <div>
              <Button id="dataStuff" className={classes.root} onClick={add} type='button'>Add Student Record</Button>
            </div>
            <div>
              <Button id="dataStuff" className={classes.root} onClick={update} type='button'>Update Student Record</Button>
            </div>
            <div>
              <Button id="dataStuff" className={classes.root} onClick={deleteChosen} type='button'>Delete Student Record</Button>
            </div>
          </div>
        </form>
        {/* <Button onClick={() => updateOneStudent('6021cb7e516cc7085e551726')}>Make Student Change</Button> */}


        {(retrieveStudentForm === false) ? <div></div> :
          <Form>
            <Form.Group>
              <Form.Label>Current Student Record</Form.Label>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Student Name</Form.Label>
              <Form.Control name="studentName" type="text" defaultValue={chosenChild.name} disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="number" min="0" name="studentID" defaultValue={chosenChild.studentID} disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade</Form.Label>
              <Form.Control defaultValue={chosenChild.grade} type="number" min="0" name="grade" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Teacher</Form.Label>
              <Form.Control defaultValue={chosenChild.teacher} type="text" name="teacher" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parents</Form.Label>
              <Form.Control defaultValue={chosenChild.parents} type="text" name="parents" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bus Route</Form.Label>
              <Form.Control defaultValue={chosenChild.busRoute} type="text" name="busRoute" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Control defaultValue={chosenChild.district} type="text" name="district" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control defaultValue={chosenChild.schoolName} type="text" name="schoolName" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Siblings(Enter Sibling ID#)</Form.Label>
              <Form.Control defaultValue={chosenChild.siblings} type="text" name="siblings" disabled="disabled"></Form.Control>
            </Form.Group>
            <Button onClick={() => setRetrieveStudentForm(false)} variant="primary" type="submit">Close Detail View</Button>
          </Form>
        }


        {(addStudentForm === false) ? <div></div> :
          <Form>
            <Form.Group>
              <Form.Label>Add a Student Record</Form.Label>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Student Name</Form.Label>
              <Form.Control name="studentName" type="text" defaultValue={chosenChild.name} ref={studentNameRef}></Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="number" min="0" name="studentID" defaultValue={chosenChild.studentID} ref={studentIDRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade</Form.Label>
              <Form.Control defaultValue={chosenChild.grade} type="number" min="0" name="grade" ref={studentGradeRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Teacher</Form.Label>
              <Form.Control defaultValue={chosenChild.teacher} type="text" name="teacher" ref={studentTeacherRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parents</Form.Label>
              <Form.Control defaultValue={chosenChild.parents} type="text" name="parents" ref={studentParentsRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bus Route</Form.Label>
              <Form.Control defaultValue={chosenChild.busRoute} type="text" name="busRoute" ref={studentBusRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Control defaultValue={chosenChild.district} type="text" name="district" ref={studentDistrictRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control defaultValue={chosenChild.schoolName} type="text" name="schoolName" ref={studentSchoolRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Siblings(Enter Sibling ID#)</Form.Label>
              <Form.Control defaultValue={chosenChild.siblings} type="text" name="siblings" ref={studentSiblingsRef}></Form.Control>
            </Form.Group>
            <Button onClick={() => setAddStudentForm(false)} variant="primary" type="button">Cancel</Button>
            <Button onClick={addStudentRecord} variant="primary" type="button">Add Student</Button>
          </Form>
        }


        {(updateStudentForm === false) ? <div></div> :
          <Form>
            <Form.Group>
              <Form.Label>Record to Update</Form.Label>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Student Name</Form.Label>
              <Form.Control name="studentName" type="text" defaultValue={chosenChild.name} ref={studentNameRef}></Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="number" min="0" name="studentID" defaultValue={chosenChild.studentID} ref={studentIDRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade</Form.Label>
              <Form.Control defaultValue={chosenChild.grade} type="number" min="0" name="grade" ref={studentGradeRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Teacher</Form.Label>
              <Form.Control defaultValue={chosenChild.teacher} type="text" name="teacher" ref={studentTeacherRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parents</Form.Label>
              <Form.Control defaultValue={chosenChild.parents} type="text" name="parents" ref={studentParentsRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bus Route</Form.Label>
              <Form.Control defaultValue={chosenChild.busRoute} type="text" name="busRoute" ref={studentBusRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Control defaultValue={chosenChild.district} type="text" name="district" ref={studentDistrictRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control defaultValue={chosenChild.schoolName} type="text" name="schoolName" ref={studentSchoolRef}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Siblings(Enter Sibling ID#)</Form.Label>
              <Form.Control defaultValue={chosenChild.siblings} type="text" name="siblings" ref={studentSiblingsRef}></Form.Control>
            </Form.Group>
            <Button onClick={() => setUpdateStudentForm(false)} variant="primary" type="button">Cancel</Button>
            <Button onClick={updateStudentRecord} variant="primary" type="button">Update Student</Button>
          </Form>
        }


        {(deleteStudentForm === false) ? <div></div> :
          <Form>
            <Form.Group>
              <Form.Label>Record to Delete</Form.Label>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Student Name</Form.Label>
              <Form.Control name="studentName" type="text" defaultValue={chosenChild.name} disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="number" min="0" name="studentID" defaultValue={chosenChild.studentID} disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade</Form.Label>
              <Form.Control defaultValue={chosenChild.grade} type="number" min="0" name="grade" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Teacher</Form.Label>
              <Form.Control defaultValue={chosenChild.teacher} type="text" name="teacher" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Parents</Form.Label>
              <Form.Control defaultValue={chosenChild.parents} type="text" name="parents" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bus Route</Form.Label>
              <Form.Control defaultValue={chosenChild.busRoute} type="text" name="busRoute" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Control defaultValue={chosenChild.district} type="text" name="district" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control defaultValue={chosenChild.schoolName} type="text" name="schoolName" disabled="disabled"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Siblings(Enter Sibling ID#)</Form.Label>
              <Form.Control defaultValue={chosenChild.siblings} type="text" name="siblings" disabled="disabled"></Form.Control>
            </Form.Group>
            <Button onClick={() => setDeleteStudentForm(false)} variant="primary" type="submit">Cancel</Button>
            <Button onClick={() => deleteStudent(chosenChild)} variant="primary" type="submit">Delete Record</Button>
          </Form>
        }
        {/* <Button onClick={addOneStudent}>Add New Student</Button> */}
        {/* <Button onClick={() => deleteOneStudent('6021cb7e516cc7085e551726')}>Delete Student</Button> */}


      </Card>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(45deg, #2A3EB1 10%, #2C387E 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .5)',
    color: 'white',
    height: 40,
    padding: '10px',
    margin: theme.spacing(1),
  },
}));

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(DataEntry);;


// change out ids
// search with studentID