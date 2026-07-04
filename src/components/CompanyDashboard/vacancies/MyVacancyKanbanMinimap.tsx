import React from 'react';

interface MyVacancyKanbanMinimapProps {
  stages: string[];
  isFetchingApplicants: boolean;
  isDraggingMinimap: boolean;
  activeColumnIndex: number;
  hasMovedRef: React.MutableRefObject<boolean>;
  onMinimapMouseDown: (event: React.MouseEvent) => void;
  onScrollToColumn: (columnIndex: number) => void;
}

export const MyVacancyKanbanMinimap: React.FC<MyVacancyKanbanMinimapProps> = ({
  stages,
  isFetchingApplicants,
  isDraggingMinimap,
  activeColumnIndex,
  hasMovedRef,
  onMinimapMouseDown,
  onScrollToColumn,
}) => {
  if (stages.length <= 1 || isFetchingApplicants) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[80] select-none cursor-ew-resize">
      <div
        onMouseDown={onMinimapMouseDown}
        className={`backdrop-blur-xl rounded-full px-3 py-2 flex items-center gap-1.5 border transition-all duration-300 ${
          isDraggingMinimap
            ? 'bg-white border-[#940dff]/40 shadow-[0_16px_40px_rgba(148,13,255,0.16)] scale-105'
            : 'bg-white/90 border-white/80 shadow-[0_14px_34px_rgba(38,28,65,0.10)] hover:border-[#940dff]/20'
        }`}
      >
        {stages.map((stageName, columnIndex) => {
          const isActive = columnIndex === activeColumnIndex;
          return (
            <button
              key={`${stageName}-${columnIndex}`}
              type="button"
              onClick={() => {
                if (!hasMovedRef.current) {
                  onScrollToColumn(columnIndex);
                }
              }}
              className={`h-8 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer select-none outline-none text-[11px] font-semibold ${
                isActive
                  ? 'w-24 bg-[#940dff] text-white shadow-md shadow-[#940dff]/20'
                  : 'w-8 bg-[#f8f6ff] text-slate-400 hover:text-[#940dff] hover:bg-[#940dff]/10'
              }`}
              title={`Ir para: ${stageName}`}
            >
              {isActive ? <span className="truncate px-2">{stageName}</span> : columnIndex + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
