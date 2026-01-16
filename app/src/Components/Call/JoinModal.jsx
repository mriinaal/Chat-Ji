import React, { useState } from 'react'
import {
    // Modal,
    // ModalOverlay,
    // ModalContent,
    // ModalFooter,
    // ModalBody,
    // ModalCloseButton,
    Button,
    //useDisclosure,
} from '@chakra-ui/react'
import {LinkIcon} from '@chakra-ui/icons'
import { useHistory } from "react-router-dom";

function JoinModal() {
    const history = useHistory();

    // const { isOpen, onOpen, onClose } = useDisclosure()
    // const [size, setSize] = React.useState('full')
    // const handleSizeClick = (newSize) => {
    //     setSize(newSize)
    //     onOpen()
    // }

    const [roomCode, setRoomCode] = useState("");

    const handleFormSubmit =(e)=>{
      e.preventDefault();
      history.push(`/call/${roomCode}`);
    }


  return (
    <>
    <form onSubmit={handleFormSubmit}>
      <div>
      <label htmlFor='roomId' >Enter Room Code:</label>
      <input 
      id='roomId' 
      value={roomCode}
      onChange={(e)=> setRoomCode(e.target.value)}
      type='text' 
      required 
      placeholder='Enter Code' 
      />
      </div>
      <Button
          type='submit'
          // onClick={() => handleSizeClick(size)}
          // key={size}
          size='sm'
          variant='solid'
          my={1}
          colorScheme='messenger'
          rightIcon={<LinkIcon boxSize={3}/>}
        >{`Join`}</Button>
    </form>
      {/* <Modal 
        onClose={onClose}
        size={size} 
        isOpen={isOpen}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className='iFrame'>
            <iframe className='iFrame' src={`https://chatji.onrender.com/call/${roomCode}`} title="myIframe"></iframe>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  )
}

export default JoinModal