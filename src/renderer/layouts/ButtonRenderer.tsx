import React from 'react';
import { LayoutButtonInfo, ConsoleLayoutProps } from './types';

interface SVGButtonProps {
  button: LayoutButtonInfo;
  isPressed: boolean;
  isSelectedForRemap: boolean;
  dualLabelEnabled: boolean;
  staticCheatSheet: boolean;
  theme: ConsoleLayoutProps['theme'];
  onClick?: () => void;
}

export const SVGButton: React.FC<SVGButtonProps> = ({
  button,
  isPressed,
  isSelectedForRemap,
  dualLabelEnabled,
  staticCheatSheet,
  theme,
  onClick,
}) => {
  const active = !staticCheatSheet && isPressed;

  // Theme color overrides
  const isCustomTheme = theme.id !== 'original' && theme.customColors;
  const baseBg = isCustomTheme ? theme.customColors!.background : button.color || '#334155';
  const baseBorder = isCustomTheme ? theme.customColors!.border : '#64748b';
  const baseText = isCustomTheme ? theme.customColors!.text : button.textColor || '#ffffff';
  const glowColor = isCustomTheme ? theme.customColors!.pressedGlow : '#38bdf8';

  const strokeColor = isSelectedForRemap ? '#f59e0b' : active ? glowColor : baseBorder;
  const fillColor = active ? (isCustomTheme ? glowColor : button.color || '#3b82f6') : baseBg;
  const filterStyle = active
    ? `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`
    : isSelectedForRemap
    ? 'drop-shadow(0 0 8px #f59e0b)'
    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';

  const transformStyle = active ? 'scale(0.94)' : 'scale(1)';

  // Render PlayStation geometric symbol
  const renderPSSymbol = (symbol: LayoutButtonInfo['psSymbol']) => {
    switch (symbol) {
      case 'cross':
        return (
          <path
            d="M -7 -7 L 7 7 M 7 -7 L -7 7"
            stroke={baseText}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        );
      case 'circle':
        return (
          <circle
            cx="0"
            cy="0"
            r="7.5"
            stroke={baseText}
            strokeWidth="3"
            fill="none"
          />
        );
      case 'square':
        return (
          <rect
            x="-6.5"
            y="-6.5"
            width="13"
            height="13"
            rx="1.5"
            stroke={baseText}
            strokeWidth="3"
            fill="none"
          />
        );
      case 'triangle':
        return (
          <polygon
            points="0,-8 8,7 -8,7"
            stroke={baseText}
            strokeWidth="3"
            strokeLinejoin="round"
            fill="none"
          />
        );
      default:
        return null;
    }
  };

  // Render C-button triangle arrow
  const renderCDirection = (dir?: 'up' | 'down' | 'left' | 'right') => {
    switch (dir) {
      case 'up':
        return <polygon points="0,-4 -4,3 4,3" fill="#1e293b" />;
      case 'down':
        return <polygon points="0,4 -4,-3 4,-3" fill="#1e293b" />;
      case 'left':
        return <polygon points="-4,0 3,-4 3,4" fill="#1e293b" />;
      case 'right':
        return <polygon points="4,0 -3,-4 -3,4" fill="#1e293b" />;
      default:
        return null;
    }
  };

  return (
    <g
      transform={`translate(${button.x}, ${button.y})`}
      className={`cursor-pointer transition-transform duration-75 select-none`}
      style={{
        transformOrigin: `${button.x}px ${button.y}px`,
        filter: filterStyle,
      }}
      onClick={onClick}
    >
      <g style={{ transform: transformStyle }}>
        {/* Button Shapes */}
        {button.shape === 'kidney-x' && (
          // Gamecube X button (curved bean right side of A)
          <path
            d="M -6,-20 C 14,-15 16,15 -6,20 C 2,12 2,-12 -6,-20 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {button.shape === 'kidney-y' && (
          // Gamecube Y button (curved bean top side of A)
          <path
            d="M -20,-6 C -15,14 15,16 20,-6 C 12,2 -12,2 -20,-6 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {button.shape === 'pill' && (
          // Shoulder / Start / Select pill
          <rect
            x={-(button.width || 44) / 2}
            y={-(button.height || 22) / 2}
            width={button.width || 44}
            height={button.height || 22}
            rx={(button.height || 22) / 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {button.shape === 'trigger' && (
          // Shoulder trigger curved
          <rect
            x={-(button.width || 56) / 2}
            y={-(button.height || 26) / 2}
            width={button.width || 56}
            height={button.height || 26}
            rx="8"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {button.shape === 'oval' && (
          // Oval shape (GameCube Z, Sega Saturn Z)
          <ellipse
            cx="0"
            cy="0"
            rx={(button.width || 40) / 2}
            ry={(button.height || 24) / 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {(!button.shape || button.shape === 'circle' || button.shape === 'c-button') && (
          // Standard circular button
          <circle
            cx="0"
            cy="0"
            r={(button.width || 38) / 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={button.shape === 'c-button' ? '2.5' : '3'}
          />
        )}

        {/* Content: PS Symbol, C-direction or Text Label */}
        {button.psSymbol ? (
          renderPSSymbol(button.psSymbol)
        ) : button.shape === 'c-button' ? (
          <g>
            <text
              x={button.cDirection === 'left' ? 2 : button.cDirection === 'right' ? -2 : 0}
              y={button.cDirection === 'up' ? 5 : button.cDirection === 'down' ? -3 : 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={baseText}
              fontSize="11"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              C
            </text>
            <g transform={`translate(${
              button.cDirection === 'up' ? '0, -7' :
              button.cDirection === 'down' ? '0, 7' :
              button.cDirection === 'left' ? '-7, 0' : '7, 0'
            })`}>
              {renderCDirection(button.cDirection)}
            </g>
          </g>
        ) : (
          <text
            x="0"
            y={dualLabelEnabled && button.subLabel ? -3 : 0}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={baseText}
            fontSize={
              button.label.length > 3
                ? '11'
                : button.label.length > 2
                ? '13'
                : (button.width || 38) > 42
                ? '17'
                : '15'
            }
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            {button.label}
          </text>
        )}

        {/* Dual-Label Badge: small hint of physical controller button */}
        {dualLabelEnabled && button.subLabel && (
          <g transform={`translate(0, ${button.shape === 'pill' || button.shape === 'trigger' ? 6 : 8})`}>
            <rect
              x="-11"
              y="-5"
              width="22"
              height="10"
              rx="4"
              fill="#090d16"
              fillOpacity="0.85"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            <text
              x="0"
              y="0.5"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#38bdf8"
              fontSize="7.5"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              {button.subLabel}
            </text>
          </g>
        )}
      </g>
    </g>
  );
};
