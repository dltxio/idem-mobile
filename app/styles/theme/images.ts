import { Asset } from "expo-asset";
import LogoSvg from "../../assets/images/logo.svg";
import LogoPng from "../../assets/images/logo.png";
import ObjectType from "../../types/objectType";

export const svgs: ObjectType = {
  logo: LogoSvg,
};

export const images: ObjectType = {
  logo: LogoPng,
};

// Asset preloading.
export const imageAssets = Object.keys(images).map((key) =>
  Asset.fromModule(images[key]).downloadAsync(),
);
