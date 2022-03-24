type FieldType = "text" | "date" | "boolean";

export type Field = {
  id: string;
  title: string;
  type: FieldType;
};
