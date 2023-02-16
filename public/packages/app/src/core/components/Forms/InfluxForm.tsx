import { Alert, FormItem, Input, InputSecret, Link } from "@traceo/ui";
import { INFLUX2_DOCS } from "../../../core/utils/constants";

//TODO: add types!
interface FormProps {
  errors: any;
  register: any;
  required?: boolean;
}
export const InfluxForm = ({ errors, register, required = true }: FormProps) => {
  return (
    <>
      <FormItem error={errors?.url} label="URL">
        <Input
          {...register("url", {
            required,
            pattern: {
              value: /^((https|http):\/\/.*):?(\d*)\/?(.*)/,
              message: "This url is invalid!"
            }
          })}
          placeholder="http://localhost:8086/"
        />
      </FormItem>
      <FormItem error={errors?.tsdbConfiguration?.token} label="Token">
        <InputSecret
          {...register("tsdbConfiguration.token", {
            required
          })}
        />
      </FormItem>
      <div className="w-full flex flex-row gap-x-2">
        <FormItem
          error={errors?.tsdbConfiguration?.org}
          label="Organization"
          className="w-full"
        >
          <Input
            {...register("tsdbConfiguration.org", {
              required
            })}
          />
        </FormItem>
        <FormItem
          error={errors?.tsdbConfiguration?.bucket}
          label="Bucket name"
          className="w-full"
        >
          <Input
            {...register("tsdbConfiguration.bucket", {
              required
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
