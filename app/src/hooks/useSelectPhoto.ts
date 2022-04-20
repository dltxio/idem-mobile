import * as React from "react";
import * as ImagePicker from "expo-image-picker";

const useSelectPhoto = (imageOptions: ImagePicker.ImagePickerOptions) => {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const selectPhotoFromCameraRoll = React.useCallback(() => {
    return ImagePicker.launchImageLibraryAsync(imageOptions);
  }, [imageOptions]);

  const selectPhotoFromCamera = React.useCallback(async () => {
    const hasPermission = !!status?.granted;

    if (!hasPermission) {
      const newHasPermission = (await requestPermission()).granted;
      if (newHasPermission) {
        return;
      }
    }

    return ImagePicker.launchCameraAsync(imageOptions);
  }, [status, imageOptions, requestPermission]);

  return React.useMemo(
    () => ({
      selectPhotoFromCameraRoll,
      selectPhotoFromCamera
    }),
    [selectPhotoFromCameraRoll, selectPhotoFromCamera]
  );
};

export default useSelectPhoto;
