// LEARNING TESTING THIS DOES NOT WORK YET

import React from 'react';
import { mount } from 'enzyme';
//import App from '../App';
//import Principal from './Principal';


// describe('<Principal />', () => {
//     it('renders Principal', () => {
//       const wrapper = render(<Principal />);
//       expect(wrapper.find('.teacherButtons')).to.have.lengthOf(2);
//     });
//  });



// describe('PrincipalPage', () => {
//   it('should render correctly in "debug" mode', () => {
//     const component = shallow(<PrincipalPage debug />);
  
//     expect(component).toMatchSnapshot();
//   });
// });



import { Provider } from "react-redux";
import {store} from "../store/index";
// import { loadProduct } from "./components/redux/actions/productActions";
// import { loadUser } from "./components/redux/actions/userActions";


describe('All Products Page Snapshot', () => {
    let mountWrapper;
    const newStore = store();

// store.dispatch(loadProduct())
// store.dispatch(loadUser())
    beforeEach(()=>{
        mountWrapper =mount(<Provider store={newStore}>
    <App />
  </Provider>);
    })    

    afterEach(()=>{
        mountWrapper.unmount();
    })

    it('renders correctly', () => {
        expect(mountWrapper).toMatchSnapshot();
    });

});