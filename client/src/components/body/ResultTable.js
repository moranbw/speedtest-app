import React from 'react';
import MaterialTable from "material-table";


export default function ResultTable(props) {

  let columnNames = [
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
      columns={columnNames}
      options={{
        padding: "dense",
        toolbar: false,
        paging: false,
        showTitle: false,
        header: false
      }}
    />
  );
}
