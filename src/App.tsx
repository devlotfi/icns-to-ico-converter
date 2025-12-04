import { Button, cn, Link, ScrollShadow, Spinner } from "@heroui/react";
import LogoSVG from "./assets/logo.svg";
import HeaderSVG from "./assets/header.svg";
import { useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faDownload,
  faFileExport,
  faFileImport,
  faFileZipper,
  faMoon,
  faPaste,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import type { Result } from "./types/result";
import { convertToICNS } from "./convert";
import { ThemeContext } from "./context/theme-context";
import { ThemeOptions } from "./types/theme-options";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PWAContext } from "./context/pwa-context";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { v4 as uuid } from "uuid";
import GradientCard from "./components/geadient-card";
import ResultComponent from "./components/result-component";

export default function App() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { themeOption, setTheme } = useContext(ThemeContext);
  const { beforeInstallPromptEvent } = useContext(PWAContext);

  const { mutate, isPending } = useMutation({
    mutationFn: async (files: File[]) => {
      const newResults = await Promise.all(
        files.map((file) => convertToICNS(file))
      );
      setResults([
        ...newResults.filter((result) => result !== null),
        ...results,
      ]);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    onError(error) {
      console.error(error);
    },
  });

  const switchTheme = () => {
    switch (themeOption) {
      case ThemeOptions.LIGHT:
        setTheme(ThemeOptions.DARK);
        break;
      case ThemeOptions.DARK:
        setTheme(ThemeOptions.SYSTEM);
        break;
      case ThemeOptions.SYSTEM:
        setTheme(ThemeOptions.LIGHT);
        break;
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col bg-content1">
      <div className="flex justify-between h-[4rem] px-[1rem] bg-content1">
        <div className="flex items-center gap-[1rem]">
          <img src={LogoSVG} alt="logo" className="h-[3rem]" />
        </div>
        <div className="flex items-center gap-[0.5rem]">
          {beforeInstallPromptEvent ? (
            <Button
              variant="bordered"
              radius="full"
              className="bg-background border-[1px] pl-[0.7rem]"
              onPress={() => beforeInstallPromptEvent.prompt()}
              startContent={
                <FontAwesomeIcon
                  icon={faDownload}
                  className="text-[16pt]"
                ></FontAwesomeIcon>
              }
            >
              Install
            </Button>
          ) : null}

          <Button
            href="https://github.com/devlotfi/icns-to-ico-converter"
            target="_blank"
            as={Link}
            isIconOnly
            variant="bordered"
            radius="full"
            className="bg-background text-[16pt] border-[1px]"
          >
            <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
          </Button>

          <Button
            isIconOnly
            variant="bordered"
            radius="full"
            className="bg-background text-[16pt] border-[1px]"
            onPress={switchTheme}
          >
            {themeOption === ThemeOptions.LIGHT ? (
              <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
            ) : themeOption === ThemeOptions.DARK ? (
              <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faComputer}></FontAwesomeIcon>
            )}
          </Button>
        </div>
      </div>

      <ScrollShadow
        className="flex flex-col items-center h-[calc(100dvh-4rem)] overflow-x-hidden bg-content2"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, hsl(var(--heroui-content1) / 1), transparent 20%)",
        }}
      >
        <div className="flex flex-col w-full max-w-screen-md px-[1rem]">
          <div className="flex flex-col mt-[calc(25dvh-4rem)] justify-center items-center">
            <div className="flex flex-col gap-[1rem] justify-center items-center">
              <img src={HeaderSVG} alt="header" className="h-[7rem]" />
              <div className="flex text-[17pt] font-bold">
                ICNS to ICO Converter
              </div>
            </div>

            <GradientCard
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
                mutate(Array.from(e.dataTransfer.files));
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "w-full rounded-xl justify-center items-center h-[15rem] mt-[2rem] mb-[3rem] outline-[0.2rem] outline-divider outline-dotted outline-offset-[0.5rem]",
                isDragging &&
                  "outline-primary outline-offset-[0.5rem] bg-content1/50",
                isPending && "opacity-50"
              )}
            >
              <input
                disabled={isPending}
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => mutate(Array.from(e.target.files || []))}
              />

              <div
                className={cn(
                  "flex flex-col gap-[1rem] justify-center items-center pointer-events-none",
                  isDragging && "opacity-50"
                )}
              >
                {isPending ? (
                  <Spinner size="lg" color="primary"></Spinner>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={isDragging ? faPaste : faFileImport}
                      className="text-[30pt]"
                    ></FontAwesomeIcon>
                    <div className="flex text-center text-[14pt] font-medium">
                      {isDragging
                        ? "Drop files here..."
                        : "Drag files here or click to select"}
                    </div>
                  </>
                )}
              </div>
            </GradientCard>
          </div>

          {results.length ? (
            <>
              <div
                ref={resultsRef}
                className="flex items-center justify-between gap-[1rem] mb-[2rem]"
              >
                <div className="flex items-center gap-[1rem]">
                  <FontAwesomeIcon
                    icon={faFileExport}
                    className="text-[20pt]"
                  ></FontAwesomeIcon>
                  <div className="flex text-[20pt] font-bold">Results</div>
                </div>

                <Button
                  variant="shadow"
                  color="primary"
                  radius="full"
                  className="pl-[0.7rem]"
                  startContent={
                    <FontAwesomeIcon
                      icon={faFileZipper}
                      className="text-[16pt]"
                    ></FontAwesomeIcon>
                  }
                  onPress={async () => {
                    const zip = new JSZip();
                    results.forEach((result, index) => {
                      zip.file(`${index + 1}-${result.fileName}`, result.blob);
                    });
                    const zipBlob = await zip.generateAsync({ type: "blob" });
                    const url = URL.createObjectURL(zipBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `icons-${uuid()}.zip`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  .zip
                </Button>
              </div>

              <div className="flex flex-col gap-[1rem] pb-[5rem]">
                {results.map((result, index) => (
                  <ResultComponent
                    key={index}
                    result={result}
                  ></ResultComponent>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </ScrollShadow>
    </div>
  );
}
