import "./Widget.css";

const Widget = ({ data }) => {
  return (
    <div className="widget">
      <div
        className="icon"
        style={{ background: `${data.bgColor}`, color: `${data.color}` }}
      >
        {data.icon}
      </div>

      <div className="text">
        <h3>
          {data.isMoney
            ? "$" + data.digits?.toLocaleString()
            : data.digits?.toLocaleString()}
        </h3>
        <p>{data.title}</p>
      </div>

      {data.percentage < 0 
      ? 
      <div className="percentagem" style={{color: "red"}}>
        {Math.floor(data.percentage) + "%"}
      </div> 
      : 
      <div className="percentagem"style={{color: "green"}}>
        {"+" + Math.floor(data.percentage) + "%"}
      </div>
      }
    </div>
  );
};

export default Widget;
