// Static vehicle image URLs from Wikipedia Commons
// These are direct CDN URLs — no API calls, always available

export const VEHICLE_IMAGES: Record<string, string> = {
  // Toyota
  "toyota/camry": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2018_Toyota_Camry_%28AXVH71R%29_Ascent_sedan_%282018-08-27%29_01.jpg/640px-2018_Toyota_Camry_%28AXVH71R%29_Ascent_sedan_%282018-08-27%29_01.jpg",
  "toyota/corolla": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/640px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg",
  "toyota/rav4": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2019_Toyota_RAV4_LE_AWD_2.5L_front_4.3.21.jpg/640px-2019_Toyota_RAV4_LE_AWD_2.5L_front_4.3.21.jpg",
  "toyota/tacoma": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2016_Toyota_Tacoma_TRD_Off_Road_4x4_Double_Cab_5.30.21.jpg/640px-2016_Toyota_Tacoma_TRD_Off_Road_4x4_Double_Cab_5.30.21.jpg",
  "toyota/highlander": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/2020_Toyota_Highlander_XLE_AWD_front_10.10.20.jpg/640px-2020_Toyota_Highlander_XLE_AWD_front_10.10.20.jpg",
  "toyota/4runner": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2014_Toyota_4Runner_SR5_5.7.19.jpg/640px-2014_Toyota_4Runner_SR5_5.7.19.jpg",

  // Honda
  "honda/civic": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/2022_Honda_Civic_Sport_%28FE1%29%2C_front_right.jpg/640px-2022_Honda_Civic_Sport_%28FE1%29%2C_front_right.jpg",
  "honda/accord": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/2018_Honda_Accord_sedan_%28facelift%29%2C_front_8.31.21.jpg/640px-2018_Honda_Accord_sedan_%28facelift%29%2C_front_8.31.21.jpg",
  "honda/cr-v": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/2017_Honda_CR-V_EX_i-DTEC_1.6.jpg/640px-2017_Honda_CR-V_EX_i-DTEC_1.6.jpg",

  // Ford
  "ford/f-150": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2021_Ford_F-150_XL_SuperCrew%2C_front_right.jpg/640px-2021_Ford_F-150_XL_SuperCrew%2C_front_right.jpg",
  "ford/mustang": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/2018_Ford_Mustang_GT_5.0_fL_silver.jpg/640px-2018_Ford_Mustang_GT_5.0_fL_silver.jpg",
  "ford/explorer": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/2020_Ford_Explorer_Platinum_in_Star_White%2C_front_right.jpg/640px-2020_Ford_Explorer_Platinum_in_Star_White%2C_front_right.jpg",

  // BMW
  "bmw/3-series": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2019_BMW_330i_M_Sport_%28G20%29_sedan%2C_front_right.jpg/640px-2019_BMW_330i_M_Sport_%28G20%29_sedan%2C_front_right.jpg",
  "bmw/x3": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/2018_BMW_X3_xDrive30d_M_Sport_Automatic_3.0.jpg/640px-2018_BMW_X3_xDrive30d_M_Sport_Automatic_3.0.jpg",

  // Chevrolet
  "chevrolet/silverado-1500": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2019_Chevrolet_Silverado_1500_LT_Trail_Boss_front_4.5.19.jpg/640px-2019_Chevrolet_Silverado_1500_LT_Trail_Boss_front_4.5.19.jpg",
  "chevrolet/equinox": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/2018_Chevrolet_Equinox_LT_AWD_front_5.27.18.jpg/640px-2018_Chevrolet_Equinox_LT_AWD_front_5.27.18.jpg",

  // Jeep
  "jeep/wrangler": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Jeep_Wrangler_Unlimited_Rubicon_%28JL%29_%E2%80%93_f_26022023.jpg/640px-Jeep_Wrangler_Unlimited_Rubicon_%28JL%29_%E2%80%93_f_26022023.jpg",
  "jeep/grand-cherokee": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2022_Jeep_Grand_Cherokee_Overland_4x4%2C_front_right.jpg/640px-2022_Jeep_Grand_Cherokee_Overland_4x4%2C_front_right.jpg",

  // Tesla
  "tesla/model-3": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_AWD_Front.jpg/640px-2019_Tesla_Model_3_Performance_AWD_Front.jpg",
  "tesla/model-y": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Tesla_Model_Y_front_right.jpg/640px-Tesla_Model_Y_front_right.jpg",
};

export function getVehicleImageUrl(makeSlug: string, modelSlug: string): string | null {
  return VEHICLE_IMAGES[`${makeSlug}/${modelSlug}`] ?? null;
}
