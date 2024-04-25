import React, { FC } from "react";
import AddStockModal from "./AddStockModal";
import { getSupabase } from "@/utils/supabase";
import { MARKETSTOCKVOLUME, STOCKSTABLE, USERSTABLE } from "@/utils/const";
import { StocksProps } from "@/utils/types";
import { STOCKVOLUMN } from "@/utils/stockList";
import { IconDelete } from "./Icons";
import { Button } from "./ui/button";
import StockItem from "./StockTable";
import StockTable from "./StockTable";

interface StocksProps_ {
  user?: any;
}

const fetchStockVolume = async (data: StocksProps[]) => {
  try {
    const symbols = data.map((_stock: StocksProps) => _stock?.symbol!);
    const url = `${MARKETSTOCKVOLUME}&symbols=${symbols.toString()}`;
    const response1: any = await fetch(`${url}`);
    const responseJson = await response1.json();
    const response = { data: responseJson };
    // const response = { data: STOCKVOLUMN };
    const newData = data.map((item) => {
      const matchingObject = response.data.data.find(
        (obj: any) => obj.symbol === item.symbol
      );
      return {
        ...item,
        ...matchingObject,
      };
    });
    return newData;
  } catch (error) {
    console.error("Error fetching stock symbols:", error);
    return [];
  }
};

const fetchStockList = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(STOCKSTABLE)
    .select()
    .eq("user_id", 1);
  return fetchStockVolume(data as StocksProps[]) || [];
  // return data || [];
};

const Stocks: FC<StocksProps_> = async ({ user }) => {
  const stockList: StocksProps[] = await fetchStockList();
  // console.log("===>stockList", stockList);

  return (
    <div className="px-14">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <StockTable stockList={stockList} />
      </div>
      <AddStockModal user={user} userStocks={stockList} />
    </div>
  );
};

export default Stocks;
