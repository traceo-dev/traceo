import { Space } from "antd";
import { FC } from "react";
import { Trace } from "src/types/incidents";

interface Props {
  trace: Trace;
}

export const CodePreview: FC<Props> = ({ trace }) => {
  return (
    <>
      <Space
        style={{ maxWidth: 850 }}
        className="code-container p-3 bg-gray-800 text-white rounded-md"
      >
        <ol start={trace?.lineNo - 5} className="ml-2">
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
        .code-line {
          font-family: "JetBrainsMono";
          font-size: 12px;
          line-height: 24px;
          min-height: 24px;
          white-space: pre;
          /* white-space: pre-wrap; */
        }

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
