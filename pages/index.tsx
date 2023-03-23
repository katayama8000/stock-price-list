import {
  Box,
  Button,
  Center,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { FaSyncAlt } from 'react-icons/fa';
import Head from 'next/head';
import { useEffect, useState } from 'react';

type Stock = {
  stockPrice: number;
  dividend: number;
};

type CompanyData = {
  name: string;
  dividendYield: number;
  stockPrice: number;
  dividend: number;
  desiredYield: number;
};

const STOCK_CODE = '8591';
const HELLO_CODE = '5023';

const companyData: CompanyData[] = [
  {
    name: 'ABC社',
    dividendYield: 2.5,
    stockPrice: 1000,
    dividend: 25,
    desiredYield: 3.0,
  },
  {
    name: 'XYZ社',
    dividendYield: 1.8,
    stockPrice: 800,
    dividend: 14.4,
    desiredYield: 2.0,
  },
  {
    name: 'DEF社',
    dividendYield: 3.2,
    stockPrice: 1200,
    dividend: 38.4,
    desiredYield: 3.0,
  },
];

export default function Home() {
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [isLoadingStockData, setIsLoadingStockData] = useState<boolean>(false);

  const handleFetchStockData = async () => {
    setIsLoadingStockData(true);
    const res = await fetch(`/api/stock?code=${STOCK_CODE}`);
    const { stockPrice, dividend }: Stock = await res.json();
    setStockData({ stockPrice, dividend });
    setIsLoadingStockData(false);
  };

  const handleFetchHelloData = async () => {
    const res = await fetch(`/api/hello?code=${HELLO_CODE}`);
    const data = await res.json();
    console.log(data);
  };

  const [companyDataState, setCompanyDataState] =
    useState<CompanyData[]>(companyData);

  const handleUpdateData = (index: number) => {
    setCompanyDataState((prevState) => {
      const newData = [...prevState];
      newData[index].dividendYield = Math.round(Math.random() * 5 * 10) / 10;
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
        <Center bgColor={'white'}>
          <VStack spacing="8" w="80%" mt={10}>
            <Heading as="h1" size="lg">
              更新ボタンを設置したテーブル
            </Heading>
            <Button
              leftIcon={<FaSyncAlt />}
              onClick={handleFetchStockData}
              isLoading={isLoadingStockData}
              loadingText="取得中"
            >
              全て更新
            </Button>
            {stockData && (
              <Box>
                <p>株価: {stockData.stockPrice}円</p>
                <p>配当金: {stockData.dividend}円</p>
              </Box>
            )}
            <Table variant="simple">
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>企業名</Th>
                  <Th>配当利回り</Th>
                  <Th>株価</Th>
                  <Th>配当金</Th>
                  <Th>目標利回り</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {companyDataState.map((data, index) => (
                  <Tr
                    key={index}
                    bgColor={
                      data.dividendYield >= data.desiredYield
                        ? 'green.100'
                        : 'red.100'
                    }
                  >
                    <Td>{data.name}</Td>
                    <Td>{data.dividendYield}%</Td>
                    <Td>{data.stockPrice}円</Td>
                    <Td>{data.dividend}円</Td>
                    <Td>{data.desiredYield}%</Td>
                    <Td>
                      <Button onClick={() => handleUpdateData(index)}>
                        株価と配当金を再取得
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button onClick={handleFetchHelloData}>Hello APIを取得</Button>
          </VStack>
        </Center>
      </Box>
    </>
  );
}
