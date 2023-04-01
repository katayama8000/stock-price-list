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

export type { TStock, TCompany, TStockCard };
