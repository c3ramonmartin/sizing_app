import { useState, useEffect } from 'react'
import './App.css';
import { generateRows, CloudDataGrid } from './components/DataGrid';


function App() {
  const sizes = ['S','M','L','XL']
  const clouds = ['AWS','GCP','AZURE']

  const [cloud, setCloud] = useState('')
  const [size, setSize] = useState('')

  const [devData, setDevData] = useState([])
  const [qaData, setQaData] = useState([])
  const [prodData, setProdData] = useState([])

  const handleCloudChange = (event) => {
    setCloud(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  useEffect(() => {
    setDevData(generateRows('dev', cloud, size));
    setQaData(generateRows('qa', cloud, size));
    setProdData(generateRows('prod', cloud, size));
}, [cloud, size]);


  return (
    <div className="sizing-app">
      <label>Size:</label> 
      <select name="sizes" onChange = {handleSizeChange}>
        {
          sizes.map((item) => {
            return <option key={item} value={item}>{item}</option>
          })
        }
      </select>
      <label>Cloud:</label> 
      <select name="cloud" onChange={handleCloudChange}>
        {
          clouds.map((item) => {
            return <option key={item} value={item}>{item}</option>
          })
        }
      </select>
      <>
        <CloudDataGrid env='dev' data={devData} key='dev-data'/>
        <CloudDataGrid env='qa' data={qaData} key='qa-data'/>
        <CloudDataGrid env='prod' data={prodData} key='prod-data'/>
      </>
    </div>
  );
}


export default App;
