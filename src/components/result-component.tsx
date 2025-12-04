import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import type { Result } from "../types/result";
import GradientCard from "./geadient-card";

export default function ResultComponent({ result }: { result: Result }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(URL.createObjectURL(result.blob));

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
        setUrl(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GradientCard className="flex justify-between items-center h-[5rem] rounded-xl">
      <div className="flex gap-[0.5rem] items-center">
        {url ? <img src={url} alt="icon" className="h-[3rem]" /> : null}
        <div className="flex">{result.fileName}</div>
      </div>

      {url ? (
        <Button
          isIconOnly
          variant="bordered"
          radius="full"
          onPress={() => {
            const a = document.createElement("a");
            a.href = url;
            a.download = result.fileName; // <-- your custom filename here
            a.click();
          }}
        >
          <FontAwesomeIcon
            icon={faDownload}
            className="text-[15pt]"
          ></FontAwesomeIcon>
        </Button>
      ) : null}
    </GradientCard>
  );
}
