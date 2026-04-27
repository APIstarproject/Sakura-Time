// 地理工具函数

/**
 * 计算两点之间的距离（Haversine公式）
 * @param {number} lat1 - 第一点的纬度
 * @param {number} lon1 - 第一点的经度
 * @param {number} lat2 - 第二点的纬度
 * @param {number} lon2 - 第二点的经度
 * @returns {number} 距离（公里）
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 根据纬度获取地区名称
 */
function getRegionByLatitude(latitude) {
  // 日本樱花观赏地点的大致纬度范围
  if (latitude > 43) return '北海道';
  if (latitude > 40) return '东北';
  if (latitude > 35) return '关东';
  if (latitude > 30) return '关西';
  return '九州';
}

/**
 * 验证坐标是否有效
 */
function isValidCoordinates(latitude, longitude) {
  return latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180;
}

/**
 * 获取地理边界框（用于地图显示）
 */
function getBoundingBox(locations, padding = 0.1) {
  if (!locations || locations.length === 0) return null;
  
  const lats = locations.map(l => l.location.coordinates[1]);
  const lons = locations.map(l => l.location.coordinates[0]);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  
  const latPadding = (maxLat - minLat) * padding;
  const lonPadding = (maxLon - minLon) * padding;
  
  return {
    north: maxLat + latPadding,
    south: minLat - latPadding,
    east: maxLon + lonPadding,
    west: minLon - lonPadding
  };
}

module.exports = {
  calculateDistance,
  getRegionByLatitude,
  isValidCoordinates,
  getBoundingBox
};
