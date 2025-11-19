'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import { patternNames } from '@/lib/patternUtils';

const LogoPreview = ({ designConfig, initials }) => {
  const logoRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有设计配置，显示加载状态
  if (!designConfig) {
    return <div>正在准备Logo预览...</div>;
  }

  // 从 designConfig 中解构值，并提供默认值
  const { 
    layout = "1x1", 
    patternType = 0,
    complexity = 2,
    feature1 = 0,
    feature2 = 0,
    feature3 = 0,
    rotation = 0,
    colors = { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" },
    footerText = "Bionic Metamaterials"
  } = designConfig;

  // 下载Logo功能
  const handleDownload = async () => {
    if (logoRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(logoRef.current, {
        backgroundColor: colors.secondary,
        pixelRatio: 3 // 提高导出图片质量
      });

      const link = document.createElement('a');
      link.download = `bionic-logo-${initials || 'design'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 方形螺旋
  const renderSquareSpiral = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const maxSize = 80 + complexity * 10;
    const turns = 3 + Math.floor(complexity / 2);
    const segments = 4 * turns;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const size = maxSize * t;
      const angle = (Math.PI / 2) * i;
      
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      
      points.push(`${x},${y}`);
    }
    
    return (
      <polyline 
        points={points.join(' ')} 
        fill="none" 
        stroke={colors.primary} 
        strokeWidth={4 + complexity} 
      />
    );
  };

  // 手性柔顺机构
  const renderChiralAuxetic = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const radius = 40 + complexity * 8;
    const nArms = 4 + Math.floor(f1 / 3);
    const chirality = f2 > 5 ? 'right' : 'left';
    
    return (
      <g>
        {/* 中心圆 */}
        <circle cx={centerX} cy={centerY} r={radius/2} fill={colors.accent} />
        
        {/* 绘制每个臂/韧带 */}
        {Array.from({ length: nArms }).map((_, i) => {
          const angle = (i * 2 * Math.PI / nArms) + (f3 * Math.PI / 180);
          const chiralitySign = chirality === 'right' ? 1 : -1;
          
          // 计算臂的起点（在中心圆上）
          const startX = centerX + (radius/2) * Math.cos(angle);
          const startY = centerY + (radius/2) * Math.sin(angle);
          
          // 计算臂的终点（在外圆上）
          const endRadius = radius * 1.8;
          const endX = centerX + endRadius * Math.cos(angle);
          const endY = centerY + endRadius * Math.sin(angle);
          
          // 计算控制点（使臂弯曲）
          const controlRadius = (radius/2 + endRadius) / 2;
          const controlAngle = angle + chiralitySign * (2 * Math.PI / nArms) / 3;
          const controlX = centerX + controlRadius * Math.cos(controlAngle);
          const controlY = centerY + controlRadius * Math.sin(controlAngle);
          
          // 创建二次贝塞尔曲线
          return (
            <path
              key={i}
              d={`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`}
              fill="none"
              stroke={colors.primary}
              strokeWidth={6 + complexity}
            />
          );
        })}
      </g>
    );
  };

  // 多方框谐振器
  const renderMultiSquareResonator = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const nSquares = 3 + Math.floor(complexity / 2);
    const baseSize = 40;
    const gap = 12 + f1;
    
    return (
      <g>
        {Array.from({ length: nSquares }).map((_, i) => {
          const size = baseSize + i * (baseSize + gap);
          return (
            <rect 
              key={i}
              x={centerX - size/2} 
              y={centerY - size/2} 
              width={size} 
              height={size} 
              fill="none" 
              stroke={colors.primary} 
              strokeWidth={4 + i} 
            />
          );
        })}
        
        {/* 中心点 */}
        <circle cx={centerX} cy={centerY} r={8 + complexity} fill={colors.accent} />
      </g>
    );
  };

// 方形谐振环
  const renderSquareResonator = (complexity, f1, f2, f3, colors) => {
    const outerSize = 70 + complexity * 6;
    const innerSize = 50 + complexity * 4;
    const thickness = 10 + complexity * 2;
    
    return (
      <g>
        {/* 外环 */}
        <rect x={100 - outerSize/2} y={100 - outerSize/2} 
              width={outerSize} height={outerSize} 
              fill="none" stroke={colors.primary} strokeWidth={thickness} />
        
        {/* 内环 */}
        <rect x={100 - innerSize/2} y={100 - innerSize/2} 
              width={innerSize} height={innerSize} 
              fill="none" stroke={colors.primary} strokeWidth={thickness/2} />
        
        {/* 缺口 */}
        <line x1={100 + outerSize/2 - 12} y1={100 - 8} 
              x2={100 + outerSize/2 - 12} y2={100 + 8} 
              stroke={colors.secondary} strokeWidth={thickness + 2} />
        
        <line x1={100 - outerSize/2 + 12} y1={100 - 8} 
              x2={100 - outerSize/2 + 12} y2={100 + 8} 
              stroke={colors.secondary} strokeWidth={thickness + 2} />
      </g>
    );
  };
  // 狄拉克锥结构
  const renderDiracCone = (complexity, f1, f2, f3, colors) => {
    const n = 3 + Math.floor(complexity / 2);
    const a = 100 / n;
    const dotSize = 5 + complexity;
    
    return (
      <g>
        {/* 生成A位点和B位点 */}
        {Array.from({ length: n }).map((_, i) => {
          return Array.from({ length: n }).map((_, j) => {
            // A位点坐标
            const xA = 100 + a * (i - (n-1)/2 + 0.5 * (j - (n-1)/2));
            const yA = 100 + a * (j - (n-1)/2) * Math.sqrt(3)/2;
            
            // B位点坐标 (相对于A位点偏移)
            const xB = xA + a/2;
            const yB = yA + a * Math.sqrt(3)/6;
            
            return (
              <g key={`${i}-${j}`}>
                {/* A位点（蓝色） */}
                <circle cx={xA} cy={yA} r={dotSize} fill={colors.primary} />
                
                {/* B位点（红色） */}
                <circle cx={xB} cy={yB} r={dotSize} fill={colors.accent} />
                
                {/* 连接线（如果距离足够近） */}
                <line 
                  x1={xA} y1={yA} 
                  x2={xB} y2={yB} 
                  stroke={colors.primary} 
                  strokeWidth={2 + complexity/2} 
                />
              </g>
            );
          });
        })}
      </g>
    );
  };

  // Jerusalem十字
  const renderJerusalemCross = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const mainArmLength = 40 + complexity * 6;
    const mainArmWidth = 12 + complexity;
    const crossArmLength = 25 + complexity * 4;
    const crossArmWidth = 8 + complexity;
    const gap = 8 + f1;
    
    return (
      <g>
        {/* 主水平臂 */}
        <rect 
          x={centerX - mainArmLength/2} 
          y={centerY - mainArmWidth/2} 
          width={mainArmLength} 
          height={mainArmWidth} 
          fill={colors.primary} 
        />
        
        {/* 主垂直臂 */}
        <rect 
          x={centerX - mainArmWidth/2} 
          y={centerY - mainArmLength/2} 
          width={mainArmWidth} 
          height={mainArmLength} 
          fill={colors.primary} 
        />
        
        {/* 四个方向的十字臂 */}
        {[
          { x: centerX - mainArmLength/2 - crossArmLength + gap, y: centerY - crossArmWidth/2 }, // 左
          { x: centerX + mainArmLength/2 - gap, y: centerY - crossArmWidth/2 }, // 右
          { x: centerX - crossArmWidth/2, y: centerY - mainArmLength/2 - crossArmLength + gap }, // 上
          { x: centerX - crossArmWidth/2, y: centerY + mainArmLength/2 - gap } // 下
        ].map((pos, i) => (
          <rect 
            key={i}
            x={pos.x} 
            y={pos.y} 
            width={i < 2 ? crossArmLength : crossArmWidth} 
            height={i < 2 ? crossArmWidth : crossArmLength} 
            fill={colors.primary} 
          />
        ))}
      </g>
    );
  };

  // 渔网图案
  const renderFishnet = (complexity, f1, f2, f3, colors) => {
    const baseUnitSize = 120;
    const baseWireWidth = 20;
    const unitCount = 2 + complexity;
    const totalSize = baseUnitSize * unitCount;
    const centerX = totalSize / 2;
    const centerY = totalSize / 2;
    
    return (
      <g transform={`translate(${100 - centerX}, ${100 - centerY})`}>
        {/* 绘制每个单元的水平和垂直金属线 */}
        {Array.from({ length: unitCount }).map((_, row) => {
          return Array.from({ length: unitCount }).map((_, col) => {
            const xOffset = col * baseUnitSize;
            const yOffset = row * baseUnitSize;
            
            return (
              <g key={`unit-${row}-${col}`}>
                {/* 绘制水平金属线（在Y方向上下两侧） */}
                <rect
                  x={xOffset}
                  y={yOffset}
                  width={baseUnitSize}
                  height={baseWireWidth}
                  fill={colors.primary}
                  stroke={colors.primary}
                />
                <rect
                  x={xOffset}
                  y={yOffset + baseUnitSize - baseWireWidth}
                  width={baseUnitSize}
                  height={baseWireWidth}
                  fill={colors.primary}
                  stroke={colors.primary}
                />
                
                {/* 绘制垂直金属线（在X方向左右两侧） */}
                <rect
                  x={xOffset}
                  y={yOffset}
                  width={baseWireWidth}
                  height={baseUnitSize}
                  fill={colors.primary}
                  stroke={colors.primary}
                />
                <rect
                  x={xOffset + baseUnitSize - baseWireWidth}
                  y={yOffset}
                  width={baseWireWidth}
                  height={baseUnitSize}
                  fill={colors.primary}
                  stroke={colors.primary}
                />
              </g>
            );
          });
        })}
        
        {/* 根据对称性添加额外特征 */}
        {f1 > 5 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={baseUnitSize / 5}
            fill={colors.accent}
            stroke={colors.accent}
          />
        )}
        
        {/* 根据特征参数添加额外元素 */}
        {f2 > 5 && (
          <rect
            x={centerX - baseUnitSize}
            y={centerY - baseUnitSize}
            width={baseUnitSize * 2}
            height={baseUnitSize * 2}
            fill="none"
            stroke={colors.accent}
            strokeWidth={baseWireWidth / 2}
          />
        )}
      </g>
    );
  };

  // 分形结构
  const renderFractal = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const maxDepth = Math.min(complexity, 4);
    const initialSize = 70;
    
    // 递归绘制分形
    const drawFractal = (x, y, size, depth) => {
      if (depth > maxDepth) return null;
      
      const elements = [];
      
      // 绘制中心正方形
      elements.push(
        <rect 
          key={`${x}-${y}-${depth}`}
          x={x - size/2} 
          y={y - size/2} 
          width={size} 
          height={size} 
          fill={colors.primary} 
          stroke={colors.accent} 
          strokeWidth={2}
          opacity={0.8 - depth * 0.2}
        />
      );
      
      // 递归绘制四个角上的小分形
      if (depth < maxDepth) {
        const newSize = size / 3;
        const positions = [
          { x: x - size, y: y - size },
          { x: x + size, y: y - size },
          { x: x - size, y: y + size },
          { x: x + size, y: y + size }
        ];
        
        positions.forEach(pos => {
          elements.push(...drawFractal(pos.x, pos.y, newSize, depth + 1));
        });
      }
      
      return elements;
    };
    
    return <g>{drawFractal(centerX, centerY, initialSize, 0)}</g>;
  };

  // 谢尔宾斯基地毯
  const renderSierpinskiCarpet = (complexity, f1, f2, f3, colors) => {
    const size = 120;
    const level = Math.min(complexity, 3);
    
    const drawSierpinski = (x, y, size, level) => {
      if (level === 0) return null;
      
      const newSize = size / 3;
      const elements = [];
      
      // 中心空洞
      elements.push(
        <rect 
          key={`${x}-${y}`} 
          x={x + newSize} 
          y={y + newSize} 
          width={newSize} 
          height={newSize} 
          fill={colors.secondary} 
          stroke={colors.secondary} 
        />
      );
      
      // 递归绘制8个周边区域
      if (level > 1) {
        const positions = [
          [x, y], [x + newSize, y], [x + 2 * newSize, y],
          [x, y + newSize], [x + 2 * newSize, y + newSize],
          [x, y + 2 * newSize], [x + newSize, y + 2 * newSize], [x + 2 * newSize, y + 2 * newSize]
        ];
        
        positions.forEach(([posX, posY]) => {
          elements.push(...drawSierpinski(posX, posY, newSize, level - 1));
        });
      }
      
      return elements;
    };
    
    return (
      <g>
        <rect x="40" y="40" width={size} height={size} fill={colors.primary} />
        {drawSierpinski(40, 40, size, level)}
      </g>
    );
  };

  // 耶路撒冷十字架
  const renderJerusalemCrossVariant = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const centerSize = 40 + complexity * 4;
    const armLength = 60 + complexity * 6;
    const armWidth = 12 + complexity;
    const gap = 8 + f1;
    
    return (
      <g>
        {/* 中心方块 */}
        <rect 
          x={centerX - centerSize/2} 
          y={centerY - centerSize/2} 
          width={centerSize} 
          height={centerSize} 
          fill={colors.primary} 
          stroke={colors.accent} 
          strokeWidth={3}
        />
        
        {/* 四个方向的十字臂 */}
        {[
          { x: centerX - armWidth/2, y: centerY - centerSize/2 - armLength, width: armWidth, height: armLength }, // 上
          { x: centerX + centerSize/2, y: centerY - armWidth/2, width: armLength, height: armWidth }, // 右
          { x: centerX - armWidth/2, y: centerY + centerSize/2, width: armWidth, height: armLength }, // 下
          { x: centerX - centerSize/2 - armLength, y: centerY - armWidth/2, width: armLength, height: armWidth } // 左
        ].map((rect, i) => (
          <rect 
            key={i}
            x={rect.x} 
            y={rect.y} 
            width={rect.width} 
            height={rect.height} 
            fill={colors.primary} 
            stroke={colors.accent} 
            strokeWidth={3}
          />
        ))}
      </g>
    );
  };

  // 希腊十字
  const renderGreekCross = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const armLength = 40 + complexity * 6;
    const armWidth = 12 + complexity;
    
    return (
      <g>
        {/* 垂直臂 */}
        <rect 
          x={centerX - armWidth/2} 
          y={centerY - armLength} 
          width={armWidth} 
          height={armLength * 2} 
          fill={colors.primary} 
        />
        
        {/* 水平臂 */}
        <rect 
          x={centerX - armLength} 
          y={centerY - armWidth/2} 
          width={armLength * 2} 
          height={armWidth} 
          fill={colors.primary} 
        />
        
        {/* 装饰（如果复杂度高） */}
        {complexity > 3 && (
          <circle cx={centerX} cy={centerY} r={armWidth/2 + 4} fill={colors.accent} />
        )}
      </g>
    );
  };

  // 方形梯度
  const renderSquareGradient = (complexity, f1, f2, f3, colors) => {
    const n = 5;
    const period = 25;
    const centerIdx = (n - 1) / 2;
    const maxDist = 2 * centerIdx;
    
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          return Array.from({ length: n }).map((_, j) => {
            // 计算位置
            const x = 100 + (i - centerIdx) * period;
            const y = 100 + (j - centerIdx) * period;
            
            // 计算到中心的曼哈顿距离
            const distFromCenter = Math.abs(i - centerIdx) + Math.abs(j - centerIdx);
            
            // 计算尺寸（从中心向外渐变）
            const size = 18 - 12 * (distFromCenter / maxDist);
            
            // 计算不透明度
            const opacity = 0.8 - 0.6 * (distFromCenter / maxDist);
            
            return (
              <rect
                key={`${i}-${j}`}
                x={x - size/2}
                y={y - size/2}
                width={size}
                height={size}
                fill={colors.primary}
                opacity={opacity}
                stroke={colors.accent}
                strokeWidth={2}
              />
            );
          });
        })}
      </g>
    );
  };

  // 特殊十字
  const renderSpecialCross = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const branchLength = 50 + 6 * complexity;
    const branchWidth = 6 + complexity;
    const secondaryRatio = 0.4 + 0.2 * f2 / 10;
    const secondaryLength = branchLength * secondaryRatio;
    const secondaryWidth = branchWidth * 0.7;
    const centerSize = 8 + f3;
    
    return (
      <g>
        {/* 主分支 */}
        <line x1={centerX} y1={centerY} x2={centerX} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX + branchLength} y2={centerY} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        <line x1={centerX} y1={centerY} x2={centerX - branchLength} y2={centerY} 
              stroke={colors.primary} strokeWidth={branchWidth} />
        
        {/* 次级分支 */}
        <line x1={centerX} y1={centerY + branchLength} x2={centerX + secondaryLength} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY + branchLength} x2={centerX - secondaryLength} y2={centerY + branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY - branchLength} x2={centerX + secondaryLength} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX} y1={centerY - branchLength} x2={centerX - secondaryLength} y2={centerY - branchLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX + branchLength} y1={centerY} x2={centerX + branchLength} y2={centerY + secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX + branchLength} y1={centerY} x2={centerX + branchLength} y2={centerY - secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX - branchLength} y1={centerY} x2={centerX - branchLength} y2={centerY + secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        <line x1={centerX - branchLength} y1={centerY} x2={centerX - branchLength} y2={centerY - secondaryLength} 
              stroke={colors.primary} strokeWidth={secondaryWidth} />
        
        {/* 中心点 */}
        <circle cx={centerX} cy={centerY} r={centerSize} fill="gold" stroke="black" />
        
        {/* 额外分支（如果复杂度高） */}
        {complexity > 3 && f3 > 7 && (
          [...Array(4)].map((_, i) => {
            const angle = 45 + i * 90;
            const tertiaryLength = branchLength * 0.3;
            const endX = centerX + tertiaryLength * Math.cos(angle * Math.PI / 180);
            const endY = centerY + tertiaryLength * Math.sin(angle * Math.PI / 180);
            return (
              <line key={i} x1={centerX} y1={centerY} x2={endX} y2={endY} 
                    stroke={colors.primary} strokeWidth={branchWidth * 0.5} />
            );
          })
        )}
      </g>
    );
  };

  // 圆形谐振环
const renderCircularResonator = (complexity, f1, f2, f3, colors) => {
  const outerRadius = 50 + complexity * 4;
  const innerRadius = 35 + complexity * 3;
  const thickness = 10 + complexity;
  const gapSize = 15; // 缺口大小
  
  // 计算大圆缺口的位置（顶部，角度0度）
  const outerGapStartAngle = -gapSize/2; // -7.5度
  const outerGapEndAngle = gapSize/2; // 7.5度
  
  // 计算小圆缺口的位置（底部，角度180度）
  const innerGapStartAngle = 180 - gapSize/2; // 172.5度
  const innerGapEndAngle = 180 + gapSize/2; // 187.5度
  
  // 将角度转换为弧度
  const toRadians = (angle) => angle * Math.PI / 180;
  
  // 计算圆弧上的点坐标
  const pointOnCircle = (cx, cy, radius, angle) => {
    const rad = toRadians(angle);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };
  
  // 生成带缺口的圆形路径
  const createGappedCirclePath = (cx, cy, radius, gapStartAngle, gapEndAngle) => {
    // 计算缺口开始和结束点的坐标
    const gapStart = pointOnCircle(cx, cy, radius, gapStartAngle);
    const gapEnd = pointOnCircle(cx, cy, radius, gapEndAngle);
    
    // 创建路径
    return `
      M ${gapEnd.x} ${gapEnd.y}
      A ${radius} ${radius} 0 1 1 ${gapStart.x} ${gapStart.y}
    `;
  };
  
  return (
    <g>
      {/* 外环 - 顶部有缺口 */}
      <path
        d={createGappedCirclePath(100, 100, outerRadius, outerGapStartAngle, outerGapEndAngle)}
        fill="none"
        stroke={colors.primary}
        strokeWidth={thickness}
      />
      
      {/* 内环 - 底部有缺口 */}
      <path
        d={createGappedCirclePath(100, 100, innerRadius, innerGapStartAngle, innerGapEndAngle)}
        fill="none"
        stroke={colors.primary}
        strokeWidth={thickness/2}
      />
    </g>
  );
};

  // 双C开口图案
  const renderDoubleCOpening = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const size = 50 + complexity * 6;
    const halfSize = size / 2;
    const gapSize = size / 2;
    const lineWidth = 8 + complexity;
    
    // 左侧C型（开口向左朝外）
    const leftCenterX = centerX - halfSize;
    
    // 右侧C型（开口向右朝外）
    const rightCenterX = centerX + halfSize;
    
    return (
      <g>
        {/* 左侧C型（开口向左朝外） */}
        {/* 上横线（缩短一半，从中心到右侧） */}
        <line 
          x1={leftCenterX} 
          y1={centerY + halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 下横线（缩短一半，从中心到右侧） */}
        <line 
          x1={leftCenterX} 
          y1={centerY - halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY - halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 右侧竖线（完整） */}
        <line 
          x1={leftCenterX + halfSize} 
          y1={centerY - halfSize} 
          x2={leftCenterX + halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 左侧开口线（与缩短线连接） */}
        <line 
          x1={leftCenterX} 
          y1={centerY - halfSize} 
          x2={leftCenterX} 
          y2={centerY - gapSize/2} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        <line 
          x1={leftCenterX} 
          y1={centerY + gapSize/2} 
          x2={leftCenterX} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        
        {/* 右侧C型（开口向右朝外） */}
        {/* 上横线（缩短一半，从中心到左侧） */}
        <line 
          x1={rightCenterX} 
          y1={centerY + halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 下横线（缩短一半，从中心到左侧） */}
        <line 
          x1={rightCenterX} 
          y1={centerY - halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY - halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 左侧竖线（完整） */}
        <line 
          x1={rightCenterX - halfSize} 
          y1={centerY - halfSize} 
          x2={rightCenterX - halfSize} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        {/* 右侧开口线（与缩短线连接） */}
        <line 
          x1={rightCenterX} 
          y1={centerY - halfSize} 
          x2={rightCenterX} 
          y2={centerY - gapSize/2} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
        <line 
          x1={rightCenterX} 
          y1={centerY + gapSize/2} 
          x2={rightCenterX} 
          y2={centerY + halfSize} 
          stroke={colors.primary} 
          strokeWidth={lineWidth} 
        />
      </g>
    );
  };

  // 旋转三角形
  const renderRotatingTriangles = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const numTriangles = 3 + Math.floor(complexity / 2);
    const size = 40 + complexity * 4;
    const gap = 15 + f2;
    
    return (
      <g>
        {Array.from({ length: numTriangles }).map((_, i) => {
          const angle = (i * 360 / numTriangles + f1 * 3.6) * Math.PI / 180;
          const halfAngle = ((360 / numTriangles - gap) / 2) * Math.PI / 180;
          
          // 计算三角形的三个顶点
          const x1 = centerX;
          const y1 = centerY;
          
          const x2 = centerX + size * Math.cos(angle - halfAngle);
          const y2 = centerY + size * Math.sin(angle - halfAngle);
          
          const x3 = centerX + size * Math.cos(angle + halfAngle);
          const y3 = centerY + size * Math.sin(angle + halfAngle);
          
          return (
            <polygon
              key={i}
              points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
              fill={colors.primary}
              stroke={colors.accent}
              strokeWidth={3}
              opacity={0.7 + i * 0.1}
            />
          );
        })}
      </g>
    );
  };

  // 光子晶体结构
  const renderPhotonicCrystal = (complexity, f1, f2, f3, colors) => {
    const n = 3 + Math.floor(complexity / 2);
    const a = 100 / n;
    const rodRadius = 8 + complexity;
    
    return (
      <g>
        {/* 创建方形晶格 */}
        {Array.from({ length: n }).map((_, i) => {
          return Array.from({ length: n }).map((_, j) => {
            const x = 100 + a * (i - (n-1)/2);
            const y = 100 + a * (j - (n-1)/2);
            
            return (
              <circle
                key={`${i}-${j}`}
                cx={x}
                cy={y}
                r={rodRadius}
                fill={colors.primary}
                stroke={colors.accent}
                strokeWidth={3}
              />
            );
          });
        })}
      </g>
    );
  };

  // 嵌套方框
  const renderNestedSquares = (complexity, f1, f2, f3, colors) => {
    const centerX = 100;
    const centerY = 100;
    const maxSize = 90;
    const squaresCount = 3 + complexity;
    
    return (
      <g>
        {Array.from({ length: squaresCount }).map((_, i) => {
          const size = maxSize - (i * maxSize / squaresCount);
          return (
            <rect 
              key={i}
              x={centerX - size/2} 
              y={centerY - size/2} 
              width={size} 
              height={size} 
              fill="none" 
              stroke={colors.primary} 
              strokeWidth={3 + i} 
            />
          );
        })}
      </g>
    );
  };

  // 彭罗斯轮廓
  const renderPenroseOutline = (complexity, f1, f2, f3, colors) => {
    // 简化的彭罗斯轮廓实现
    const centerX = 100;
    const centerY = 100;
    const size = 40 + complexity * 6;
    const triangles = [];
    
    // 生成五角星形状的初始三角形
    for (let i = 0; i < 5; i++) {
      const angle1 = (i * 72 + f1 * 3.6) * Math.PI / 180;
      const angle2 = ((i + 1) * 72 + f1 * 3.6) * Math.PI / 180;
      
      const x1 = centerX + size * Math.cos(angle1);
      const y1 = centerY + size * Math.sin(angle1);
      
      const x2 = centerX + size * Math.cos(angle2);
      const y2 = centerY + size * Math.sin(angle2);
      
      triangles.push(
        <polygon
          key={i}
          points={`${centerX},${centerY} ${x1},${y1} ${x2},${y2}`}
          fill="none"
          stroke={colors.primary}
          strokeWidth={4 + complexity/2}
        />
      );
    }
    
    return <g>{triangles}</g>;
  };

  // 根据图案类型选择渲染函数
  const renderPattern = (conf) => {
    switch(conf.patternType) {
      case 0:
        return renderSquareSpiral(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 1:
        return renderChiralAuxetic(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 2:
        return renderMultiSquareResonator(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 3:
        return renderSquareResonator(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 4:
        return renderDiracCone(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 5:
        return renderJerusalemCross(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 6:
        return renderFishnet(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 7:
        return renderFractal(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 8:
        return renderSierpinskiCarpet(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 9:
        return renderJerusalemCrossVariant(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 10:
        return renderGreekCross(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 11:
        return renderSquareGradient(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 12:
        return renderSpecialCross(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 13:
        return renderCircularResonator(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 14:
        return renderDoubleCOpening(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 15:
        return renderRotatingTriangles(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 16:
        return renderPhotonicCrystal(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 17:
        return renderNestedSquares(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      case 18:
        return renderPenroseOutline(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
      default:
        return renderSquareSpiral(conf.complexity, conf.feature1, conf.feature2, conf.feature3, conf.colors);
    }
  };

  // 根据名字缩写长度确定布局
  const getLayout = () => {
    // // 如果 initials 是2个字母，使用2x2布局
    // if (initials && initials.length === 2) {
    //   return "2x2";
    // }
    // // 如果 initials 是3个字母，使用2x2布局（最后一个位置留空）
    // if (initials && initials.length === 3) {
    //   return "2x3";
    // }
    // // 如果 initials 是4个字母，使用2x2布局
    // if (initials && initials.length === 4) {
    //   return "3x3";
    // }
    // 否则使用配置的布局
    return "3x3";
  };

  // 解析布局字符串，如 "2x3"
  const parseLayout = () => {
    const effectiveLayout = getLayout();
    const [rows, cols] = effectiveLayout.split('x').map(Number);
    return { rows: rows || 1, cols: cols || 1, total: (rows || 1) * (cols || 1) };
  };

  // 渲染基元图案网格
const renderPatternGrid = () => {
  const { rows, cols, total } = parseLayout();
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '10px',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      {Array.from({ length: total }, (_, index) => (
        <div key={index} style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible'
        }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
            style={{ 
              transform: `rotate(${rotation}deg)`
            }}
          >
            {renderPattern(designConfig[index])}
          </svg>
        </div>
      ))}
    </div>
  );
};

return (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <div 
      ref={logoRef}
      style={{
        display: 'inline-block',
        backgroundColor: colors.secondary,
        padding: '10px', // 增加内边距
        borderRadius: '8px',
        marginBottom: '10px',
        width: '450px',
        height: '450px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        overflow: 'visible' // 确保内容不被裁剪
      }}
    >
      {/* 基元图案网格 */}
      <div style={{ 
        width: '350px', // 调整为容器大小
        height: '350px', // 调整为容器大小
        boxSizing: 'border-box',
        overflow: 'visible' // 确保内容不被裁剪
      }}>
        {renderPatternGrid()}
      </div>
      
      {/* 底部文本 */}
      <div style={{ 
        marginTop: '10px', // 增加上边距
        color: colors.accent,
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        {footerText}
      </div>
    </div>
  </div>
);

};

export default LogoPreview;