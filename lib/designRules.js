import { generateHash, extractPatternParameters } from './patternUtils';

// 主要函数 - 使用命名导出
export const getLogoDesign = async (userData) => {
  const { initials, birthday, favoriteColor } = userData;
  
  // 1. 基于生日的哈希图案生成
  let patternParams = [{ 
    patternType: 0, 
    complexity: 2,
    feature1: 0,
    feature2: 0,
    feature3: 0,
    rotation: 0,
    // 移除了scale参数
  }];
  
  function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
  }

  function sfc32(a, b, c, d) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }

  try {
    if (birthday) {
      var seed = cyrb128(birthday+initials);
      var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
      var number = rand()+"";
      // const hashHex = await generateHash(birthday);
      for (i=2;i<11;i++){
        patternParams.push(extractPatternParameters(number[i]));
      }
    }
  } catch (error) {
    console.error("Hash generation failed, using default:", error);
    // 使用默认值继续
  }
  
  // 2. 基于姓名缩写的设计规则
  const initialsDesign = getInitialsDesign(initials);
  
  // 3. 基于颜色的设计规则
  const colorDesign = getColorDesign(favoriteColor);
  
  var res=[];

  if(patternParams.length>1){
    for(i=1;i<10;i++){
      res.push({
        layout: initialsDesign[1],
        patternType: patternParams[i].patternType,
        complexity: patternParams[i].complexity,
        feature1: patternParams[i].feature1,
        feature2: patternParams[i].feature2,
        feature3: patternParams[i].feature3,
        rotation: patternParams[i].rotation,
        // 移除了scale参数
        colors: colorDesign.colors,
        footerText: "Bionic Metamaterials"
      });
    }
  } else {
    res.push({
        layout: initialsDesign[1],
        patternType: patternParams[0].patternType,
        complexity: patternParams[0].complexity,
        feature1: patternParams[0].feature1,
        feature2: patternParams[0].feature2,
        feature3: patternParams[0].feature3,
        rotation: patternParams[0].rotation,
        // 移除了scale参数
        colors: colorDesign.colors,
        footerText: "Bionic Metamaterials"
    });
  }


  // 返回组合后的设计配置
  // return {
  //   layout: initialsDesign[1],
  //   patternType: patternParams.patternType,
  //   complexity: patternParams.complexity,
  //   feature1: patternParams.feature1,
  //   feature2: patternParams.feature2,
  //   feature3: patternParams.feature3,
  //   rotation: patternParams.rotation,
  //   // 移除了scale参数
  //   colors: colorDesign.colors,
  //   footerText: "Bionic Metamaterials"
  // };
  return res;

};

// 1. 处理姓名缩写的函数 - 决定基元排列方式
const getInitialsDesign = (initials) => {
  const length = initials?.length || 0;
  
  // 根据缩写长度决定布局
  let layout;
  
  // if (length <= 1) {
  //   layout = '1x1';
  // } else if (length === 2) {
  //   layout = '1x2';
  // } else if (length === 3) {
  //   layout = '2x3';
  // } else if (length === 4) {
  //   layout = '2x2';
  // } else {
  //   // 对于更多字母，使用近似正方形布局
  //   const rows = Math.floor(Math.sqrt(length));
  //   const cols = Math.ceil(length / rows);
  //   layout = `${rows}x${cols}`;
  // }
  layout = '3x3';
  return {1: layout, 2:initials };
};

// 2. 处理颜色的函数
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