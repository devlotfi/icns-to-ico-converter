import { Button, cn, Link, ScrollShadow } from "@heroui/react";
import LogoSVG from "./assets/logo.svg";
import HeaderSVG from "./assets/header.svg";
import { useContext, useRef, useState, type ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faDownload,
  faFileExport,
  faFileImport,
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

function GradientCard({
  className,
  style,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex max-w-screen-md p-[1rem] lg:p-[1.5rem] rounded-3xl shadow-lg",
        className
      )}
      style={{
        boxShadow:
          "inset 0 0 10px hsl(var(--heroui-content1) / 1), rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        backgroundImage:
          "radial-gradient(at bottom, hsl(var(--heroui-primary) / 0.1), transparent 70%), linear-gradient(to top, hsl(var(--heroui-content1) / 1), hsl(var(--heroui-content2) / 1))",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function ResultComponent({ result }: { result: Result }) {
  return (
    <div className="flex">
      <h1>test</h1>
    </div>
  );
}

export default function App() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { themeOption, setTheme } = useContext(ThemeContext);
  const { beforeInstallPromptEvent } = useContext(PWAContext);

  const { mutate, isPending } = useMutation({
    mutationFn: async (files: File[]) => {
      const newResults = await Promise.all(
        files.map(async (file) => await convertToICNS(file))
      );
      setResults([
        ...results,
        ...newResults.filter((result) => result !== null),
      ]);
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
        <div className="flex flex-col w-full max-w-screen-md">
          <div className="flex flex-col mt-[calc(25dvh-4rem)] justify-center items-center">
            <div className="flex flex-col gap-[1rem] justify-center items-center">
              <img src={HeaderSVG} alt="header" className="h-[7rem]" />
              <div className="flex text-[17pt] font-bold">
                ICNS to ICO Converter
              </div>
            </div>

            <GradientCard>LOL</GradientCard>

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
                mutate(Array.from(e.dataTransfer.files));
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col w-full h-[15rem] mt-[2rem] mb-[3rem] justify-center items-center bg-content1 rounded-xl border-[0.15rem] border-dashed border-divider transition-background duration-150 cursor-pointer",
                isDragging &&
                  "outline-[0.2rem] outline-primary outline-offset-[0.5rem] bg-content1/50",
                isPending && "opacity-10"
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

              <div className="flex flex-col gap-[1rem]">
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
