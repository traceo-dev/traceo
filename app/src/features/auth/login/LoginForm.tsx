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
      <Form<FormType> onSubmit={onFinish} id="login-form">
        {({ register, errors }) => (
          <>
            <FormItem label="Username" error={errors.username}>
              <Input
                {...register("username", {
                  required: true
                })}
              />
            </FormItem>

            <FormItem label="Password" className="mt-8">
              <InputSecret
                {...register("password", {
                  required: true
                })}
              />
            </FormItem>
          </>
        )}
      </Form>
      <ButtonContainer>
        <Button form="login-form" loading={loading} type="submit">
          Log In
        </Button>
      </ButtonContainer>
    </>
  );
};
