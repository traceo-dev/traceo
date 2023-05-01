import { Space, Typography } from "@traceo/ui";

interface Props {
  page: string;
  title: string;
  description: JSX.Element | string;
}
export const PreviewPageHeader = ({ description, page, title }: Props) => {
  return (
    <Space direction="vertical" className="gap-0 w-full">
      <span className="text-[9px] uppercase">{page}</span>
      <span className="text-white text-3xl font-semibold leading-7">{title}</span>
      {typeof description === "string" ? (
        <Typography className="pt-2">{description}</Typography>
      ) : (
        description
      )}
    </Space>
  );
};
