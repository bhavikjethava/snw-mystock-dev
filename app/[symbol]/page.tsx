"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import { stockDetail } from "../../utils/stockList";
import { useParams } from "next/navigation";
import {
  MARKETSTOCKDETAIL,
  STOCKFILTER,
  fetchCurrentUser,
} from "@/utils/const";
import { Button } from "@/components/ui/button";
import withAuth from "@/components/WithAuth";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserProps } from "@/utils/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const dateRanges: any = {
  today: new Date().toISOString().split("T")[0],
  _1D: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  _5D: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  _1M: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  _6M: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  _1Y: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  _5Y: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
};

const StockDetail = () => {
  const [selectedFiletr, setFilter] = useState(STOCKFILTER[0]);
  const [chartData, setChartData] = useState<ChartData<any>>({ datasets: [] });
  const { symbol } = useParams<{ symbol: string }>();
  const is1D = selectedFiletr == STOCKFILTER[0];

  useEffect(() => {
    fetchStockDetail();
  }, [selectedFiletr]);

  const renderChart = (_stockDetail: any) => {
    const stockDetailData = _stockDetail?.data?.reverse();
    const labels = stockDetailData?.map((x: any) =>
      is1D ? x.date.split("T")[1].substring(0, 8) : x.date.split("T")[0]
    );
    const data = {
      labels,
      datasets: [
        {
          label: "",
          fill: true,
          data: is1D
            ? stockDetailData?.map((x: any) => x.last)
            : stockDetailData?.map((x: any) => x.close),
          borderColor: "rgb(255, 255, 255)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    setChartData(data);
  };

  const onFilterSelected = (stockFilter: string) => {
    setFilter(stockFilter);
  };

  const fetchStockDetail = async () => {
    const isMax = selectedFiletr == STOCKFILTER[STOCKFILTER.length - 1];

    const fromDate = isMax ? "" : dateRanges?.["_" + selectedFiletr];
    const toDate = isMax ? "" : dateRanges.today;
    // const url = `${MARKETSTOCKDETAIL}&symbols=${symbol}&date_from=${fromDate}&date_to=${toDate}`;
    const response: any = await fetch(
      `/api/stock-detail?symbols=${symbol}&date_from=${fromDate}&date_to=${toDate}&call=${
        is1D ? "MARKETSTOCKDETAILINTRADAY" : "MARKETSTOCKDETAIL"
      }`
    );
    const jsonResponse = await response.json();
    renderChart(jsonResponse.data);
  };

  const options: ChartOptions<any> = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    // elements: {
    //   point: {
    //     radius: 0,
    //   },
    // },
    plugins: {
      legend: {
        // position: "top" as const,
        display: false,
      },
      title: {
        display: true,
        text: symbol,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div>
      <div className="space-x-2 px-20 pt-6">
        {STOCKFILTER.map((stockFilter) => (
          <Button
            size={"xsm"}
            key={stockFilter}
            variant={`${
              selectedFiletr == stockFilter ? "destructive" : "default"
            }`}
            onClick={() => onFilterSelected(stockFilter)}
          >
            {stockFilter}
          </Button>
        ))}
      </div>
      <div className="flex max-w-[70%] mx-auto pt-6">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

StockDetail.getInitialProps = withAuth(async (ctx: any) => {
  const session = await getSession(ctx.req, ctx.res);
  if (session?.isLoading) return { user: null };
  if (session?.error) return { user: null };

  const user: UserProps = await fetchCurrentUser(session);
  return { user };
});

export default StockDetail;
