import { Button } from '@mui/material';
import React from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [value, setValue] = React.useState<string>("zatial nic");

  const getData = () => {
    axios.get('/helloworld')
      .then((res) => {
        setValue(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <>
      {value}
      <Button variant='contained' onClick={() => {getData()}}>Get data</Button>
    </>
  )
}

export default App;
