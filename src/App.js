import { useState, useEffect } from 'react'
import './App.css';
import { generateRows, CloudDataGrid } from './components/DataGrid';
import { FormControl, InputLabel, Select, Typography, Grid, MenuItem } from '@mui/material';

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
    <div>
      <Grid container spacing={2} sx={{ padding: 2}} className="sizing-app">
        <Grid item>
          <InputLabel>Size:</InputLabel>  
          <Select name="sizes" onChange = {handleSizeChange}>
            {
              sizes.map((item) => {
                return <MenuItem key={item} value={item}>{item}</MenuItem>
              })
            }
          </Select>
        </Grid>
        <Grid item>
          <InputLabel>Cloud:</InputLabel> 
          <Select name="cloud" onChange={handleCloudChange}>
            {
              clouds.map((item) => {
                return <MenuItem key={item} value={item}>{item}</MenuItem>
              })
            }
          </Select>
        </Grid>
        
      </Grid>
      <>
        <CloudDataGrid env='dev' data={devData} key='dev-data'/>
        <CloudDataGrid env='qa' data={qaData} key='qa-data'/>
        <CloudDataGrid env='prod' data={prodData} key='prod-data'/>
      </>
    </div>
  );
}


export default App;
