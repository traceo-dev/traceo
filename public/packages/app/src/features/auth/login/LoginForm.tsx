import { Alert, Button, Form, FormItem, Input, InputSecret } from "@traceo/ui";

type FormType = {
  username: string;
  password: string;
};
export const LoginForm = ({ invalid, loading, onFinish }) => {
  return (
    <>
      {invalid && <Alert type="error" title="Bad username or password!" className="mb-9" />}
      <Form<FormType> onSubmit={onFinish} id="login-form">
        {({ register, errors }) => (
          <>
            <FormItem label="Username" error={errors.username}>
              <Input {...register("username", { required: true })} />
            </FormItem>

            <FormItem label="Password" error={errors.password}>
              <InputSecret {...register("password", { required: true })} />
            </FormItem>
          </>
        )}
      </Form>
      <Button
        className="justify-center mt-12 min-w-full"
        form="login-form"
        loading={loading}
        type="submit"
      >
        Login
      </Button>
    </>
  );
};
