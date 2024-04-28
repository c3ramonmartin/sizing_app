import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import deepClone from 'lodash/cloneDeep';

const sizeCountsData = require('../cloud_billing/size_counts.json')
const defaultInstancesData = require('../cloud_billing/default_instances.json')
const instances = [
  {'cloud':'AWS', 'data': require(`../cloud_billing/AWS_instances.json`)},
  {'cloud':'GCP', 'data': require(`../cloud_billing/GCP_instances.json`)},
  {'cloud':'AZURE', 'data': require(`../cloud_billing/AZURE_instances.json`)}
]

export function generateRows(env, cloud, size) {
    if (env === '' || cloud === '') {
        return [];
    }

    // Deep clone the data to avoid mutation issues
    const sizeCounts = deepClone(sizeCountsData);
    const defaultInstances = deepClone(defaultInstancesData);
    const data = deepClone(instances.find((item) => item.cloud === cloud).data);

    // Find the appropriate size count and default instances for given parameters
    const currentSizeCount = sizeCounts.find((item) => item.size === size && item.env === env);
    const currentDefaultInstances = defaultInstances.find((item) => item.cloud === cloud);

    if (!currentSizeCount || !currentDefaultInstances) {
        // Handling cases where no matching data found
        return [];
    }

    const on_percent = env === "prod" ? 100 : 50;

    let rows = [];
    for (let item of currentDefaultInstances.purpose) {
        const specs = data.find((instance) => instance.instance_name === item.instance_name);
        if (!specs) continue;  // Skip if no specs found

        // Create a new object for grid row to avoid mutations affecting other rows
        const row = {
            ...item,
            id: item.name + '_' + env,
            instance_count: currentSizeCount.sizes[item.name],
            vcpus: specs.vCPU,
            ram: specs.RAM,
            hourly_rate: specs.hourly_rate,
            on: on_percent
        };

        rows.push(row);
    } 
    return rows;
}

export function CloudDataGrid(props) {
  const env = props.env
  const data = props.data
  const setData = props.setData
  const subtotal = props.subtotal
  const setSubtotal = props.setSubtotal



  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    const total = data.reduce((acc, row) => acc + (24 * (365/12) * row.instance_count * row.hourly_rate * row.on / 100), 0);
    setSubtotal(total)
  }, [data] )

  const handleCellEdit = (newRow) => {
    const updatedData = data.map((row) => {
      if (row.id === newRow.id) {
        return newRow;
      }
      return row;
    });
    setData(updatedData);
    return newRow;
  };


  let columns = [
    { field: "name", headerName: "Purpose" },
    { field: "instance_name", headerName: 'Instance Name'},
    { field: "vcpus", headerName: 'vCPUs'},
    { field: "ram", headerName: 'RAM'},
    { field: "instance_count", headerName: 'Instance Count', editable:true},
    {
      field: "total_vcpus",
      headerName: 'Total vCPU Count',
      valueGetter: (value, row) => `${row.instance_count*row.vcpus}`,
    },
    { field: "hrly_cost", headerName: "hrly cost", valueGetter:( value, row) => row.hourly_rate},
    {
      field: "total_ram",
      headerName: 'Total RAM Size',
      valueGetter: (value, row) => `${row.instance_count*row.ram}`,
    },
    { field: "on", headerName: 'On', editable:true, 
      valueFormatter: (value) => `${value}%`
    },
    {
      field: "monthlyCost",
      headerName: 'Monthly Cost',
      valueGetter: (value, row) => `${(24*(365/12)*row.instance_count*row.hourly_rate*(row.on/100)).toFixed(2)}`,
      valueFormatter: (value) => `$${value}`
    }
  ]
  
  return (
    (data.length === 0)?
    <></>
    :
    <Box sx={{ height: '100%', width: '100%' }}>
      <b>Environment: </b> {env}
      <DataGrid
        key={`${env}-data-grid`}
        className={`${env}-data-grid`}
        rows={data}
        columns={columns}
        pagination={false}
        processRowUpdate={handleCellEdit}
        checkboxSelection={false}
        disableRowSelectionOnClick
        hideFooter={true}
      />
      <b>Subtotal: </b> {`$${subtotal.toFixed(2)}`}
    </Box>
  );
}