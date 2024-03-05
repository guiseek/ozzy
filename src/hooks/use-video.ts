const useVideo = () => {
  const video = document.createElement("video");

  return new Promise<HTMLVideoElement>((resolve) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.autoplay = true;
      video.srcObject = stream;
      video.onloadeddata = () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;

        resolve(video);
      };
    });
  });
};

export { useVideo }