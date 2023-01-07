import React, { HTMLProps, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  DefaultValues,
  UseFormReturn,
  FieldErrors
} from "react-hook-form";

export type FormAPI<T> = Omit<UseFormReturn<T>, "trigger" | "handleSubmit"> & {
  errors: FieldErrors<T>;
};

interface Props<T> extends Omit<HTMLProps<HTMLFormElement>, "onSubmit" | "form"> {
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  children: (api: FormAPI<T>) => React.ReactNode;
}

export function Form<T>(props: Props<T>) {
  const { children, defaultValues, onSubmit, ...restProps } = props;
  const { handleSubmit, formState, reset, ...restFormProps } = useForm<T>({
    mode: "onSubmit",
    defaultValues
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...restProps}>
      {children({ errors: formState.errors, formState, reset, ...restFormProps })}
    </form>
  );
}
