import { db } from '@/lib/firebase';
import { Box, Button } from '@chakra-ui/react';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
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

  const getFirebase = async () => {
    console.log('getFirebase');
    const docRef = doc(db, 'cities', 'LA');
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
  };

  return (
    <Box>
      <Button onClick={addFirebase}>addFirebase</Button>
      <Button onClick={getFirebase}>getFirebase</Button>
    </Box>
  );
};

export default demo;
