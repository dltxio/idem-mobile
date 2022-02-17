import React from "react";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type DatePickProps = {
  show: boolean;
  handleDateChange: (value: any) => void;
  handleCloseDate: () => void;
};

const DatePick = ({
  show,
  handleDateChange,
  handleCloseDate,
}: DatePickProps) => {
  return (
    <View>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={handleCloseDate}
      />
    </View>
  );
};
export default DatePick;
