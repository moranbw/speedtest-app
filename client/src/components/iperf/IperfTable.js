import React from 'react';
import MaterialTable from "material-table";


export default function IperfTable(props) {

  const createRows = (aJson, aData, aCategory) => {
    let keys = Object.keys(aJson);
    let values = Object.values(aJson);
    let data = [];
    for (let i = 0; i < keys.length; i++) {
      data[i] = { property: keys[i], value: values[i] };
    }
    aData.push({
      statistic: "interval",
      tran: aJson.transfer + " MBytes",
      bandwidth: aJson.bandwidth + " MBits/Sec",
      retransmits: aJson.retransmits
    });
  };

  /*let columns = [
    { title: "", field: "category" },
    { title: "interval", field: "interval" },
    { title: "transfer", field: "transfer" },
    { title: "bandwidth", field: "bandwidth" },
    { title: "retransmits", field: "retransmits" }
  ];*/
  let columns = [
    { title: "", field: "statistic" },
    { title: "sender", field: "sender" },
    { title: "receiver", field: "receiver" }
  ];
  let json = JSON.parse(props.json);
  let sender = json.sender;
  let receiver = json.receiver;

  let data = [];
  //createRow(sender, data, "sender");
  //createRow(receiver, data, "receiver");

  data[0] = { statistic: "interval", sender: sender.interval, receiver: receiver.interval };
  data[1] = {
    statistic: "transfer",
    sender: sender.transfer + " MBytes",
    receiver: receiver.transfer + " MBytes"
  };
  data[2] = {
    statistic: "bandwidth",
    sender: sender.bandwidth + " MBits/Sec",
    receiver: receiver.bandwidth + " MBits/Sec"
  };
  data[3] = { statistic: "retransmits", sender: sender.retransmits, receiver: receiver.retransmits };

  return (
    <MaterialTable
      data={data}
      columns={columns}
      options={{
        padding: "dense",
        toolbar: false,
        paging: false,
        showTitle: false,
        header: true
      }}
    />
  );
}
