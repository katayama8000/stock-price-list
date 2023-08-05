import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium, Page } from 'playwright-core';

export const runtime = 'edge';

type Response =
  | {
      currentValue: number;
      dividend: number;
      brand: string;
    }
  | {
      error: string;
    };

const { USERNAME, PASSWORD } = process.env;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  console.log(USERNAME, PASSWORD)
  console.time('playwright');
  const { code } = req.query;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://trade.sbineomobile.co.jp/login');
    await login(page);
    await navigateToStockInfo(page, code);
    const brand = await getBrand(page);
    const currentValue = await getCurrentValue(page);
    const dividend = await getDividend(page);

    res.status(200).json({
      currentValue,
      dividend,
      brand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'error' });
  } finally {
    await browser.close();
    console.timeEnd('playwright');
  }
}

const login = async (page: Page) => {
  // if (USERNAME === undefined || PASSWORD === undefined)
  //   throw new Error('環境変数が設定されていません。');
  const USERNAME = "N41-0248339"
  const PASSWORD = "kthmnn19981029"
  await page.type('input[name="username"]', USERNAME);
  await page.type('input[name="password"]', PASSWORD);
  await Promise.all([
    page.click('#neo-login-btn'),
    page.waitForURL('https://trade.sbineomobile.co.jp/home/top'),
  ]);
  console.log('ログイン成功');
};

const navigateToStockInfo = async (
  page: Page,
  code: string | string[] | undefined
): Promise<void> => {
  const url = `https://trade.sbineomobile.co.jp/domestic/stockInfo/brand?securitiesCode=${code}`;
  await Promise.all([page.goto(url), page.waitForURL(url)]);
  console.log('ページ遷移成功');
};

const getBrand = async (page: Page): Promise<string> => {
  const brandSelector = 'h3.name';
  await page.waitForSelector(brandSelector);
  const brand = await page.$eval(
    brandSelector,
    (el) => (el as HTMLElement).innerText
  );
  console.log(`銘柄名は${brand}です。`);
  return brand;
};

const getCurrentValue = async (page: Page): Promise<number> => {
  const currentValue: string = await page.$eval('div.label + span', (el) => {
    return (el as HTMLElement).innerText;
  });
  console.log(`現在の株価は${currentValue}です。`);
  return parseFloat(currentValue.replace(/,/g, ''));
};

const getDividend = async (page: Page): Promise<number> => {
  const waitTime = 3000;
  await page.click('button.showDetail');
  await page.waitForTimeout(waitTime);
  console.log('モーダル表示成功');

  // td._text-rの中の文字列を取得する
  const td = await page.$('td._text-r');
  const text = await td?.textContent();
  if (text === undefined || text === null)
    throw new Error('配当金が取得できませんでした。');
  console.log('現在の配当金は', text, 'です。');

  return Number(text.slice(0, -1));
};
