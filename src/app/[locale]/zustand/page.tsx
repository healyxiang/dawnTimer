"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDeviceStore } from "@/store/device";

const Child1 = memo(function () {
  const device = useDeviceStore((state) => state.devices?.["1"]);
  console.log("devices in Child1", device);
  return <div>Child1: {device?.name}</div>;
});

Child1.displayName = "Child1";

const Child3 = memo(function ({ deviceId }: { deviceId: string }) {
  //   const deviceList = useDeviceStore((state) => state.devicesArr);
  const device = useDeviceStore((state) =>
    state.devicesArr.find((device) => device.id === deviceId)
  );
  //   const device = useMemo(() => {
  //     return deviceList.find((device) => device.id === deviceId);
  //   }, [deviceList, deviceId]);
  console.log("render in  Child3", device);
  return <div>Child3: {device?.name}</div>;
});

Child3.displayName = "Child3";

function useCompare<T>(
  selector: (state: any) => T,
  isEqual: (a: T, b: T) => boolean
) {
  const prev = useRef<T | undefined>(undefined);

  return (state: any) => {
    const next = selector(state);
    // 如果相等，返回旧引用；否则更新并返回新值
    if (prev.current !== undefined && isEqual(prev.current, next)) {
      return prev.current;
    }
    prev.current = next;
    return next;
  };
}

const Child2 = memo(function ({ deviceId }: { deviceId: string }) {
  const devicesArr = useDeviceStore(
    useCompare(
      (state) => state.devicesArr,
      (a, b) => {
        const oldDevice = a.find((device) => device.id === deviceId);
        const newDevice = b.find((device) => device.id === deviceId);
        if (oldDevice && newDevice) {
          return oldDevice.name === newDevice.name;
        }
        return false;
      }
    )
  );
  console.log("devices in Child2", devicesArr);
  return (
    <div>
      Child2:
      <div className="border border-gray-300 p-2 rounded-md">
        {devicesArr.map((device) => device.name).join(", ")}
      </div>
    </div>
  );
});

Child1.displayName = "Child2";

export default function ZustandPage() {
  //   const deviceIds = useDeviceStore(
  //     useShallow((state) => Object.keys(state.devices))
  //   );
  const deviceIds = useDeviceStore(
    useShallow((state) => state.devicesArr.map((device) => device.id))
  );
  //   const deviceIds = useDeviceStore((state) => state.deviceIds);
  const setDevice = useDeviceStore((state) => state.setDevice);
  const addDevice = useDeviceStore((state) => state.addDevice);
  const deleteDevice = useDeviceStore((state) => state.deleteDevice);
  const setDevicesArr = useDeviceStore((state) => state.setDevicesArr);
  const addDevicesArr = useDeviceStore((state) => state.addDevicesArr);

  //   useEffect(() => {
  //     setDeviceIds(["1", "2", "3"]);
  //     setSelectedDeviceIds(["1", "2"]);
  //   }, []);
  //   console.log("devices", deviceIds);
  console.log("deviceIds render in page:", deviceIds);
  //   console.log("selectedDeviceIds", selectedDeviceIds);

  return (
    <div>
      <div>Devices:</div>
      <div>Device IDs: {deviceIds.join(", ")}</div>
      <div>Selected Device IDs:</div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => setDevice({ id: "1", name: "Device 1" })}
      >
        Set Device
      </button>

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => addDevice({ id: "2", name: "Device 2" })}
      >
        Add Device
      </button>

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => deleteDevice("2")}
      >
        Delete Device
      </button>

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => addDevicesArr({ id: "9", name: "Device 5" })}
      >
        Add Device Arr
      </button>

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => setDevicesArr({ id: "5", name: "Device 5----5" })}
      >
        Set Device Arr 2
      </button>
      <Child1 />
      <Child2 deviceId="5" />
      <Child3 deviceId="5" />
      {/* <button onClick={() => setDeviceIds(["1", "2", "3"])}>Set Device IDs</button>
    <button onClick={() => setSelectedDeviceIds(["1", "2"])}>Set Selected Device IDs</button> */}
    </div>
  );
}
