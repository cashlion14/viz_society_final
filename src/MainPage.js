import Navbar from './Navbar.js'; // Import the Navbar component
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './placeholder.png';
import './utilities.css'


const MainPage = () => {
  return (
    <div className="main">
        <Navbar />
        <div className="main">
            <h2>Welcome to Eat the Rich</h2>
            <div className="primary-viz-content">
                <img src={myImage} alt="" style={{ width: '700px', height: 'auto'}}/>
            </div>
        </div>
    </div>
  );
};

export default MainPage;