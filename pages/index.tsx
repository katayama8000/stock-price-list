import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useState } from 'react';

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
        {/* <Center bgColor={'white'}> */}
        {companyData.map((data, index) => (
          <StockCard
            key={data.name}
            data={data}
            onUpdateData={() => handleUpdateData(index)}
          />
        ))}
        {/* </Center> */}
      </Box>
    </>
  );
}

type CardProps = {
  data: CompanyData;
  onUpdateData: () => void;
};

export const StockCard = ({ data, onUpdateData }: CardProps) => {
  const { name, dividendYield, stockPrice, dividend, desiredYield } = data;

  return (
    <Center>
      <Box
        bgColor={
          data.dividendYield >= data.desiredYield ? 'green.100' : 'red.100'
        }
        rounded="md"
        shadow="md"
        width="80"
        p="4"
        m="2"
      >
        <Heading size="md">{name}</Heading>
        <Stack divider={<StackDivider />} spacing="2" pt="2">
          <Text pt="2" fontSize="sm">
            Dividend Yield : {dividendYield}%
          </Text>
          <Text pt="2" fontSize="sm">
            Stock Price : {stockPrice}円
          </Text>

          <Text pt="2" fontSize="sm">
            Dividend : {dividend}円
          </Text>
          <Text pt="2" fontSize="sm">
            Desired Yield : {desiredYield}%
          </Text>
          <Button onClick={onUpdateData}>Update Data</Button>
        </Stack>
      </Box>
    </Center>
  );
};
