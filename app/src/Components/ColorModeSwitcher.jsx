import React from 'react'
import { useColorMode, Button } from '@chakra-ui/react';

function ColorModeSwitcher() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Button onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}>
      {colorMode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </Button>
  );
}


export default ColorModeSwitcher