import React, { FC } from "react";
import AddStockModal from "./AddStockModal";
import { getSupabase } from "@/utils/supabase";
import { MARKETSTOCKVOLUME, STOCKSTABLE, USERSTABLE } from "@/utils/const";
import { StocksProps, UserProps } from "@/utils/types";
import StockTable from "./StockTable";

interface StocksProps_ {
  user?: any;
}

const fetchStockVolume = async (data: StocksProps[]) => {
  try {
    const symbols = data.map((_stock: StocksProps) => _stock?.symbol!);
    if (symbols.length > 0) {
      const url = `${MARKETSTOCKVOLUME}&symbols=${symbols.toString()}`;
      const response1: any = await fetch(`${url}`);
      const responseJson = await response1.json();
      const response = { data: responseJson };
      // const response = { data: STOCKVOLUMN };
      const newData = data.map((item) => {
        const matchingObject = response?.data?.data?.find(
          (obj: any) => obj.symbol === item.symbol
        );
        return {
          ...item,
          ...matchingObject,
        };
      });
      return newData;
    }
    return [];
  } catch (error) {
    console.error("Error fetching stock symbols:", error);
    return [];
  }
};

const fetchStockList = async (user: UserProps) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(STOCKSTABLE)
    .select()
    .eq("user_id", user?.id);
  return fetchStockVolume(data as StocksProps[]) || [];
  // return data || [];
};

const Stocks: FC<StocksProps_> = async ({ user }) => {
  const stockList: StocksProps[] = await fetchStockList(user);
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
