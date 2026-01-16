import './App.css';
import { Route } from 'react-router-dom';
import Home from './Pages/Home';
import Chats from './Pages/Chats';
import { ChakraProvider } from '@chakra-ui/react';
import VideoCall from './Components/Call/VideoCall';
import ErrorPage from './Components/Call/ErrorPage';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Route path='/'  component={Home} exact></Route>
        <Route path='/chats' component={Chats} exact></Route>
        <Route path='/call/:roomCode' component={VideoCall}></Route> 
        <Route path='/error' component={ErrorPage}></Route> 
      </div>
    </ChakraProvider>
  );
}

export default App;
