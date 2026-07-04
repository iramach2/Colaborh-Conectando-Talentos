import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Cropper from 'react-easy-crop';
import type { CropPoint, PixelCrop } from '../../hooks/useCandidateProfilePhotoCrop';

interface CandidatePhotoCropModalProps {
  imageToCrop: string | null;
  crop: CropPoint;
  zoom: number;
  onCropChange: (crop: CropPoint) => void;
  onCropComplete: (croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => void;
  onZoomChange: (zoom: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const CandidatePhotoCropModal = ({
  imageToCrop,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
  onCancel,
  onConfirm,
}: CandidatePhotoCropModalProps) => (
  <AnimatePresence>
    {imageToCrop && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white w-full max-w-3xl h-[80vh] rounded-xl flex flex-col overflow-hidden"
        >
          <div className="p-8 flex justify-between items-center border-b border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900">Ajuste sua foto</h3>
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 relative bg-slate-200">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div className="p-10 bg-white">
            <div className="flex items-center gap-6 mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => onZoomChange(Number(event.target.value))}
                className="flex-1 accent-primary-600"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={onCancel} className="px-8 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-full font-bold uppercase tracking-widest text-[10px] transition-colors cursor-pointer border-0 bg-transparent">
                Cancelar
              </button>
              <button onClick={onConfirm} className="px-12 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg shadow-primary-500/20 transition-all cursor-pointer border-0">
                Confirmar e Salvar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
