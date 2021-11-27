import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { FieldAttributes, useField } from "formik";

const InputField = (props: FieldAttributes<TextFieldProps>) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      {...field}
      {...props}
      helperText={errorText}
      error={!!errorText}
      variant="outlined"
      fullWidth
      margin="normal"
      color="secondary"
      required
    />
  );
};

export default InputField;
