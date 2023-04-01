import { db } from '@/lib/firebase';
import { fetchStockAllAtom } from '@/state/stock.state';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
} from '@chakra-ui/react';
import { updateDoc, doc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { FC, useRef, useState } from 'react';

type TEditModalProps = {
  desiredYield: number;
  stockCode: string;
};

export const EditModal: FC<TEditModalProps> = ({ desiredYield, stockCode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchStockAll = useSetAtom(fetchStockAllAtom);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [desiredYieldValue, setDesiredYieldValue] =
    useState<number>(desiredYield);

  const handleEditDesiredYield = async () => {
    try {
      await updateDoc(doc(db, 'stocks', stockCode), {
        desiredYield: desiredYieldValue,
      });
      await fetchStockAll();
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen} variant="outline" colorScheme={'primary'} mx={1}>
        編集
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>希望利回り編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>希望利回り</FormLabel>
              <NumberInput
                precision={1}
                step={0.1}
                value={desiredYieldValue}
                onChange={(valueString) => {
                  setDesiredYieldValue(Number(valueString));
                }}
              >
                <NumberInputField placeholder="0.0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditDesiredYield}>
              編集
            </Button>
            <Button onClick={onClose}>戻る</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
