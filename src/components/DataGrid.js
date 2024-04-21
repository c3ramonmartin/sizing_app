import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const sizeCountsData = require('../cloud_billing/size_counts.json')
const defaultInstancesData = require('../cloud_billing/default_instances.json')
const instances = [
  {'cloud':'AWS', 'data': require(`../cloud_billing/AWS_instances.json`)},
  {'cloud':'GCP', 'data': require(`../cloud_billing/GCP_instances.json`)},
  {'cloud':'AZURE', 'data': require(`../cloud_billing/AZURE_instances.json`)}

]
function generateRows(env, cloud, size) {
  
  // Make a copy of the data to avoid mutation
  let sizeCounts = [...sizeCountsData];
  let defaultInstances = [...defaultInstancesData];
  let data = instances.find((item) => item.cloud === cloud).data

  // // update sizeCounts to find the one for the env
  sizeCounts = sizeCounts.find((item) => item.size === size && item.env === env).sizes

  defaultInstances = defaultInstances.find((item) => item.cloud === cloud).purpose

  const on_percent = env === "prod" ? 100 : 50;

  let rows = []
  for (let i=0; i<defaultInstances.length; i++) {
    let item = defaultInstances[i]
    item.id = item.name + '_' + env
    item.instance_count = sizeCounts[item.name]
    let specs = data.find((instance) => instance.instance_name === item.instance_name)
    item.vcpus = specs.vCPU
    item.ram = specs.RAM
    item.hourly_rate = specs.hourly_rate
    
    item.on = on_percent
    rows.push(item)
  } 
  return rows
}

export function CloudDataGrid(cloud, size, env) {
  
  const rows = generateRows(env, cloud, size)
  console.log(rows)

  let columns = [
    { field: "name", headerName: "Purpose" },
    { field: "instance_name", headerName: 'Instance Name'},
    { field: "vcpus", headerName: 'vcpus'},
    { field: "instance_count", headerName: 'Instance Count'},
    {
      field: "total_vcpus",
      headerName: 'Total vCPU Count',
      valueGetter: (value, row) => `${row.instance_count*row.vcpus}`,
    },
    { field: "ram", headerName: 'RAM'},
    { field: "on", headerName: 'On'},
    {
      field: "monthlyCost",
      headerName: 'Monthly Cost',
      valueGetter: (value, row) => `${24*30*row.hourly_rate}`,
    }
  ]
  
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <b>Environment: </b> {env}
      <DataGrid
        key={env}
        className={`${env}-data-grid`}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}