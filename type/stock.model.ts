type TStock = {
  currentValue: number;
  dividend: number;
  brand: string;
};

type TCompany = {
  brand: string;
  desiredYield: number; // 希望配当金
  stockCode: string; // 株コード
  update: string; // 更新日
};

type TStockCard = TStock & TCompany;

export type { TStock, TCompany, TStockCard };
