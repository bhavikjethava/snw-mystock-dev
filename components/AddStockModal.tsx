"use client";
import { MARKETSTOCKSEARCH, STOCKSTABLE, USERSTABLE } from "@/utils/const";
import React, { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FormData, StocksProps } from "../utils/types";
import { getSupabase } from "../utils/supabase";
import { stockList } from "../utils/stockList";
import AppModal from "./AppModal";
import { MAXSTOCKLIMIT } from "../utils/const";

interface AddStockModalProps {
  user?: any;
  userStocks: StocksProps[];
  callBack?: () => void;
}

const AddStockModal: FC<AddStockModalProps> = ({
  user,
  userStocks,
  callBack,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState<FormData[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [error, setErrors] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onAddStock = () => {
    setShowModal(true);
    setErrors({ symbol: "" });
  };

  const fetchSymbols = async (search: string) => {
    setErrors({ symbol: "" });
    try {
      //   const response: any = await fetch(
      //     `${MARKETSTOCKSEARCH}&search=${search}`
      //   );

      const response = { data: stockList };
      const data = response.data.data.map((item: any) => ({
        value: item.symbol,
        label: `${item.name} (${item.symbol})`,
        isDisabled: userStocks.some((d) => d.symbol === item.symbol),
        ...item,
      }));

      setOptions(data);
    } catch (error) {
      console.error("Error fetching stock symbols:", error);
    }
  };

  const handleInputChange = (inputValue: string) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }
    if (inputValue.length > 2) fetchSymbols(inputValue);
  };

  const addStock = async () => {
    if (selectedOption) {
      setLoading(true);
      const supabase = getSupabase();
      const { error, data } = await supabase.from(STOCKSTABLE).insert({
        symbol: selectedOption.symbol,
        name: selectedOption.name,
        user_id: user?.id,
      });
      if (error?.message) {
        setErrors({ symbol: error?.message });
      } else {
        setSelectedOption(null);
        setShowModal(false);
        callBack?.();
        router.refresh();
      }
      setLoading(false);
    } else {
      setErrors({ symbol: "Please select stock" });
    }
  };

  return (
    <div className="flex mt-5">
      {userStocks?.length < MAXSTOCKLIMIT ? (
        <Button onClick={onAddStock}>Add Stock</Button>
      ) : null}
      {showModal ? (
        <AppModal title="Search stock" onClose={() => setShowModal(false)}>
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Search
              </label>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "grey" : "red",
                  }),
                  option: (
                    styles,
                    { data, isDisabled, isFocused, isSelected }
                  ) => {
                    return {
                      ...styles,
                      color: "black",
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? "not-allowed" : "default",
                    };
                  },
                }}
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                onInputChange={handleInputChange}
                placeholder="Search for a stock symbol..."
              />
              {error?.symbol ? (
                <span className="text-red-600">{error.symbol}</span>
              ) : null}
            </div>
            <Button
              type="button"
              onClick={addStock}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div role="status" className="px-3">
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : null}
              Save
            </Button>
          </form>
        </AppModal>
      ) : null}
    </div>
  );
};

export default AddStockModal;
