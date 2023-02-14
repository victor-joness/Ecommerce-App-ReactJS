import { useState, useEffect } from "react";
import Widget from "../Summary-Components/Widget/Widget";
import "./Summary.css";
import { FaUsers, FaChartBar, FaClipboard } from "react-icons/fa";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";
import Chart from "../Summary-Components/Chart/Chart";
import Transactions from "../Summary-Components/Transactions/Transactions";
import AllTimeData from "../Summary-Components/AllTimeData/AllTimeData";

const Summary = () => {
  const [users, setUsers] = useState([]);
  const [usersPerc, setUsersPerc] = useState(0);

  const [orders, setOrders] = useState([]);
  const [ordersPerc, setOrdersPerc] = useState(0);

  const [income, setincome] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }

    if (a._id > b._id) {
      return -1;
    }

    return 0;
  }

  //requisição users
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders());

        res.data.sort(compare);
        setUsers(res.data);
        setUsersPerc(
          ((res.data[0].totals - res.data[1].totals) / res.data[1].totals) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);


  //requisição orders
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders());

        res.data.sort(compare);
        setOrders(res.data);
        setOrdersPerc(
          ((res.data[0].totals - res.data[1].totals) / res.data[1].totals) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  //requisição income
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/income/stats`, setHeaders());

        res.data.sort(compare);
        setincome(res.data);
        setIncomePerc(
          ((res.data[0].totals - res.data[1].totals) / res.data[1].totals) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);



  const data = [
    {
      icon: <FaUsers />,
      digits: users[0]?.totals,
      isMoney: false,
      title: "users",
      color: "rgb(102,108,255)",
      bgColor: "rgba(102,108,255, 0.12)",
      percentage: usersPerc,
    },
    {
      icon: <FaClipboard />,
      digits: orders[0]?.totals,
      isMoney: false,
      title: "Orders",
      color: "rgb(38,198,249)",
      bgColor: "rgba(38,198,249, 0.12)",
      percentage: ordersPerc,
    },
    {
      icon: <FaChartBar />,
      digits: income[0]?.totals ? income[0]?.totals / 100 : "",
      isMoney: false,
      title: "Earnings",
      color: "rgb(253,181,40)",
      bgColor: "rgba(253,181,40, 0.12)",
      percentage: incomePerc,
    },
  ];

  return (
    <div className="summary">
      <div className="mainStats">
        <div className="overView">
          <div className="title">
            <h2>Overview</h2>
            <p>Comparação de perfomace do seu shopping com o mes anterior</p>
          </div>
          <div className="widgetWrapper">
            {data?.map((data, index) => (
              <Widget key={index} data={data} />
            ))}
          </div>
        </div>

        <Chart></Chart>
      </div>

      <div className="sideStats">
        <Transactions/>
        <AllTimeData/>
      </div>
    </div>
  );
};

export default Summary;
