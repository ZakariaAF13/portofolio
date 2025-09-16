import React, { useState, useRef, useCallback } from 'react';
import { FiZoomIn, FiZoomOut, FiRotateCw, FiCheck, FiX, FiMove } from 'react-icons/fi';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    drawCanvas();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context
    ctx.save();

    // Move to center
    ctx.translate(size / 2, size / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply zoom
    const imageEl = image as HTMLImageElement;
    const scaledWidth = imageEl.naturalWidth * zoom;
    const scaledHeight = imageEl.naturalHeight * zoom;

    ctx.drawImage(
      imageEl,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    // Restore context
    ctx.restore();

    // Draw crop overlay (guides) on the visible canvas only (DO NOT bake into export)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const cropSize = Math.min(size * 0.8, size * 0.8);
    const cropX = (size - cropSize) / 2;
    const cropY = (size - cropSize) / 2;
    ctx.strokeRect(cropX, cropY, cropSize, cropSize);
    // Darken outside area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, size, cropY); // top
    ctx.fillRect(0, cropY + cropSize, size, size - cropY - cropSize); // bottom
    ctx.fillRect(0, cropY, cropX, cropSize); // left
    ctx.fillRect(cropX + cropSize, cropY, size - cropX - cropSize, cropSize); // right
  }, [zoom, rotation, position, imageLoaded]);

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.01 : 0.01;
    setZoom(prev => Math.max(0.1, Math.min(5, prev + delta)));
  };

  // Touch events for mobile pinch zoom
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && lastTouchDistance) {
      // Pinch to zoom
      const distance = getTouchDistance(e.touches);
      if (distance) {
        const zoomChange = distance / lastTouchDistance;
        setZoom(prev => Math.max(0.1, Math.min(5, prev * zoomChange)));
        setLastTouchDistance(distance);
      }
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.01, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.01, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleCrop = () => {
    const image = imageRef.current;
    if (!image) return;

    // Render the transformed image to an OFFSCREEN canvas WITHOUT overlays
    const size = 300;
    const cleanCanvas = document.createElement('canvas');
    cleanCanvas.width = size;
    cleanCanvas.height = size;
    const cleanCtx = cleanCanvas.getContext('2d');
    if (!cleanCtx) return;

    // draw transformed image (same logic as drawCanvas, but without overlay guides)
    cleanCtx.save();
    cleanCtx.translate(size / 2, size / 2);
    cleanCtx.rotate((rotation * Math.PI) / 180);
    const imageEl = image as HTMLImageElement;
    const scaledWidth = imageEl.naturalWidth * zoom;
    const scaledHeight = imageEl.naturalHeight * zoom;
    cleanCtx.drawImage(
      imageEl,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );
    cleanCtx.restore();

    // Define crop area (same as visible guides)
    const cropSize = Math.min(size * 0.8, size * 0.8);
    const cropX = (size - cropSize) / 2;
    const cropY = (size - cropSize) / 2;

    // Create a canvas for the cropped output
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropSize;
    cropCanvas.height = cropSize;
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Extract from clean (overlay-free) render
    const imageData = cleanCtx.getImageData(cropX, cropY, cropSize, cropSize);
    cropCtx.putImageData(imageData, 0, 0);

    // Return base64 data URL (JPEG) to store directly in Firestore
    const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(dataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Crop Profile Photo</h3>
        
        {/* Hidden image for loading */}
        <img
          ref={imageRef}
          src={imageSrc}
          onLoad={handleImageLoad}
          className="hidden"
          alt="Source"
        />

        {/* Canvas for cropping */}
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRotate}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Rotate"
          >
            <FiRotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={resetTransform}
            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-xs px-3"
            title="Reset"
          >
            Reset
          </button>
        </div>

        {/* Zoom slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMove className="inline mr-1" />
            Zoom: {Math.round(zoom * 100)}% 
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-600 mb-4 text-center">
          Drag to move • Mouse wheel/pinch to zoom • Use controls above
        </p>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCrop}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            Apply Crop
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <FiX className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
