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
import { handleUserInputInt } from "@/lib/utils";

const MAXlatency = 300;
const MAXrequestCount = 1000;
const MAXtestCPUDuration = 300;
const MAXtestMemoryDuration = 300;
const MAXcpuLoad = 100;
const MAXmemoryLoadSizeMiB = 2048;
const requestInterval = 1000;

export default function StressTest() {
  const [latency, setLatency] = useState();
  const [requestCount, setRequestCount] = useState();
  const [responseCode, setResponseCode] = useState();
  const [testCPUDuration, setTestCPUDuration] = useState();
  const [testMemoryDuration, setMemoryTestDuration] = useState();
  const [cpuLoad, setCpuLoad] = useState();
  const [memoryLoadSizeMiB, setMemoryLoadSizeMiB] = useState();
  const [isTesting, setIsTesting] = useState(false);

  const handleRequestTest = async () => {
    console.log(
      "Start RequestTest on server",
      `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/request-test`
    );
    setIsTesting(true);
    try {
      for (let i = 0; i < requestCount; i++) {
        fetch(
          `${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/request-test`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latency: parseInt(latency),
              responseCode: responseCode,
            }),
          }
        );
      }
      console.log("End RequestTest");
    } catch (error) {
      console.error("RequestTest Error:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, requestInterval));
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
      fetch(`${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/cpu-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: parseInt(testCPUDuration),
          load: parseInt(cpuLoad),
        }),
      });
      console.log("end CpuTest");
    } catch (error) {
      console.error("CpuTest Error:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, requestInterval));
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
      fetch(`${process.env.NEXT_PUBLIC_GCP_STRESS_API_URL}/api/memory-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: parseInt(testMemoryDuration),
          size_Mi: parseInt(memoryLoadSizeMiB),
        }),
      });
      console.log("end MemoryTest");
    } catch (error) {
      console.error("MemoryTest Error:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, requestInterval));
      setIsTesting(false);
    }
  };

  return (
    <Layout>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Request Simulation Test</CardTitle>
          <CardDescription>
            Configure the test settings to simulate network latency and set the
            number of requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full gap-4">
              {/* Latency Configuration */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="latency">Latency (seconds)</Label>
                <Input
                  id="latency"
                  type="number"
                  value={latency}
                  onChange={(e) => setLatency(e.target.value)}
                  onBlur={(e) =>
                    setLatency(
                      handleUserInputInt(e.target.value, 0, MAXlatency)
                    )
                  }
                  placeholder="Enter server response latency in seconds"
                />
              </div>
              {/* Response Code Configuration */}
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
                  placeholder="Enter server response code you expect to receive"
                />
              </div>
              {/* Request Count Configuration */}
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
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleRequestTest}
            disabled={isTesting}
            className="bg-blue-500 text-white hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center"
            style={{ width: "70px" }}
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
