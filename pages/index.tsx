import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  PinInput,
  PinInputField,
} from '@chakra-ui/react';
import Head from 'next/head';
import { type FC, useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type TStock = {
  stockPrice: number;
  dividend: number;
};

type TCompany = {
  brand: string;
  desiredYield: number; // 希望配当金
  stockCode: string; // 株コード
};

type TStockCard = TStock & TCompany;

const STOCK_CODE = '8591';
const HELLO_CODE = '5023';

const dummy: TStockCard[] = [
  {
    brand: '東京海上日動火災保険',
    stockPrice: 4000,
    dividend: 222,
    desiredYield: 2,
    stockCode: '8591',
  },
  {
    brand: '三菱ＵＦＪフィナンシャル',
    stockPrice: 13050,
    dividend: 100,
    desiredYield: 2,
    stockCode: '8306',
  },
];

export default function Home() {
  const [stock, setStock] = useState<TStock | null>(null);
  const [isLoadingStock, setIsLoadingStock] = useState<boolean>(false);

  const handleFetchStock = async () => {
    setIsLoadingStock(true);
    const res = await fetch(`/api/stock?code=${STOCK_CODE}`);
    const { stockPrice, dividend }: TStock = await res.json();
    setStock({ stockPrice, dividend });
    setIsLoadingStock(false);
  };

  const handleFetchHello = async () => {
    const res = await fetch(`/api/hello?code=${HELLO_CODE}`);
    const data = await res.json();
    console.log(data);
  };

  const [companyDataState, setCompanyDataState] = useState<TStockCard[]>(dummy);

  const handleUpdateData = (index: number) => {
    setCompanyDataState((prevState) => {
      const newData = [...prevState];
      newData[index].stockPrice = Math.round(Math.random() * 1000);
      return newData;
    });
  };

  return (
    <>
      <Head>
        <title>stock</title>
        <meta name="description" content="更新ボタンを設置したテーブル" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH="100vh">
        <RegisterModal />
        {companyDataState.map((data, index) => (
          <StockCard
            key={data.brand}
            {...data}
            onUpdateData={() => handleUpdateData(index)}
          />
        ))}
      </Box>
    </>
  );
}

type Props = {
  onUpdateData: () => void;
} & TStockCard;

export const StockCard: FC<Props> = ({
  onUpdateData,
  brand,
  stockPrice,
  dividend,
  desiredYield,
  stockCode,
}) => {
  const divYield: number = Math.round((dividend / stockPrice) * 100 * 10) / 10;
  const desiredStockPrice: number =
    Math.round(((stockPrice * divYield) / desiredYield) * 10) / 10;

  return (
    <Center>
      <Box
        bgColor={divYield >= desiredYield ? 'green.100' : 'red.100'}
        rounded="md"
        shadow="md"
        width="80"
        p="4"
        m="2"
      >
        <Heading size="md">{brand}</Heading>
        <Stack divider={<StackDivider />} spacing="2" pt="2">
          <Text pt="2" fontSize="sm">
            現在の株価 : {stockPrice}円 | 希望株価 :{desiredStockPrice}円
          </Text>
          <Text pt="2" fontSize="sm">
            利回り : {divYield}% | 希望利回り : {desiredYield}%
          </Text>
          <Text pt="2" fontSize="sm">
            配当金 : {dividend}円
          </Text>
          <Flex pt="2">
            <Button
              colorScheme={divYield >= desiredYield ? 'green' : 'red'}
              variant="outline"
              w="100%"
              mx={1}
            >
              編集
            </Button>
            <Button
              onClick={onUpdateData}
              colorScheme={divYield >= desiredYield ? 'green' : 'red'}
              variant="outline"
              loadingText="更新中"
              isLoading={false}
              w="100%"
              mx={1}
            >
              更新
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
};

const RegisterModal: FC = () => {
  const schema = z.object({
    brand: z.string().nonempty('銘柄を入力してください'),
    stockCode: z.string().length(4, { message: '4桁の数値を入力してください' }),
    desiredYield: z
      .number()
      .min(0, { message: '0以上で入力してください' })
      .max(99.9, { message: '100未満で入力してください' }),
  });

  type TSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: '',
      stockCode: '',
      desiredYield: 0,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const onSubmit = async (data: TSchema) => {
    console.log(data);
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
              >
                登録
              </Button>
              <Button onClick={onClose}>戻る</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
