
import { useTheme } from '@material-ui/core';
import MaterialTable from '@material-table/core';

export default function IperfTable(props) {
  let theme = useTheme();

  let columns = [
    { title: "", field: "statistic" },
    { title: "sender", field: "sender" },
    { title: "receiver", field: "receiver" }
  ];
  let json = JSON.parse(props.json);
  let sender = json.sender;
  let receiver = json.receiver;

  let data = [];

  data[0] = { statistic: "interval", sender: sender.interval, receiver: receiver.interval };
  data[1] = {
    statistic: "transfer",
    sender: sender.transfer + " MB",
    receiver: receiver.transfer + " MB"
  };
  data[2] = {
    statistic: "bandwidth",
    sender: sender.bandwidth + " Mbps",
    receiver: receiver.bandwidth + " Mbps"
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
        header: true,
        rowStyle: { fontFamily: theme.typography.fontFamily, ...theme.typography.body2 }
      }}
    />
  );
}
