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
import { FC, useState } from 'react';

type TStock = {
  stockPrice: number;
  dividend: number;
};

type TCompanyData = {
  companyName: string;
  divYield: number; // 利回り
  desiredYield: number; // 希望配当金
  stockCode: string; // 株コード
} & TStock;

const STOCK_CODE = '8591';
const HELLO_CODE = '5023';

const dummy: TCompanyData[] = [
  {
    companyName: '東京海上日動火災保険',
    stockPrice: 10000,
    dividend: 500,
    divYield: 0, // 配当金/株価
    desiredYield: 2,
    stockCode: '8591',
  },
  {
    companyName: '三菱ＵＦＪフィナンシャル',
    stockPrice: 10000,
    dividend: 100,
    divYield: 0, // 配当金/株価
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
      newData[index].divYield = Math.round(Math.random() * 5 * 10) / 10;
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
        <Button>登録</Button>
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
            現在の株価 : {stockPrice}円 | 希望株価 :
            {(stockPrice * divYield) / desiredYield}円
          </Text>
          <Text pt="2" fontSize="sm">
            利回り : {divYield}% | 希望利回り : {desiredYield}%
          </Text>
          <Text pt="2" fontSize="sm">
            配当金 : {dividend}円
          </Text>
          <Button
            onClick={onUpdateData}
            colorScheme={divYield >= desiredYield ? 'green' : 'red'}
            variant="outline"
          >
            更新
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
