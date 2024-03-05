const getImageData = (
  ctx: CanvasRenderingContext2D,
  image: HTMLVideoElement,
  useCache = false,
  imageCache?: ImageData
) => {
  if (useCache && imageCache) return imageCache;

  const w = image.videoWidth;
  const h = image.videoHeight;

  ctx.canvas.width = w;
  ctx.canvas.height = h;

  ctx.translate(w, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(image, 0, 0);
  imageCache = ctx.getImageData(0, 0, w, h);

  return imageCache;
};

export { getImageData };
