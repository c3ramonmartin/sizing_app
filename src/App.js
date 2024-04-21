import { useState } from 'react'
import './App.css';
import { CloudDataGrid } from './components/DataGrid';


function App() {

  const envs = ['dev','qa','prod']
  const sizes = ['S','M','L','XL']
  const clouds = ['AWS','GCP','AZURE']

  const [cloud, setCloud] = useState('')
  const [size, setSize] = useState('')

  const handleCloudChange = (event) => {
    setCloud(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

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
      { (cloud !== '' & size !== '') && (
        <>
          {envs.map((item) => {
            return CloudDataGrid(cloud, size, item)
          })}
        </>
      )}
    </div>
  );
}


export default App;
