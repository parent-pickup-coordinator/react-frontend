import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// new adapter to let enzyme work correctly in the jest environment
configure({ adapter: new Adapter()}); 


