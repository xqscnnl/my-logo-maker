// 安全的哈希生成函数
export async function generateHash(input) {
  // 确保输入是字符串
  const str = String(input || 'default');
  
  try {
    // 检查浏览器是否支持 crypto.subtle
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // 不支持 crypto.subtle 时的备用方案
      throw new Error('crypto.subtle not available');
    }
  } catch (error) {
    console.warn('SHA256哈希失败，使用备用方法:', error);
    
    // 简单但有效的备用哈希方法
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

// 提取图案参数 - 更新为基于图案特点的参数
export function extractPatternParameters(hashHex) {
  // return {
  //   patternType: parseInt(hashHex[0], 16) % patternNames.length,
  //   complexity: parseInt(hashHex[2], 16) % 5 + 1,
  //   feature1: parseInt(hashHex[3], 16) % 10,
  //   feature2: parseInt(hashHex[4], 16) % 10,
  //   feature3: parseInt(hashHex[5], 16) % 10,
  //   rotation: (parseInt(hashHex[6], 16) % 10) * 10, // 0-90°的10°倍数
  //   // 移除了scale参数
  // };
    return {
    patternType: hashHex % patternNames.length,
    complexity: (hashHex+1) % 5 + 1,
    feature1: (hashHex+2) % 10,
    feature2: (hashHex+2) % 10,
    feature3: (hashHex+1) % 10,
    rotation: ((hashHex+2) % 10) * 10, // 0-90°的10°倍数
    // 移除了scale参数
  };
}

// 图案名称映射 - 更新为所有可用的图案类型
export const patternNames = [
  "方形螺旋", "手性柔顺机构", "多方框", "方形谐振环", 
  "狄拉克锥", "Jerusalem十字", "渔网结构", "分型结构",
  "谢尔宾斯基地毯", "耶路撒冷十字架", "希腊十字", "方形梯度",
  "特殊十字", "圆形谐振环", "双C开口", "旋转三角",
  "光子晶体", "嵌套方框", "彭罗斯轮廓"
];