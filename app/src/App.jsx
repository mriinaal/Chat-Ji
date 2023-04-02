import './App.css';
import { Route } from 'react-router-dom';
import Home from './Pages/Home';
import Chats from './Pages/Chats';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Route path='/'  component={Home} exact></Route>
        <Route path='/chats' component={Chats} exact></Route>
      </div>
    </ChakraProvider>
  );
}

export default App;
