import { Button, ButtonProps } from "@rneui/themed";

// Curently just exports the r@rneui/themed button
// but gives a single place to change button styles
// and functionality in the future
const IdemButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

export default IdemButton;
