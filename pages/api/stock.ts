// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

type Response =
  | {
      stockPrice: number;
      dividend: number;
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  console.log(process.env.NEXT_PUBLIC_USERNAME);
  console.log(process.env.NEXT_PUBLIC_PASSWORD);

  // const code = 8591;
  const { code } = req.query;
  const { NEXT_PUBLIC_USERNAME, NEXT_PUBLIC_PASSWORD } = process.env;
  if (!code) {
    return res.status(400).json({ error: 'Code parameter is missing' });
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto('https://trade.sbineomobile.co.jp/login');

    // ログインフォームを入力する
    await page.type('input[name="username"]', NEXT_PUBLIC_USERNAME!);
    await page.type('input[name="password"]', NEXT_PUBLIC_PASSWORD!);

    // ログインボタンをクリックする
    await Promise.all([
      page.click('#neo-login-btn'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log('ログイン成功');

    // 指定のページに移動する
    const url = `https://trade.sbineomobile.co.jp/domestic/stockInfo/brand?securitiesCode=${code}`;
    await Promise.all([
      page.goto(url),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log(`ページ遷移成功`);

    // 現在の株価を取得する
    const currentValue = await page.$eval(
      'div.label + span',
      (el) => el.innerText
    );
    console.log(`現在の株価は${currentValue}です。`);

    //ボタンをクリックしてからモーダルが表示されるまでの動作をシミュレートする
    await page.evaluate(() => {
      const button = document.querySelector(
        'button.showDetail'
      ) as HTMLButtonElement;
      button.click();
      return new Promise((resolve) => setTimeout(resolve, 3000));
    });
    console.log('モーダル表示成功');

    // td._text-rの中の文字列を取得する
    const text = (await page.evaluate(() => {
      const td = document.querySelector('td._text-r');
      return td?.textContent;
    })) as string;
    console.log('現在の配当金は', text, 'です。');

    return res.status(200).json({
      stockPrice: parseFloat(currentValue.replace(/,/g, '')),
      dividend: Number(text.slice(0, -1)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'error' });
  } finally {
    await browser.close();
  }
}
