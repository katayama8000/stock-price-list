import { db } from '@/lib/firebase';
import { fetchStockAllAtom } from '@/state/stock.state';
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { FC, useRef } from 'react';

type TDeleteModalProps = {
  stockCode: string;
};

export const DeleteModal: FC<TDeleteModalProps> = ({ stockCode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchStockAll = useSetAtom(fetchStockAllAtom);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'stocks', stockCode));
      await fetchStockAll();
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen} variant="outline" colorScheme={'primary'} mx={1}>
        削除
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              銘柄の削除
            </AlertDialogHeader>

            <AlertDialogBody>本当に削除しますか？</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                もどる
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
