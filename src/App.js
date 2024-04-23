import './App.css';
import Section1 from './section1';
import Section2 from './section2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts.css'

function App() {
  return (
    <div className="app-container">
      <Section1 />
      <Section2 />
    </div>
  );
}

export default App;