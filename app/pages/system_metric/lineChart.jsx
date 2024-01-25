import { Chart } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Card } from "@/components/ui/card";

export default function LineChart(data) {
  const keys = Object.keys(data);
  const timestamps = Object.keys(data[keys[0]]);
  const colors = [
    "rgb(0, 100, 255)",
    "rgb(255, 0, 0)",
    "rgb(200, 0, 255)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
    "rgb(199, 199, 199)",
  ];

  const chartData = {
    labels: timestamps.map((ts) => new Date(parseInt(ts)).toLocaleString()),
    datasets: keys.map((key, index) => {
      const color = colors[index % colors.length];
      return {
        label: `Status ${key}`,
        data: timestamps.map((ts) => data[key][ts]),
        fill: false,
        backgroundColor: color,
        borderColor: color,
      };
    }),
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "State",
        },
      },
    },
  };
  console.log("chartData:", chartData, "options:", options);
  return (
    <Card className="mt-6 rounded p-4 overflow-x-auto">
      <div className="min-w-[1000px]">
        <Chart type="bar" data={chartData} options={""} />
      </div>
    </Card>
  );
}
