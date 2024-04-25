import { MARKETSTOCKDETAIL, MARKETSTOCKSEARCH } from "@/utils/const";
import { stockDetail, stockList } from "@/utils/stockList";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const res = await fetch(`${MARKETSTOCKSEARCH}&search=${search}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json({ data });
  // return Response.json({ data: stockList });
}
