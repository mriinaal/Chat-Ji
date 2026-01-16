import React from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'
import './call.css'
import JoinModal from './JoinModal'

function Call() {

  return (
    <Popover>
        <PopoverTrigger>
        <img alt='CALL' src='https://cdn-icons-png.flaticon.com/512/1160/1160041.png' className='logout videoCall'/>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>GO LIVE!</PopoverHeader>
            <PopoverBody>
              <JoinModal/>
            </PopoverBody>
        </PopoverContent>
    </Popover>
  )
}

export default Call