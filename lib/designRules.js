// lib/designRules.js
// 设计规则引擎 - 将用户答案映射到设计元素

// 主要函数 - 使用命名导出
export const getLogoDesign = (userData) => {
  const { initials, birthday, favoriteColor, hobbies } = userData;
  
  // 1. 基于姓名缩写的设计规则
  const initialsDesign = getInitialsDesign(initials);

  // 2. 基于生日的设计规则
  const birthdayDesign = getBirthdayDesign(birthday);
  
  // 3. 基于颜色的设计规则
  const colorDesign = getColorDesign(favoriteColor);
  
  // 返回组合后的设计配置
  return {
    layout: initialsDesign.layout, // 基元排列方式 (如 "2x3")
    shape: birthdayDesign.shape,   // 基元图案
    colors: colorDesign.colors,    // 颜色方案
    // 兴趣爱好不纳入设计规则，只在页面显示
    footerText: "Bionic Metamaterials" // 固定底部文本
  };
};

// 1. 处理姓名缩写的函数 - 决定基元排列方式
const getInitialsDesign = (initials) => {
  const length = initials.length;
  
  // 根据缩写长度决定布局
  // 例如: CJY (3个字母) → "2x3" 排列
  let layout;
  
  if (length === 1) {
    layout = '2x2';
  } else if (length === 2) {
    layout = '2x2';
  } else if (length === 3) {
    layout = '2x3'; // 如您示例中的 CJY → 2x3
  } else if (length === 4) {
    layout = '3x3';
  } else {
    // 对于更多字母，使用近似正方形布局
    const rows = Math.floor(Math.sqrt(length));
    const cols = Math.ceil(length / rows);
    layout = `${rows}x${cols}`;
  }
  layout = '3x3';
  
  return { layout };
};

// 2. 处理生日的函数 - 决定基元图案
const getBirthdayDesign = (birthday) => {
  const shapes= {
    1: 'circle',      // 一月 - 圆形
    2: 'heart',       // 二月 - 心形
    3: 'triangle',    // 三月 - 三角形
    4: 'square',      // 四月 - 方形
    5: 'pentagon',    // 五月 - 五边形
    6: 'hexagon',     // 六月 - 六边形
    7: 'star',        // 七月 - 星形
    8: 'diamond',     // 八月 - 钻石形
    9: 'cloud',       // 九月 - 云形
    10: 'leaf',       // 十月 - 叶子形
    11: 'moon',       // 十一月 - 月牙形
    12: 'snowflake'   // 十二月 - 雪花形
  };
  var randomShape = [];
  for (var i=1; i<10; i++) {
    randomShape[i] = shapes[Math.floor(Math.random()*12+1)];
    if (!birthday) randomShape[i] = 'circle';
  }
  
  // const date = new Date(birthday);
  // const month = date.getMonth() + 1; // 0-11 → 1-12

  
  
  // 根据月份决定基元图案
  // const shapesByMonth = {
  //   1: 'circle',      // 一月 - 圆形
  //   2: 'heart',       // 二月 - 心形
  //   3: 'triangle',    // 三月 - 三角形
  //   4: 'square',      // 四月 - 方形
  //   5: 'pentagon',    // 五月 - 五边形
  //   6: 'hexagon',     // 六月 - 六边形
  //   7: 'star',        // 七月 - 星形
  //   8: 'diamond',     // 八月 - 钻石形
  //   9: 'cloud',       // 九月 - 云形
  //   10: 'leaf',       // 十月 - 叶子形
  //   11: 'moon',       // 十一月 - 月牙形
  //   12: 'snowflake'   // 十二月 - 雪花形
  // };
  
  console.log(randomShape);

  return {
    shape: randomShape
  };
};

// 3. 处理颜色的函数
const getColorDesign = (favoriteColor) => {
  // 颜色配置映射
  const colorPalettes = {
    red: {
      primary: '#ff4d4f',
      secondary: '#fff2f0',
      accent: '#cf1322'
    },
    blue: {
      primary: '#1890ff',
      secondary: '#f0f5ff',
      accent: '#096dd9'
    },
    green: {
      primary: '#52c41a',
      secondary: '#f6ffed',
      accent: '#389e0d'
    },
    yellow: {
      primary: '#fadb14',
      secondary: '#feffe6',
      accent: '#d4b106'
    },
    purple: {
      primary: '#722ed1',
      secondary: '#f9f0ff',
      accent: '#531dab'
    },
    orange: {
      primary: '#fa8c16',
      secondary: '#fff7e6',
      accent: '#d46b08'
    },
    pink: {
      primary: '#eb2f96',
      secondary: '#fff0f6',
      accent: '#c41d7f'
    },
    cyan: {
      primary: '#13c2c2',
      secondary: '#e6fffb',
      accent: '#08979c'
    }
  };
  
  return {
    colors: colorPalettes[favoriteColor] || colorPalettes.blue
  };
};

// 注意: 兴趣爱好不纳入设计规则，只在问卷中显示