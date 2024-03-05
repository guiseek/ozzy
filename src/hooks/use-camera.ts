import { PerspectiveCamera } from "three";

const useCamera = () => {
  const fov = 45;
  const aspect = innerWidth / innerHeight;

  const camera = new PerspectiveCamera(fov, aspect, 0.1, 10000);
  camera.position.set(0, 0, 900);
  camera.lookAt(0, 0, 0);

  return camera;
};

export { useCamera };
