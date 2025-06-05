/**
 * 日期工具函数
 */

/**
 * 格式化日期为YYYY-MM-DD格式
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间为YYYY-MM-DD HH:MM格式
 * @param date 日期对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * 获取相对时间描述，如"昨天"、"2小时前"等
 * @param date 日期对象
 * @returns 相对时间描述
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return '昨天';
  }

  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }

  return formatDate(date);
}