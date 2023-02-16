import { Space } from "@traceo/ui";
import { FC } from "react";
import { Trace } from "@traceo/types";

interface Props {
  trace: Trace;
}

export const CodePreview: FC<Props> = ({ trace }) => {
  return (
    <>
      <Space className="code-container rounded-md p-3 mb-5 bg-secondary text-white w-full">
        <ol start={trace?.lineNo - 5} className="ml-2 w-full">
          {trace.preCode?.map((code, index) => (
            <li className="code-line" key={index}>
              {code}
            </li>
          ))}
          <li className="code-line exception-code-line">
            <span className="text-white">{trace.code}</span>
          </li>
          {trace.postCode?.map((code, index) => (
            <li className="code-line" key={index}>
              {code}
            </li>
          ))}
        </ol>
      </Space>
      <style>{`
        .exception-code-line {
          background-color: #d67709;
          min-width: 100%;
          width: fit-content;
        }
        
        .exception-code-line::marker {
          font-weight: 900;
          color: #d67709;
        }
      `}</style>
    </>
  );
};
