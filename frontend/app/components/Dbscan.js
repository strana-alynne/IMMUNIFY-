"use client";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
import { fecthChildrenData, DBSCAN } from "@/utils/supabase/dbscan";

export default function Dbscan() {
  const [clusterData, setClusterData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fecthChildrenData();
      const dbData = await DBSCAN(data);
      setClusterData(dbData);
    }
    fetchData();
  }, []);

  if (!clusterData || !clusterData.clusters || !clusterData.bounds) {
    return <div>Loading...</div>;
  }

  const { bounds, clusters } = clusterData;

  const getClusterColor = (index) => {
    if (index === -1) return "#808080";
    return `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>Latitude: {data.latitude}</p>
          <p>Longitude: {data.longitude}</p>
          <p>Defaulted Count: {data.defaulted_count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="longitude"
            name="Longitude"
            domain={[bounds.lon_min, bounds.lon_max]}
          />
          <YAxis
            type="number"
            dataKey="latitude"
            name="Latitude"
            domain={[bounds.lat_min, bounds.lat_max]}
          />
          <ZAxis
            type="number"
            dataKey="defaulted_count"
            range={[50, 400]}
            name="Defaulted Count"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {clusters.map((cluster) => (
            <Scatter
              key={cluster.cluster}
              name={
                cluster.cluster === -1 ? "Noise" : `Cluster ${cluster.cluster}`
              }
              data={cluster.points}
              fill={getClusterColor(cluster.cluster)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
