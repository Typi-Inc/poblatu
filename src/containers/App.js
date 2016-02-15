import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>App</div>
        <Link to="/hello">Hello</Link>
      </div>
    );
  }
}

export default App;
