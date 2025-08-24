import { useState, useCallback } from "react";

export default function useInput(
  validator: (value: string) => boolean,
  initialValue: string = ""
) {
  const [value, setValue] = useState<string>(initialValue);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const isValid = validator(value);
  const hasError = !isValid && isTouched;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(event.target.value);
      if (!isTouched) {
        setIsTouched(true);
      }
    },
    [isTouched] // dependency
  );

  const handleBlur = useCallback(() => {
    setIsTouched(true);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setIsTouched(false);
  }, [initialValue]);

  return {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    isTouched,
    hasError,
    isValid,
    reset,
  };
}
