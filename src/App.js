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
      <Grid container spacing={2} sx={{ padding: 2 }} className="sizing-app">
        <Grid item>
          <InputLabel>Size:</InputLabel>
          <Select name="sizes" onChange={handleSizeChange}>
            {sizes.map((item) => {
              return <MenuItem key={item} value={item}>{item}</MenuItem>;
            })}
          </Select>
        </Grid>
        <Grid item>
          <InputLabel>Cloud:</InputLabel>
          <Select name="cloud" onChange={handleCloudChange}>
            {clouds.map((item) => {
              return <MenuItem key={item} value={item}>{item}</MenuItem>;
            })}
          </Select>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <CloudDataGrid env='Dev' data={devData} key='dev-data' />
        </Grid>
        <Grid item>
          <CloudDataGrid env='QA' data={qaData} key='qa-data' />
        </Grid>
        <Grid item>
          <CloudDataGrid env='Prod' data={prodData} key='prod-data' />
        </Grid>
      </Grid>
    </div>
  );
}


export default App;
