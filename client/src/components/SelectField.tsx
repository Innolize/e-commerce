import { TextField, TextFieldProps } from "@material-ui/core";
import { FieldAttributes, useField } from "formik";

const SelectField = (props: FieldAttributes<TextFieldProps>) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      {...field}
      {...props}
      helperText={errorText}
      error={!!errorText}
      type="text"
      margin="normal"
      variant="outlined"
      select
      fullWidth
      required
    >
      {props.children}
    </TextField>
  );
};

export default SelectField;
