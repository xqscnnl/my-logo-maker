'use client';

import { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';

const LogoPreview = ({ designConfig }) => {
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
    shape = {1: 'circle'}, 
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
      link.download = `bionic-logo.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  if (!isClient) {
    return <div>正在准备Logo预览...</div>;
  }

  // 根据形状生成不同的SVG路径
  const renderShape = (index = 1, fillColor = colors.primary) => {
    const size = 40; // 单个基元的大小
    const center = size / 2;

    console.log(index);
    
    switch(shape[index]) {
      case 'circle':
        return <circle cx={center} cy={center} r={center - 2} fill={fillColor} />;
      case 'square':
        return <rect x="2" y="2" width={size - 4} height={size - 4} fill={fillColor} rx="4" />;
      case 'triangle':
        return <polygon 
          points={`${center},2 ${size - 2},${size - 2} 2,${size - 2}`} 
          fill={fillColor} 
        />;
      case 'heart':
        return <path 
          d={`M${center},${center - 8} C${center + 12},${center - 16} ${center + 16},${center - 4} ${center},${center + 8} C${center - 16},${center - 4} ${center - 12},${center - 16} ${center},${center - 8}`} 
          fill={fillColor} 
        />;
      case 'star':
        return <path 
          d={`M${center},2 L${center + 4},${center - 4} L${center + 8},${center - 2} L${center + 6},${center + 2} L${center + 8},${center + 6} L${center},${center + 4} L${center - 8},${center + 6} L${center - 6},${center + 2} L${center - 8},${center - 2} L${center - 4},${center - 4} Z`} 
          fill={fillColor} 
        />;
      case 'diamond':
        return <polygon 
          points={`${center},2 ${size - 2},${center} ${center},${size - 2} 2,${center}`} 
          fill={fillColor} 
        />;
      case 'pentagon':
        return <polygon 
          points={`${center},2 ${size - 2},${center - 4} ${size - 4},${size - 2} 4,${size - 2} 2,${center - 4}`} 
          fill={fillColor} 
        />;
      case 'hexagon':
        return <polygon 
          points={`${center - 8},2 ${center + 8},2 ${size - 2},${center} ${center + 8},${size - 2} ${center - 8},${size - 2} 2,${center}`} 
          fill={fillColor} 
        />;
      case 'cloud':
        return <path 
          d={`M${center - 10},${center} C${center - 12},${center - 6} ${center - 8},${center - 10} ${center},${center - 10} C${center + 8},${center - 10} ${center + 12},${center - 6} ${center + 10},${center} C${center + 14},${center} ${center + 16},${center + 4} ${center + 12},${center + 8} C${center + 8},${center + 12} ${center + 4},${center + 14} ${center},${center + 14} C${center - 4},${center + 14} ${center - 8},${center + 12} ${center - 12},${center + 8} C${center - 16},${center + 4} ${center - 14},${center} ${center - 10},${center} Z`} 
          fill={fillColor} 
        />;
      case 'leaf':
        return <path 
          d={`M${center},2 C${center - 4},${center - 4} ${center - 12},${center - 6} ${center - 14},${center} C${center - 16},${center + 6} ${center - 10},${center + 12} ${center},${size - 2} C${center + 10},${center + 12} ${center + 16},${center + 6} ${center + 14},${center} C${center + 12},${center - 6} ${center + 4},${center - 4} ${center},2 Z`} 
          fill={fillColor} 
        />;
      case 'moon':
        return <path 
          d={`M${center},2 C${center + 8},2 ${center + 14},8 ${center + 14},${center} C${center + 14},${center + 8} ${center + 8},${size - 2} ${center},${size - 2} C${center - 4},${size - 2} ${center - 8},${size - 6} ${center - 8},${center} C${center - 8},${center - 6} ${center - 4},2 ${center},2 Z`} 
          fill={fillColor} 
        />;
      case 'snowflake':
        return <path 
          d={`M${center},2 L${center},${size - 2} M${center - 8},${center - 8} L${center + 8},${center + 8} M${center - 8},${center + 8} L${center + 8},${center - 8} M2,${center} L${size - 2},${center}`} 
          stroke={fillColor} 
          strokeWidth="2" 
          fill="none" 
        />;
      default:
        return <circle cx={center} cy={center} r={center - 2} fill={fillColor} />;
    }
  };

  // 解析布局字符串，如 "2x3"
  const parseLayout = () => {
    const [rows, cols] = layout.split('x').map(Number);
    return { rows, cols, total: rows * cols };
  };

  // 渲染基元图案网格
  const renderPatternGrid = () => {
    const { rows, cols, total } = parseLayout();
    const cellSize = 200 / Math.max(rows, cols); // 根据行列数调整单元格大小
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '8px',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyItems: 'center'
      }}>
        {Array.from({ length: total }, (_, index) => (
          <div key={index} style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <svg width={cellSize} height={cellSize} viewBox={`0 0 40 40`}>
              {renderShape(index)}
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
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
          width: '250px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* 基元图案网格 */}
        <div style={{ width: '200px', height: '200px' }}>
          {renderPatternGrid()}
        </div>
        
        {/* 底部文本 */}
        <div style={{ 
          marginTop: '10px',
          color: colors.accent,
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {footerText}
        </div>
      </div>
      
      <div>
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownload}
            size="large"
          >
            下载Logo
          </Button>
        </Space>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>布局: {layout} | 形状: {shape}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.primary,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            主色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.secondary,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            背景色
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colors.accent,
              marginRight: '5px',
              borderRadius: '3px'
            }}></div>
            强调色
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;
