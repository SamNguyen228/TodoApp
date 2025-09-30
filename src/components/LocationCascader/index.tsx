import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import {
  getProvinces,
  getProvinceWithDistricts,
  getDistrictWithWards,
  Province,
  District,
  Ward,
} from "@/api/LocationApi/placeApi";
import { useTranslation } from "react-i18next";

interface Props {
  notify: NotificationInstance;
  onSelect: (address: string) => void;
}

type OptionType = { value: number; label: string };

export default function LocationSelector({ notify, onSelect }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [provinceName, setProvinceName] = useState<string>("");
  const [districtCode, setDistrictCode] = useState<number | null>(null);
  const [districtName, setDistrictName] = useState<string>("");
  const [wardCode, setWardCode] = useState<number | null>(null);
  const [wardName, setWardName] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch(() =>
        notify.error({ message: t("notify.error"), description: t("notify.error_load_province") })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProvinceChange: SelectProps<number, OptionType>["onChange"] = async (value, option) => {
    if (!option || Array.isArray(option) || value === undefined) {
      setProvinceCode(null);
      setProvinceName("");
      setDistrictCode(null);
      setDistrictName("");
      setWardCode(null);
      setWardName("");
      setDistricts([]);
      setWards([]);
      return;
    }
    setProvinceCode(option.value);
    setProvinceName(option.label);
    setDistrictCode(null);
    setDistrictName("");
    setWardCode(null);
    setWardName("");
    setWards([]);
    setLoading(true);
    try {
      const data = await getProvinceWithDistricts(option.value);
      setDistricts(data.districts);
      onSelect(option.label);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange: SelectProps<number, OptionType>["onChange"] = async (value, option) => {
    if (!option || Array.isArray(option) || value === undefined) {
      setDistrictCode(null);
      setDistrictName("");
      setWardCode(null);
      setWardName("");
      setWards([]);
      return;
    }
    setDistrictCode(option.value);
    setDistrictName(option.label);
    setWardCode(null);
    setWardName("");
    setLoading(true);
    try {
      const data = await getDistrictWithWards(option.value);
      setWards(data.wards);
      if (provinceName) {
        onSelect(`${option.label}, ${provinceName}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWardChange: SelectProps<number, OptionType>["onChange"] = (value, option) => {
    if (!option || Array.isArray(option) || value === undefined) {
      setWardCode(null);
      setWardName("");
      return;
    }
    setWardCode(option.value);
    setWardName(option.label);
    if (districtName && provinceName) {
      onSelect(`${option.label}, ${districtName}, ${provinceName}`);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="flex gap-2 bg-white p-4 rounded-xl">
        <Select
          placeholder={t("select.province_placeholder")}
          style={{ width: 180 }}
          options={provinces.map((p) => ({ value: p.code, label: p.name }))}
          onChange={handleProvinceChange}
          value={provinceCode ?? undefined}
          allowClear
        />
        <Select
          placeholder={t("select.district_placeholder")}
          style={{ width: 180 }}
          disabled={!provinceCode}
          options={districts.map((d) => ({ value: d.code, label: d.name }))}
          onChange={handleDistrictChange}
          value={districtCode ?? undefined}
          allowClear
        />
        <Select
          placeholder={t("select.ward_placeholder")}
          style={{ width: 200 }}
          disabled={!districtCode}
          options={wards.map((w) => ({ value: w.code, label: w.name }))}
          onChange={handleWardChange}
          value={wardCode ?? undefined}
          allowClear
        />
      </div>
    </Spin>
  );
}
