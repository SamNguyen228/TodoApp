import React, { useEffect, useState } from "react";
import { Cascader, Spin } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

interface LocationCascaderProps {
  notify: NotificationInstance;
  onSelect: (fullAddress: string) => void;
}

interface Ward {
  name: string;
}

interface District {
  name: string;
  wards: Ward[];
}

interface Province {
  name: string;
  districts: District[];
}

interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}

export default function LocationCascader({ notify, onSelect }: LocationCascaderProps) {
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data: Province[]) => {
        const formatted: CascaderOption[] = data.map((p) => ({
          value: p.name,
          label: p.name,
          children: p.districts.map((d) => ({
            value: d.name,
            label: d.name,
            children: d.wards.map((w) => ({
              value: w.name,
              label: w.name,
            })),
          })),
        }));
        setOptions(formatted);
      })
      .catch(() => {
        notify.error({
          message: "Error",
          description: "Failed to load location data",
        });
      })
      .finally(() => setLoading(false));
  }, [notify]);

  const handleChange = (value: string[]) => {
    const fullAddress = [...value].reverse().join(", ");
    onSelect(fullAddress);
  };

  return (
    <Spin spinning={loading}>
      <Cascader
        options={options}
        onChange={handleChange}
        placeholder="Select Province / District / Ward"
        className="w-[260px]"
      />
    </Spin>
  );
}
