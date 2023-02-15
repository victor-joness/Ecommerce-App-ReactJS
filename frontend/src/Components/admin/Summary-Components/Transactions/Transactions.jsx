import "./Transactions.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { setHeaders, url } from "../../../../features/api";
import moment from "moment";

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${url}/orders/?new=true`, setHeaders());
        setOrders(res.data);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="transactions">
      {isLoading ? (
        <p>Carregando transações</p>
      ) : (
        <>
          <h3>Ultimas Transações</h3>
          <div className="table-name">
            <p>Nome</p>
            <p>Valor</p>
            <p>a quanto tempo</p>
          </div>
          {orders?.map((transacao, index) => (
            <div key={index} className="transaction">
              <p>{transacao.shipping.name}</p>
              <p style={{lineHeight: "40px"}}>{"$" + (transacao.total / 100).toLocaleString()}</p>
              <p style={{lineHeight: "40px"}}>{moment(transacao.createdAt).fromNow()}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Transactions;
