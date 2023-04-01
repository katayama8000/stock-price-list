import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { type FC, useState, useEffect, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAtomValue, useSetAtom } from 'jotai';
import { fetchStockAllAtom, getStockAtom } from '@/state/stock.state';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
// components
import { RegisterModal } from '@/component/RegisterModal';
import { EditModal } from '@/component/EditModal';
import { DeleteModal } from '@/component/DeleteModal';
// type
import type { TStock, TStockCard } from '@/type/stock.model';
import { formatJT } from '@/constant/format.const';

export default function Home() {
  const stocks = useAtomValue(getStockAtom);
  const fetchStockAll = useSetAtom(fetchStockAllAtom);

  // const handleFetchStock = async () => {
  //   const STOCK_CODE = '8591';
  //   setIsLoadingStock(true);
  //   const res = await fetch(`/api/stock?code=${STOCK_CODE}`);
  //   const { stockPrice, dividend }: TStock = await res.json();
  //   setStock({ stockPrice, dividend });
  //   setIsLoadingStock(false);
  // };

  useEffect(() => {
    (async () => {
      await fetchStockAll();
    })();
  }, []);

  return (
    <>
      <Head>
        <title>stock</title>
        <meta name="description" content="stock" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH="100vh">
        <Center m={1}>
          <RegisterModal />
        </Center>
        {stocks !== undefined ? (
          stocks.map((stock) => (
            <StockCard
              key={stock.stockCode}
              brand={stock.brand}
              stockPrice={stock.stockPrice}
              dividend={stock.dividend}
              desiredYield={stock.desiredYield}
              stockCode={stock.stockCode}
              update={stock.update}
            />
          ))
        ) : (
          <Text>データがありません</Text>
        )}
      </Box>
    </>
  );
}

type TStockCardProps = TStockCard;

export const StockCard: FC<TStockCardProps> = ({
  brand,
  stockPrice,
  dividend,
  desiredYield,
  stockCode,
  update,
}) => {
  const fetchStockAll = useSetAtom(fetchStockAllAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const dividendYield = useMemo(() => {
    return Math.round((dividend / stockPrice) * 100 * 10) / 10;
  }, [dividend, stockPrice]);

  const desiredPrice = useMemo(() => {
    if (desiredYield === 0) {
      return '---';
    }
    const price =
      Math.round(((stockPrice * dividendYield) / desiredYield) * 10) / 10;
    return `${price}円`;
  }, [desiredYield, dividendYield, stockPrice]);

  const yieldColor = dividendYield >= desiredYield ? 'green.100' : 'red.100';

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/stock?code=${stockCode}`);
      const { stockPrice, dividend }: TStock = await res.json();
      await updateDoc(doc(db, 'stocks', stockCode), {
        stockPrice,
        dividend,
        update: dayjs().locale('ja').format(formatJT),
      });
      await fetchStockAll();
      toast({
        title: '更新しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: '更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center>
      <Box bgColor={yieldColor} rounded="md" shadow="md" width="80" p="4" m="2">
        <Heading size="md">{brand}</Heading>
        <Stack divider={<StackDivider />} spacing="2" pt="2">
          <Text pt="2" fontSize="sm">
            現在の株価 : {stockPrice}円 | 希望株価 : {desiredPrice}
          </Text>
          <Text pt="2" fontSize="sm">
            利回り : {dividendYield}% | 希望利回り : {desiredYield}%
          </Text>
          <Text pt="2" fontSize="sm">
            配当金 : {dividend}円
          </Text>
          <Text pt="2" fontSize="sm">
            最終更新時間 : {update}
          </Text>
          <Flex pt="2">
            <Button
              colorScheme={dividendYield >= desiredYield ? 'green' : 'red'}
              variant="outline"
              loadingText="更新中"
              isLoading={isLoading}
              w="100%"
              mx={1}
              onClick={handleUpdate}
            >
              更新
            </Button>
            <EditModal desiredYield={desiredYield} stockCode={stockCode} />
            <DeleteModal stockCode={stockCode} />
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
};
