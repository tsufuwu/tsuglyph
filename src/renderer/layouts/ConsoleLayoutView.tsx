import React from 'react';
import { ConsoleLayoutProps } from './types';
import { getLayoutButtons } from './layoutDefinitions';
import { SVGButton } from './ButtonRenderer';

export const ConsoleLayoutView: React.FC<ConsoleLayoutProps> = ({
  layoutId,
  isCompact,
  showShoulders,
  dualLabelEnabled,
  physicalLayout,
  staticCheatSheet,
  activeButtons,
  theme,
  scale = 1.0,
  onButtonClick,
  selectedButtonForRemap,
}) => {
  const { buttons, viewBox, width, height } = getLayoutButtons(
    layoutId,
    isCompact,
    showShoulders,
    physicalLayout
  );

  return (
    <div
      className="inline-block transition-transform duration-75 select-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        className="overflow-visible"
      >
        {buttons.map((btn) => {
          const isPressed = activeButtons.has(btn.id);
          const isSelected = selectedButtonForRemap === btn.id;

          return (
            <SVGButton
              key={btn.id}
              button={btn}
              isPressed={isPressed}
              isSelectedForRemap={isSelected}
              dualLabelEnabled={dualLabelEnabled}
              staticCheatSheet={staticCheatSheet}
              theme={theme}
              onClick={() => onButtonClick && onButtonClick(btn.id)}
            />
          );
        })}
      </svg>
    </div>
  );
};
