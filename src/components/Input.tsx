import React, { useEffect } from "react";

type InputProps = {
  initialValue?: string | number;
  onChange: (value?: string | number) => void;
};

type Props = InputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Input = (props: Props) => {
    const {initialValue, onChange} = props
  const [value, setValue] = React.useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
};

export default Input;
