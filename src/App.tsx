import { Alert, cn, ScrollShadow } from "@heroui/react";
import LogoSVG from "./assets/logo.svg";
import HeaderSVG from "./assets/header.svg";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faFileImport,
  faPaste,
} from "@fortawesome/free-solid-svg-icons";
import type { Result } from "./types/result";
import { convertToICNS } from "./convert";

export default function App() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFiles = (files: File[]) => {
    for (const file of files) {
      convertToICNS(file);
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col bg-content1">
      <div className="flex justify-between h-[4rem] px-[1rem] bg-content1">
        <div className="flex items-center gap-[1rem]">
          <img src={LogoSVG} alt="logo" className="h-[3rem]" />
        </div>
        <div className="flex">
          <h1>lol</h1>
        </div>
      </div>

      <ScrollShadow
        className="flex flex-col items-center h-[calc(100dvh-4rem)] overflow-x-hidden bg-content2"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, hsl(var(--heroui-content1) / 1), transparent 20%)",
        }}
      >
        <div className="flex flex-col w-full max-w-screen-md">
          <div className="flex flex-col h-dvh justify-center items-center">
            <div className="flex flex-col gap-[1rem] justify-center items-center">
              <img src={HeaderSVG} alt="header" className="h-[7rem]" />
              <div className="flex text-[17pt] font-bold">
                ICNS to ICO Converter
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                convertFiles(Array.from(e.dataTransfer.files));
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col w-full h-[15rem] mt-[2rem] mb-[10rem] justify-center items-center bg-content1 rounded-xl border-[0.15rem] border-dashed border-divider transition-background duration-150 cursor-pointer",
                isDragging &&
                  "outline-[0.2rem] outline-primary outline-offset-[0.5rem] bg-content1/50"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  convertFiles(Array.from(e.target.files || []));
                }}
              />

              <div
                className={cn(
                  "flex flex-col gap-[1rem] justify-center items-center pointer-events-none",
                  isDragging && "opacity-50"
                )}
              >
                <FontAwesomeIcon
                  icon={isDragging ? faPaste : faFileImport}
                  className="text-[30pt]"
                ></FontAwesomeIcon>
                <div className="flex text-center text-[14pt] font-medium">
                  {isDragging
                    ? "Drop files here..."
                    : "Drag files here or click to select"}
                </div>
              </div>
            </div>
          </div>

          {results.length ? (
            <>
              <div className="flex items-center gap-[1rem]">
                <FontAwesomeIcon
                  icon={faFileExport}
                  className="text-[20pt]"
                ></FontAwesomeIcon>
                <div className="flex text-[20pt] font-bold">Results</div>
              </div>
            </>
          ) : null}

          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
          <div className="flex text-[200pt]">lol</div>
        </div>
      </ScrollShadow>
    </div>
  );
}
