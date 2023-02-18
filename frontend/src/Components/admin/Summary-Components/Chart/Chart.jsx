import "./Chart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { url, setHeaders } from "../../../../features/api";
import axios from "axios";

const Chart = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }

    if (a._id > b._id) {
      return -1;
    }

    return 0;
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${url}/orders/week-sales`, setHeaders());

        res.data.sort(compare);
        const newData = res.data.map((item) => {
          const Days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

          return {
            day: Days[item._id - 1],
            Montante: item?.totals / 100,
          };
        });

        setSales(newData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //tem um exemplo mt bom no proprio site do recharts
  /* const data = [
    {
      day: "Seg",
      Montante: 4000,
    },
    {
      day: "Ter",
      Montante: 3000,
    },
  ]; */

  return (
    <>
      {loading ? (
        <div className="loader">Loading Chart...</div>
      ) : (
        <div className="chart">
          <h3>Ganhos dos ultimos 7 dias (US $)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={sales}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Montante"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default Chart;
