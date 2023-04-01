import { db } from '@/lib/firebase';
import { fetchStockAllAtom } from '@/state/stock.state';
import { TStock } from '@/type/stock.model';
import {
  useToast,
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
  Input,
  FormErrorMessage,
  PinInput,
  PinInputField,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { setDoc, doc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { FC, useState, useCallback, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

export const RegisterModal: FC = () => {
  const toast = useToast();
  const fetchStockAll = useSetAtom(fetchStockAllAtom);
  const schema = z.object({
    brand: z.string().nonempty('銘柄を入力してください'),
    stockCode: z.string().length(4, { message: '4桁の数値を入力してください' }),
    desiredYield: z.string().transform((v) => Number(v)),
  });

  type TSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: '',
      stockCode: '',
      desiredYield: 0,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScrapeStock = useCallback(async (stockCode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/stock?code=${stockCode}`);
      const { stockPrice, dividend }: TStock = await res.json();
      return { stockPrice, dividend };
    } catch (error) {
      console.log(error);
      toast({
        title: 'エラーが発生しました',
        description: '入力した銘柄コードを確認してください',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const onSubmit = async (data: TSchema) => {
    const res = await handleScrapeStock(data.stockCode);
    if (res === undefined) return;
    console.log({
      brand: data.brand,
      stockCode: data.stockCode,
      desiredYield: data.desiredYield,
      stockPrice: res.stockPrice,
      dividend: res.dividend,
    });
    try {
      await setDoc(doc(db, 'stocks', data.stockCode), {
        brand: data.brand,
        stockCode: data.stockCode,
        desiredYield: data.desiredYield,
        stockPrice: res.stockPrice,
        dividend: res.dividend,
      });
      await fetchStockAll();
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <Button onClick={onOpen} colorScheme={'purple'}>
        新規銘柄登録
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>新規銘柄登録</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl id="brand" isInvalid={Boolean(errors.brand)}>
                <FormLabel>銘柄</FormLabel>
                <Input placeholder="トヨタ自動車" {...register('brand')} />
                <FormErrorMessage>
                  {errors.brand && errors.brand?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mt={4}
                id="stockCode"
                isInvalid={Boolean(errors.stockCode)}
              >
                <FormLabel>銘柄コード</FormLabel>
                <Controller
                  name="stockCode"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <PinInput otp {...rest}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.stockCode && errors.stockCode?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mt={4}
                id="desiredYield"
                isInvalid={Boolean(errors.desiredYield)}
              >
                <FormLabel>希望利回り(後で入力でも可)</FormLabel>
                <Controller
                  name="desiredYield"
                  control={control}
                  render={({ field }) => (
                    <NumberInput precision={1} step={0.1}>
                      <NumberInputField placeholder="0.0" {...field} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.desiredYield && errors.desiredYield?.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="button"
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
                loadingText="登録中"
              >
                登録
              </Button>
              <Button onClick={handleCloseModal}>戻る</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
