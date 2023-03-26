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
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import Head from 'next/head';
import { type FC, useState, useRef } from 'react';

type TStock = {
  stockPrice: number;
  dividend: number;
};

type TCompanyData = {
  companyName: string;
  desiredYield: number; // 希望配当金
  stockCode: string; // 株コード
} & TStock;

const STOCK_CODE = '8591';
const HELLO_CODE = '5023';

const dummy: TCompanyData[] = [
  {
    companyName: '東京海上日動火災保険',
    stockPrice: 4000,
    dividend: 222,
    desiredYield: 2,
    stockCode: '8591',
  },
  {
    companyName: '三菱ＵＦＪフィナンシャル',
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

  const [companyDataState, setCompanyDataState] =
    useState<TCompanyData[]>(dummy);

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
            key={data.companyName}
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
} & TCompanyData;

export const StockCard: FC<Props> = ({
  onUpdateData,
  companyName,
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
        <Heading size="md">{companyName}</Heading>
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  return (
    <>
      <Button onClick={onOpen} colorScheme={'purple'}>
        新規銘柄登録
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新規銘柄登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>会社名</FormLabel>
              <Input placeholder="トヨタ自動車" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>銘柄コード</FormLabel>
              <Input placeholder="1234" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>希望利回り(後で入力でも可)</FormLabel>
              <Input placeholder="3.5" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              登録
            </Button>
            <Button onClick={onClose}>戻る</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
