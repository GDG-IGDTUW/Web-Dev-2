import { Framework } from "./FrameworkSelector";
import { CodePreview } from "./CodePreview";

type Props = {
  codeMap: Record<Framework, string>;
};

export const MultiFrameworkPreview = ({ codeMap }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {(Object.keys(codeMap) as Framework[]).map((framework) => (
        <div key={framework} className="border rounded-xl p-4">
          <h3 className="font-semibold mb-2 capitalize">{framework}</h3>
          <CodePreview
            code={codeMap[framework]}
            framework={framework}
          />
        </div>
      ))}
    </div>
  );
};
