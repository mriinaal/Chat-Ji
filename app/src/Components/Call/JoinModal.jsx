import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import {LinkIcon} from '@chakra-ui/icons'

function JoinModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = React.useState('full')
    const handleSizeClick = (newSize) => {
        setSize(newSize)
        if(roomCode !== "") onOpen()
      }

    const [roomCode, setRoomCode] = useState("");

    const handleFormSubmit =(e)=>{
      e.preventDefault();
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
          onClick={() => handleSizeClick(size)}
          key={size}
          size='sm'
          variant='solid'
          my={1}
          colorScheme='messenger'
          rightIcon={<LinkIcon boxSize={3}/>}
        >{`Join`}</Button>
    </form>
      <Modal onClose={onClose} size={size} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
            <iframe className='iFrame' src={`http://localhost:3000/call/${roomCode}`} title="myIframe"></iframe>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default JoinModal