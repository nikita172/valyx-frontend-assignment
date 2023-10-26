import { useEffect, useState } from 'react'
import './App.css'
import Home from './components/home/Home'
import Papa from "papaparse";

function App() {
  const [bank, setBank] = useState('axis');
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    const load = function () {
      fetch(`./data/${bank}.csv`)
        .then(response => response.text())
        .then(responseText => {
          Papa.parse(responseText, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              const rowsArray = [];
              const valuesArray = [];

              // Iterating data to get column name and their values separately
              results.data.map((d) => {
                rowsArray.push(Object.keys(d));
                valuesArray.push(Object.values(d));
              });

              // Filtered Column Names
              setTableRows(rowsArray[0]);

              // Filtered Values
              const filteredArray = [];
              if (searchData !== "") {
                valuesArray.map((item, index) => {
                  let isBroken = false;
                  item.map((val => {
                    if (isBroken) return;
                    if (val.toLowerCase().startsWith(searchData.toLowerCase())) {
                      filteredArray.push(item);
                      isBroken = true;
                      return;
                    }
                  }))
                })
              }
              if (searchData == "") {
                setValues(valuesArray)
              } else {
                setValues(filteredArray)
              }
            },
          });
        })
    };
    load();
  }, [bank, searchData])
  console.log(values.length)
  return (
    <div>
      <div className="header">
        <div className={bank == "axis" ? "bankSelected" : "bankName"} onClick={() => setBank("axis")} >axis</div>
        <div className={bank == "hdfc" ? "bankSelected" : "bankName"} onClick={() => setBank("hdfc")} >hdfc</div>
        <div className={bank == "icici" ? "bankSelected" : "bankName"} onClick={() => setBank("icici")} >icici</div>
      </div>
      <div className='searchInput'>
        <input className='filterInput' placeholder='Filter'
          onChange={(e) => setSearchData(e.target.value)} />
      </div>

      <Home values={values} tableRows={tableRows} />

    </div>
  )
}

export default App
