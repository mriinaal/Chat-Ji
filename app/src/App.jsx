import './App.css';
import { Route } from 'react-router-dom';
import Home from './Pages/Home';
import Chatzone from './Pages/Chatzone';
import Messages from './Pages/Messages';
import { ChakraProvider } from '@chakra-ui/react';
import VideoCall from './Components/Call/VideoCall';
import ErrorPage from './Components/Call/ErrorPage';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Route path='/'  component={Home} exact></Route>
        <Route path='/messages' component={Messages} exact></Route>
        <Route path='/chatzone' component={Chatzone} exact></Route>
        <Route path='/call/:roomCode' component={VideoCall}></Route> 
        <Route path='/error' component={ErrorPage}></Route> 
      </div>
    </ChakraProvider>
  );
}

export default App;
