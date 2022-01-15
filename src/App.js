import React, { useState, useEffect } from "react";
import { categoriesData } from "./dummyData";

function Categories({ SearchCategory }) {
  return (
    <ul className="categories">
      {categoriesData.map((category) => (
        <li
          key={category}
          className="categories-item"
          onClick={() => SearchCategory(category)}
        >
          <span>{category}</span>
        </li>
      ))}
    </ul>
  );
}

function Result({ category, results }) {
  return (
    <div className="result">
      <h4>查詢結果：</h4>
      <h4>類別：{category}</h4>
      <h4>地點：台大校園</h4>
      {results.length > 0 ? (
        <table bgcolor="#c0c0c0" width="100%" border="0">
          <thead>
            <tr>
              <th width="20%">拾得日期</th>
              <th width="20%">遺失物名稱</th>
              <th width="20%">拾得地點</th>
              <th width="20%">編號</th>
              <th width="20%">物品保管地</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.date}</td>
                <td>{result.name}</td>
                <td>{result.location}</td>
                <td>{result.id}</td>
                <td>{result.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>找不到資料</p>
      )}
    </div>
  );
}

function App() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filterResults, setFilterResults] = useState([]);
  const getData = async () => {
    setLoading(true);
    try {
      await fetch("result.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTimeout(() => {
            // 1秒後才會看到LOG,模擬撈後端資料延遲
            console.log("data", data);
            setResults(data.resultData);
            setLoading(false);
          }, 1000);
        });
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const handleData = async () => {
    await getData();
    const filterData = results.filter((res) => {
      if (res.name === category) return res;
    });
    setFilterResults(filterData);
  };

  useEffect(() => {
    if (category.length > 0) {
      handleData();
    }
  }, [category]);
  return (
    <div className="container">
      <div>
        <fieldset>
          <legend>依「關鍵字」查詢</legend>
          <form>
            <label>請輸入「關鍵字」：</label>
            <input type="text" tabIndex="0" />
            <button className="search">確定</button>
          </form>
        </fieldset>

        <fieldset>
          <legend>依「類別」查詢</legend>
          <form>
            <label>請輸入「關鍵字」：</label>
          </form>
          <Categories SearchCategory={setCategory} />
        </fieldset>
      </div>
      {loading ? (
        <p>系統查詢中，請稍後...</p>
      ) : (
        category.length > 0 && (
          <Result category={category} results={filterResults} />
        )
      )}
    </div>
  );
}

export default App;
