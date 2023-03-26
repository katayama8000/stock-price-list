import { db } from '@/lib/firebase';
import { Box, Button } from '@chakra-ui/react';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import React from 'react';

const demo = () => {
  const addFirebase = async () => {
    console.log('addFirebase');
    await setDoc(doc(db, 'cities', 'LA'), {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    });
  };
  return (
    <Box>
      <Button onClick={addFirebase}>addFirebase</Button>
      <Button>getFirebase</Button>
    </Box>
  );
};

export default demo;
