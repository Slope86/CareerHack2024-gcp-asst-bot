"use client";

import Head from "next/head";
import { useState } from "react";
import login from "@/app/api/auth";
import Layout from "@/components/layout";
import MetricTable from "./metricTable";
import LineChart from "./lineChart";

export default function SystemMetric() {
  const [metric, setMetric] = useState("request_count");
  const [days, setDays] = useState(1);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchMetrics() {
    setLoading(true);
    setResult("");
    try {
      const api_admin_username = process.env.NEXT_PUBLIC_API_ADMIN_USERNAME;
      const api_admin_password = process.env.NEXT_PUBLIC_API_ADMIN_PASSWORD;
      const auth_header = await login(api_admin_username, api_admin_password);
      console.log("auth_header:", auth_header);
      console.log(JSON.stringify({ metric, days, hours, minutes }));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/system_metric`,
        {
          method: "POST",
          headers: auth_header,
          body: JSON.stringify({ metric, days, hours, minutes }),
        }
      );
      const data = await response.json();
      // show the type of data
      console.log("data type:", typeof data);
      // show the data
      console.log("data:", data);
      // show data to json object
      console.log("data to json object:", JSON.parse(data));
      // check if data is an empty json object
      if (data === "{}") {
        console.log("no data match the query");
        return;
      }
      setResult(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Layout>
      <Head>
        <title>System Metrics</title>
      </Head>
      <section className="max-w-4xl border-2 mx-auto p-6 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">System Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Metric:
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              <option value="request_count">Request Count</option>
              <option value="request_latencies">Request Latencies</option>
              <option value="instance_count">Instance Count</option>
              <option value="CPU_utilization">CPU Utilization</option>
              <option value="memory_utilization">Memory Utilization</option>
              <option value="startup_latency">Startup Latency</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Days:
            </label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={days}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setDays(Math.max(0, value));
              }}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Hours:
            </label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={hours}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setHours(Math.max(0, value));
              }}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Minutes:
            </label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={minutes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setMinutes(Math.max(0, value));
              }}
            />
          </div>
        </div>
        <button
          onClick={fetchMetrics}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
          style={{ width: "150px" }}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Fetch Metrics"
          )}
        </button>
        {result && (
          <div>
            {LineChart(JSON.parse(result))}
            {MetricTable(JSON.parse(result))}
          </div>
        )}
      </section>
    </Layout>
  );
}
