import { Alert, FormItem, Input, InputSecret, Link } from "@traceo/ui";
import { INFLUX2_DOCS } from "src/core/utils/constants";

//TODO: add types!
interface FormProps {
  errors: any;
  register: any;
  namePrefix?: string;
}
export const InfluxForm = ({ errors, register, namePrefix = null }: FormProps) => {
  const computeRegisterName = (name: string) =>
    namePrefix ? `${namePrefix}${name}` : name;
  return (
    <>
      <FormItem error={errors?.url} label="URL">
        <Input
          {...register(computeRegisterName("url"), {
            required: true,
            pattern: {
              value: /^((https|http):\/\/.*):?(\d*)\/?(.*)/,
              message: "This url is invalid!"
            }
          })}
          placeholder="http://localhost:8086/"
        />
      </FormItem>
      <FormItem error={errors?.token} label="Token">
        <InputSecret
          {...register(computeRegisterName("token"), {
            required: true
          })}
        />
      </FormItem>
      <div className="w-full flex flex-row gap-x-2">
        <FormItem error={errors?.org} label="Organization" className="w-full">
          <Input
            {...register(computeRegisterName("org"), {
              required: true
            })}
          />
        </FormItem>
        <FormItem error={errors?.bucket} label="Bucket name" className="w-full">
          <Input
            {...register(computeRegisterName("bucket"), {
              required: true
            })}
          />
        </FormItem>
      </div>

      <Alert
        showIcon={true}
        type="info"
        className="mt-12"
        message={
          <Link href={INFLUX2_DOCS} target="_blank" className="hover:text-gray-200">
            Official documentation
          </Link>
        }
      />
    </>
  );
};
