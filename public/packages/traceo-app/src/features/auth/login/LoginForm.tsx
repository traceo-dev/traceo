import {
  Alert,
  Button,
  ButtonContainer,
  Form,
  FormItem,
  Input,
  InputSecret
} from "@traceo/ui";

type FormType = {
  username: string;
  password: string;
};
export const LoginForm = ({ invalid, loading, onFinish }) => {
  return (
    <>
      {invalid && (
        <Alert type="error" title="Bad username or password!" className="mb-9" />
      )}
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
      <ButtonContainer className="pt-12 w-full" justify="center">
        <Button
          className="justify-center py-5 w-full"
          form="login-form"
          loading={loading}
          type="submit"
        >
          Log In
        </Button>
      </ButtonContainer>
    </>
  );
};
