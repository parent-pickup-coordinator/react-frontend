import React, { useState, useEffect } from 'react';
// import Button from '@material-ui/core/Button';
import superagent from 'superagent';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { populateStudents, updateStatus } from '../store/students-reducer.js';


const mapDispatchToProps = { populateStudents, updateStatus };


const DataEntry = (props) => {
  const getAll = () => {
    // const host = 'http://localhost:3001';
    const host = io('http://localhost:3001', { transports: ['websocket'] });
    const principal = io.connect(host);
    // principal.emit('connection');
    console.log('inside dataEntry');
    superagent.get('https://parent-pickup-coordinator.herokuapp.com/student')
      .then(response => {
        console.log('Line 11 response body', response.body);
      })
  }
  // const studentIDref = React.createRef();
  const [chosenChild, setChosenChild] = useState({});
  const pickupIdRef = React.createRef();
  const updateStudent = (e) => {
    e.preventDefault();
    const studentId = pickupIdRef.current.value;
    // console.log('ID: ', pickupId);
    let chosenStudent = props.allStudents.filter((child) => {
      if (child.studentID === parseInt(studentId)) return child;
    })
    setChosenChild(chosenStudent[0]);
    // let tempArray = studentArray;
    // tempArray.unshift(chosenStudent[0])
    // setStudentArray(tempArray);
    // console.log('Student Array: ', tempArray)
    props.updateStatus(studentId, 'pickupReady')

    // e.preventDefault();
    // console.log('inside dataEntry');
    // const id = studentIDref.current.value;
    // console.log(id);
    // await superagent.get(`https://parent-pickup-coordinator.herokuapp.com/student/${id}`)
    //   .then(response => {
    //     console.log('Line 11 response body', response.body);
    //   })
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
  const addOneStudent = () => {
    // console.log('inside dataEntry');
    // superagent.post('https://parent-pickup-coordinator.herokuapp.com/student/')
    //   .send({
    //     "name": "mr. Whiskers",
    //     "studentID": 5,
    //     "grade": 5,
    //     "teacher": "Mrs. Flower",
    //     "parents": ["Nancy", "Kasey"],
    //     "busRoute": 809,
    //     "district": 8,
    //     "schoolName": "Coe Elementary"
    //   })
    //   .then(response => {
    //     console.log('Line 11 response body', response.body);
    props.history.push('/add');
    // })
  }
  const deleteOneStudent = (id) => {
    // console.log('inside dataEntry');
    // superagent.delete(`https://parent-pickup-coordinator.herokuapp.com/student/${id}`)
    //   .then(response => {
    //     console.log('Line 11 response body', response.body);
    props.history.push('/delete');
    // })
  }
  const [item, setState] = useState({});

  const handleInputChange = e => {
    setState({ ...item, [e.target.name]: e.target.value });
    console.log('item in handleInputChange', item);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    e.target.reset();
    console.log('this is the item', item);
    props.handleSubmit(item);
    setState({});
  };
  return (
    <div>
      <h1>Update Student</h1>
      {/* <Button onClick={getAll}>Get All Students</Button> */}
      <form onSubmit={updateStudent}>
        <input type='text' ref={pickupIdRef} />
        <Button type='submit'>Submit</Button>
      </form>
      {/* <Button onClick={() => updateOneStudent('6021cb7e516cc7085e551726')}>Make Student Change</Button> */}
      <Form onSubmit={() => handleUpdate(chosenChild)}>
        <Form.Group>
          <Form.Label>Update the Student</Form.Label>
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Student Name</Form.Label>
          <Form.Control name="studentName" type="text" defaultValue={chosenChild.name} onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Student ID</Form.Label>
          <Form.Control type="number" min="0" name="studentID" defaultValue={chosenChild.studentID} onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Grade</Form.Label>
          <Form.Control defaultValue={chosenChild.grade} type="number" min="0" name="grade" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Teacher</Form.Label>
          <Form.Control defaultValue={chosenChild.teacher} type="text" name="teacher" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Parents</Form.Label>
          <Form.Control defaultValue={chosenChild.parents} type="text" name="parents" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Bus Route</Form.Label>
          <Form.Control defaultValue={chosenChild.busRoute} type="text" name="busRoute" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>District</Form.Label>
          <Form.Control defaultValue={chosenChild.district} type="text" name="district" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>School Name</Form.Label>
          <Form.Control defaultValue={chosenChild.schoolName} type="text" name="schoolName" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Siblings(Enter Sibling ID#)</Form.Label>
          <Form.Control defaultValue={chosenChild.siblings} type="text" name="siblings" onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Update Student</Button>
      </Form>
      {/* <Button onClick={addOneStudent}>Add New Student</Button> */}
      {/* <Button onClick={() => deleteOneStudent('6021cb7e516cc7085e551726')}>Delete Student</Button> */}

    </div>
  )
}

const mapStateToProps = state => ({
  state,
  allStudents: state.studentStore.students
})

export default connect(mapStateToProps, mapDispatchToProps)(DataEntry);;


// change out ids
// search with studentID