import TextField from "@material-ui/core/TextField";
import { FieldAttributes, useField } from "formik";

const InputField = ({
  label,
  type,
  placeholder,
  ...props
}: FieldAttributes<{}> & { label: string; type?: string }) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      {...field}
      type={type}
      name={props.name}
      placeholder={placeholder}
      label={label}
      defaultValue={props.defaultValue}
      helperText={errorText}
      error={!!errorText}
      fullWidth
      margin="normal"
      color="secondary"
      required
    />
  );
};

export default InputField;
