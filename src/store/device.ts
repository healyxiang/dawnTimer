import { create } from "zustand";

interface DeviceMeta {
  id: string;
  name: string;
}

interface DeviceStore {
  // 动态数据存放在单独的 Record 属性中
  devices: Record<string, DeviceMeta>;
  devicesArr: DeviceMeta[];
  deviceIds: string[];
  selectedDeviceIds: string[];

  // Actions
  setDevice: (device: DeviceMeta) => void;
  addDevice: (device: DeviceMeta) => void;
  deleteDevice: (deviceId: string) => void;
  setDevicesArr: (device: DeviceMeta) => void;
  addDevicesArr: (device: DeviceMeta) => void;
  setDeviceIds: (deviceIds: string[]) => void;
  setSelectedDeviceIds: (selectedDeviceIds: string[]) => void;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: {},
  devicesArr: [
    { id: "5", name: "Device 5" },
    { id: "6", name: "Device 6" },
  ],
  deviceIds: [],
  selectedDeviceIds: [],

  setDevice: (device) =>
    set((state) => ({
      devices: { ...state.devices, [device.id]: device },
    })),

  addDevice: (device) => {
    set((state) => ({
      devices: { ...state.devices, [device.id]: device },
    }));
  },

  deleteDevice: (deviceId: string) => {
    const newDevices = { ...get().devices };
    delete newDevices[deviceId];
    set({ devices: newDevices });
  },
  setDevicesArr: (device) => {
    const newDevicesArr = [...get().devicesArr];
    const index = newDevicesArr.findIndex((d) => d.id === device.id);
    if (index === -1) {
      newDevicesArr.push(device);
    } else {
      newDevicesArr[index] = { ...newDevicesArr[index], ...device };
    }
    set({ devicesArr: newDevicesArr });
  },
  addDevicesArr: (device) => {
    const newDevicesArr = [...get().devicesArr];
    newDevicesArr.push(device);
    set({ devicesArr: newDevicesArr });
  },
  setDeviceIds: (deviceIds) => set({ deviceIds }),
  setSelectedDeviceIds: (selectedDeviceIds) => set({ selectedDeviceIds }),
}));
