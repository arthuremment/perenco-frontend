import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function ReportCharts({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Chargement des données...</p>;
  }

  // ---- 1. Aggregated Operations breakdown ----
  const allOperations = data.flatMap(report => report.operations || []);

  const operationsSummary = allOperations
    .filter(op => op.activity)
    .map(op => {
      const from = parseInt(op.time_from?.split(":")[0] || 0);
      const to = parseInt(op.time_to?.split(":")[0]) || 24;
      const hours = to > from ? to - from : 24 - from + to;
      return { activity: op.activity, hours };
    });

  const aggregatedOps = Object.values(
    operationsSummary.reduce((acc, op) => {
      acc[op.activity] = acc[op.activity] || { activity: op.activity, hours: 0 };
      acc[op.activity].hours += op.hours;
      return acc;
    }, {})
  );

  // ---- 2. Aggregated Fuel / Lube / Water ----
  const fuel = {
    name: "Fuel Oil",
    ROB: data.reduce((sum, r) => sum + (+r.fuel_oil_rob || 0), 0),
    Received: data.reduce((sum, r) => sum + (+r.fuel_oil_received || 0), 0),
    Consumed: data.reduce((sum, r) => sum + (+r.fuel_oil_consumed || 0), 0),
    Delivered: data.reduce((sum, r) => sum + (+r.fuel_oil_delivered || 0), 0)
  };

  const lub = {
    name: "Lub Oil",
    ROB: data.reduce((sum, r) => sum + (+r.lub_oil_rob || 0), 0),
    Received: data.reduce((sum, r) => sum + (+r.lub_oil_received || 0), 0),
    Consumed: data.reduce((sum, r) => sum + (+r.lub_oil_consumed || 0), 0),
    Delivered: data.reduce((sum, r) => sum + (+r.lub_oil_delivered || 0), 0)
  };

  const water = {
    name: "Fresh Water",
    ROB: data.reduce((sum, r) => sum + (+r.fresh_water_rob || 0), 0),
    Received: data.reduce((sum, r) => sum + (+r.fresh_water_received || 0), 0),
    Consumed: data.reduce((sum, r) => sum + (+r.fresh_water_consumed || 0), 0),
    Delivered: data.reduce((sum, r) => sum + (+r.fresh_water_delivered || 0), 0)
  };

  const consumables = [fuel, lub, water];

  // ---- 3. Tanks (last report snapshot) ----
  const lastReport = data[data.length - 1];
  const tanksData = (lastReport.tanks || []).map(t => ({
    tank: t.tank,
    capacity: parseInt(t.capacity?.split("/")[1]) || 0,
    quantity: t.quantity || 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Operations Pie */}
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-2">Répartition du temps par opérations</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={aggregatedOps} dataKey="hours" nameKey="activity" label>
                {aggregatedOps.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel / Lube / Water */}
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-2">
          Consommables cumulés (ROB, Received, Consumed, Delivered)
        </h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={consumables}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ROB" fill="#8884d8" />
              <Bar dataKey="Received" fill="#82ca9d" />
              <Bar dataKey="Consumed" fill="#ffc658" />
              <Bar dataKey="Delivered" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tanks */}
      <div className="bg-white shadow rounded-2xl p-4 lg:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Niveaux des tanks (dernier rapport)</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <BarChart layout="vertical" data={tanksData}>
              <XAxis type="number" />
              <YAxis dataKey="tank" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#ccc" />
              <Bar dataKey="quantity" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}