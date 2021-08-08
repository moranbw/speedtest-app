import React from 'react';
import { useTheme } from '@material-ui/core';
import MaterialTable from '@material-table/core';

export default function OoklaTable(props) {
  let theme = useTheme();

  let columns = [
    { title: "", field: "property" },
    { title: "", field: "value" }
  ];
  let json = JSON.parse(props.json);
  let keys = Object.keys(json);
  let values = Object.values(json);
  let data = [];
  for (let i = 0; i < keys.length; i++) {
    data[i] = { property: keys[i], value: values[i] };
  }

  return (
    <MaterialTable
      data={data}
      columns={columns}
      options={{
        padding: "dense",
        toolbar: false,
        paging: false,
        showTitle: false,
        header: false,
        rowStyle: { fontFamily: theme.typography.fontFamily, ...theme.typography.body2 },
      }}
    />
  );
}
