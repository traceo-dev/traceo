import { SDK } from "@traceo/types";

interface Props {
  sdk: SDK;
  width?: number;
}
export const SdkIcon = ({ sdk, width = 15 }: Props) => {
  return <img src={`/img/svg/${sdk}.svg`} width={width} alt={sdk} />;
};
