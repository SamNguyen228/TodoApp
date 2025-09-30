export interface Province {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
}

export interface Ward {
  code: number;
  name: string;
}

export interface ProvinceWithDistricts extends Province {
  districts: District[];
}

export interface DistrictWithWards extends District {
  wards: Ward[];
}

const BASE_URL = "https://provinces.open-api.vn/api";

export const getProvinces = async (): Promise<Province[]> => {
  const res = await fetch(`${BASE_URL}/p/`);
  return res.json();
};

export const getProvinceWithDistricts = async (code: number): Promise<ProvinceWithDistricts> => {
  const res = await fetch(`${BASE_URL}/p/${code}?depth=2`);
  return res.json();
};

export const getDistrictWithWards = async (code: number): Promise<DistrictWithWards> => {
  const res = await fetch(`${BASE_URL}/d/${code}?depth=2`);
  return res.json();
};
