import React from 'react'
import { useColorMode, Button } from '@chakra-ui/react';

function ColorModeSwitcher() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Button className='ColorModeSwitcherButton' onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}>
      {colorMode === 'light' ? <img src="https://cdn-icons-png.flaticon.com/512/6714/6714978.png" alt="darkLOGO" /> : <img src="https://www.pngkit.com/png/full/132-1321741_sunny-sunny-icon-white.png" alt="sunnyLOGO"/>}
    </Button>
  );
}


export default ColorModeSwitcher