import { Button } from "core/ui-components/Button/Button";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Form } from "core/ui-components/Form/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { Input } from "core/ui-components/Input/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";

type FormType = {
  username: string;
  password: string;
};
export const LoginForm = ({ loading, onFinish }) => {
  return (
    <>
      <Form<FormType> onSubmit={onFinish} id="login-form" className="w-full items-center">
        {({ register, errors }) => (
          <>
            <FormItem
              className="w-1/4 ml-auto mr-auto"
              label="Username"
              error={errors.username}
            >
              <Input {...register("username", { required: false })} />
            </FormItem>

            <FormItem label="Password" className="mt-8 w-1/4 ml-auto mr-auto">
              <InputSecret {...register("password", { required: false })} />
            </FormItem>
          </>
        )}
      </Form>
      <ButtonContainer className="pt-12" justify="center">
        <Button
          className="w-1/4 justify-center py-5"
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
