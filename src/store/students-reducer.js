let initialState = {
  students: [] //Object model: {name: 'bob',studentID: 7,grade: 2,teacher: 'Mrs. Greer',busRoute: 14,parents: ['john', 'jane'], siblings: [4,8],district: 407,schoolName: 'Stillwater',studentStatus: 'pickup'}
}

export const populateStudents = (studentsFromApi) => {
  console.log('STUDENT-REDUCER populateStudents: ', {studentsFromApi});
  return {
    type: 'POPULATE',
    payload: studentsFromApi
  }
}

export const updateStatus = (id, status) => {
  console.log('STUDENT-REDUCER updateStatus: ', {id}, {status});
  return {
    type: 'UPDATE',
    payload: {id, status}
  }
}

const studentReducer = (state=initialState, action) => {
  console.log('STUDENT-REDUCER studentReducer: ', {state}, {action});
  let { type, payload } = action;
  switch (type) {
    case 'POPULATE':
      console.log('STUDENT-REDUCER studentReducer populate ', {payload});
      return {...state, students: payload};
    
    case 'UPDATE':
      console.log('STUDENT-REDUCER studentReducer update ', {payload});
      let id = parseInt(payload.id);
      let status = payload.status;

      let tempArray = state.students.map(student => {
        if(student.studentID === id) {
          return {...student, studentStatus: status};
        } else {
          return {...student}
        }
      })
      console.log('STUDENT-REDUCER studentReducer update after: ', {tempArray});

      return {students: tempArray};

    default:
      return state;
  }
}

export default studentReducer;