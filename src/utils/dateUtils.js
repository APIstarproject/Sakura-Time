// 日期工具函数

/**
 * 计算两个日期之间相差的天数
 */
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * 获取过去N天的日期数组
 */
function getPastDates(days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  return dates.reverse();
}

/**
 * 获取未来N天的日期数组
 */
function getFutureDates(days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  return dates;
}

/**
 * 季节性校准因子（根据年份）
 */
function getSeasonalFactor(year) {
  // 全球变暖的影响，每10年提前约2-3天
  const yearsFromBaseline = year - 2020;
  return Math.min(3, (yearsFromBaseline / 10) * 2.5);
}

module.exports = {
  daysBetween,
  getPastDates,
  getFutureDates,
  getSeasonalFactor
};
