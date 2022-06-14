import { Button, ButtonProps } from "react-native-elements";

// Curently just exports the react-native-elements button
// but gives a single place to change button styles
// and functionality in the future
const IdemButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;asdasdsad
};

export default IdemButton;
