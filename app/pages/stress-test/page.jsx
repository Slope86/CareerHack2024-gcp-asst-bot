"use client";
import { useState } from "react";
import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAXlatency = 300;
const MAXrequestCount = 1000;
const MAXtestCPUDuration = 300;
const MAXtestMemoryDuration = 300;
const MAXcpuLoad = 100;
const MAXmemoryLoadSizeMiB = 2048;

function handleUserInputInt(value, min = 0, max = 300) {
  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    return Math.min(max, Math.max(min, numericValue));
  }
}

export default function StressTest() {
  const [latency, setLatency] = useState();
  const [requestCount, setRequestCount] = useState();
  const [responseCode, setResponseCode] = useState();
  const [testCPUDuration, setTestCPUDuration] = useState();
  const [testMemoryDuration, setMemoryTestDuration] = useState();
  const [cpuLoad, setCpuLoad] = useState();
  const [memoryLoadSizeMiB, setMemoryLoadSizeMiB] = useState();
  const [isTesting, setIsTesting] = useState(false);

  const handleLatencyTest = async () => {
    setIsTesting(true);
    try {
      console.log(
        "start latency test on server",
        `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/latency-test`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/latency-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latency: parseInt(latency) }),
        }
      );
      const data = await response.json();
      console.log(data);
      console.log("end latency test");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleRequestCountTest = async () => {
    console.log(
      "start RequestCountTest on server",
      `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/request-count-test`
    );
    setIsTesting(true);
    try {
      for (let i = 0; i < requestCount; i++) {
        await fetch(
          `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/request-count-test`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestCount: i,
              responseCode: responseCode,
            }),
          }
        );
      }
      console.log("end RequestCountTest");
    } catch (error) {
      console.error("RequestCountTest Error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCpuTest = async () => {
    console.log(
      "start CpuTest on server",
      `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/cpu-test`
    );
    setIsTesting(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/cpu-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            duration: parseInt(testCPUDuration),
            load: parseInt(cpuLoad),
          }),
        }
      );
      console.log("end CpuTest");
    } catch (error) {
      console.error("CpuTest Error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleMemoryTest = async () => {
    console.log(
      "start MemoryTest on server",
      `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/memory-test`
    );
    setIsTesting(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/memory-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            duration: parseInt(testMemoryDuration),
            size_Mi: parseInt(memoryLoadSizeMiB),
          }),
        }
      );
      console.log("end MemoryTest");
    } catch (error) {
      console.error("MemoryTest Error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Layout>
      {/* Latency Test */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Requests Latency Simulation Test</CardTitle>
          <CardDescription>
            Configure the desired response delay to simulate network latency for
            requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="latency">Latency (seconds)</Label>
              <Input
                id="latency"
                type="number"
                value={latency}
                onChange={(e) => setLatency(e.target.value)}
                onBlur={(e) =>
                  setLatency(handleUserInputInt(e.target.value, 0, MAXlatency))
                }
                placeholder="Enter latency in seconds"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleLatencyTest}
            disabled={isTesting}
            style={{ width: "70px" }}
            className=" bg-blue-500 text-white hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Test"
            )}
          </button>
        </CardFooter>
      </Card>

      <div className="p-3"></div>
      {/* Requests Count Test */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Requests Count Test</CardTitle>
          <CardDescription>Set the number of requests to send.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Request Count */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="requestCount">Number Of Requests</Label>
                <Input
                  id="requestCount"
                  type="number"
                  value={requestCount}
                  onChange={(e) => setRequestCount(e.target.value)}
                  onBlur={(e) =>
                    setRequestCount(
                      handleUserInputInt(e.target.value, 0, MAXrequestCount)
                    )
                  }
                  placeholder="Enter number of requests to send"
                />
              </div>
              {/* Response Code */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="responseCode">Response Code</Label>
                <Input
                  id="responseCode"
                  type="number"
                  value={responseCode}
                  onChange={(e) => setResponseCode(e.target.value)}
                  onBlur={(e) =>
                    setResponseCode(
                      handleUserInputInt(e.target.value, 100, 599)
                    )
                  }
                  placeholder="Enter the response code you expect to receive"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleRequestCountTest}
            disabled={isTesting}
            style={{ width: "70px" }}
            className=" bg-green-500 text-white hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Test"
            )}
          </button>
        </CardFooter>
      </Card>

      <div className="p-3"></div>
      {/* CPU Utilization Test */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>CPU Utilization Test</CardTitle>
          <CardDescription>
            Set the duration and load percentage for CPU utilization test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* CPU Load */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cpuLoad">CPU Load (%)</Label>
                <Input
                  id="cpuLoad"
                  type="number"
                  value={cpuLoad}
                  onChange={(e) => setCpuLoad(e.target.value)}
                  onBlur={(e) =>
                    setCpuLoad(
                      handleUserInputInt(e.target.value, 0, MAXcpuLoad)
                    )
                  }
                  placeholder="Enter CPU Load (%)"
                />
              </div>
              {/* CPU Test Duration */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cpuTestDuration">
                  CPU Test Duration (seconds)
                </Label>
                <Input
                  id="cpuTestDuration"
                  type="number"
                  value={testCPUDuration}
                  onChange={(e) => setTestCPUDuration(e.target.value)}
                  onBlur={(e) =>
                    setTestCPUDuration(
                      handleUserInputInt(e.target.value, 0, MAXtestCPUDuration)
                    )
                  }
                  placeholder="Enter duration in seconds"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleCpuTest}
            disabled={isTesting}
            style={{ width: "70px" }}
            className=" bg-red-500 text-white hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Test"
            )}
          </button>
        </CardFooter>
      </Card>

      <div className="p-3"></div>

      {/* Memory Utilization Test */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Memory Utilization Test</CardTitle>
          <CardDescription>
            Set the duration and load percentage for memory utilization test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Memory Load Size */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="memoryLoad">Memory Load Size (MiB)</Label>
                <Input
                  id="memoryLoad"
                  type="number"
                  value={memoryLoadSizeMiB}
                  onChange={(e) => setMemoryLoadSizeMiB(e.target.value)}
                  onBlur={(e) =>
                    setMemoryLoadSizeMiB(
                      handleUserInputInt(
                        e.target.value,
                        0,
                        MAXmemoryLoadSizeMiB
                      )
                    )
                  }
                  placeholder="Enter Memory Load Size (MiB)"
                />
              </div>
              {/* Memory Test Duration */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="memoryTestDuration">
                  Memory Test Duration (seconds)
                </Label>
                <Input
                  id="memoryTestDuration"
                  type="number"
                  value={testMemoryDuration}
                  onChange={(e) => setMemoryTestDuration(e.target.value)}
                  onBlur={(e) =>
                    setMemoryTestDuration(
                      handleUserInputInt(
                        e.target.value,
                        0,
                        MAXtestMemoryDuration
                      )
                    )
                  }
                  placeholder="Enter duration in seconds"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleMemoryTest}
            disabled={isTesting}
            style={{ width: "70px" }}
            className=" bg-purple-500 text-white hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Test"
            )}
          </button>
        </CardFooter>
      </Card>
    </Layout>
  );
}
