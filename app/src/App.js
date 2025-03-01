import logo from './K-Link-Logo.svg'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="K-LINK Logo" />
        <p>
          K-LINK is a platform that enables students to connect, learn, and collaborate through various activities.
        </p>
        <a
          className="App-link"
          href="https://k-link-v3.vercel.app" 
          target="_blank"
          rel="noopener noreferrer"
        >
          K-LINK
        </a>
      </header>
    </div>
  );
}

export default App;
