import { MARKETSTOCKDETAIL, MARKETSTOCKDETAILINTRADAY } from "@/utils/const";
import { stockDetail } from "@/utils/stockList";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");
  const call = searchParams.get("call");

  const stockUrl =
    call == "MARKETSTOCKDETAIL" ? MARKETSTOCKDETAIL : MARKETSTOCKDETAILINTRADAY;
  const url = `${stockUrl}&symbols=${symbols}&date_from=${date_from}&date_to=${date_to}&limit=1000`;
  const res = await fetch(`${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json({ data });
  // return Response.json({ data: stockDetail });
}
