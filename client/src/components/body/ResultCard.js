import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent
} from '@material-ui/core';
import MaterialTable from "material-table";


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    padding: 5
  },
}));


export default function ResultCard(props) {
  const classes = useStyles();

  let columnNames = [
    { title: "a", field: "property" },
    { title: "a", field: "value" }
  ];
  let json = JSON.parse(props.json);
  let keys = Object.keys(json);
  let values = Object.values(json);
  let data = [];
  for (let i = 0; i < keys.length; i++) {
    data[i] = { property: keys[i], value: values[i] };
  }

  return (
    <Card color="primary" raised={true} className={classes.card}>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
