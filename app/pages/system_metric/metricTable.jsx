import { Card } from "@/components/ui/card";

export default function MetricTable(data) {
  const keys = Object.keys(data);
  if (keys.length === 0) return null;

  const timestamps = Object.keys(data[keys[0]]);

  return (
    <Card className="overflow-auto max-h-[400px] mt-6 rounded p-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Timestamp</th>
            {keys.map((key) => (
              <th key={key} className="border px-4 py-2">
                Status {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timestamps.map((ts) => (
            <tr key={ts}>
              <td className="border px-4 py-2">
                {new Date(parseInt(ts)).toLocaleString()}
              </td>
              {keys.map((key) => (
                <td key={key} className="border px-4 py-2">
                  {data[key][ts]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
