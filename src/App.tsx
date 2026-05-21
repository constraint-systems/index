import { useAtom } from "jotai";
import toolsData from "./assets/tools.json";
import { ToolType } from "./types";
import { displayTypeAtom, selectedToolAtom } from "./atoms";
import { useEffect, useRef, useState } from "react";

function App() {
  const tools: ToolType[] = toolsData;
  const [displayType, setDisplayType] = useAtom(displayTypeAtom);
  const [selectedTool] = useAtom(selectedToolAtom);

  useEffect(() => {
    if (selectedTool) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedTool]);

  return (
    <>
      <div
        className="grid gap-[2px] p-[2px]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
        }}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="yellow">Constraint Systems</div>
          <div className="">
            {tools.length} alternative interfaces for creating and editing
            images and text
          </div>

          <div className="flex gap-2 gray">
            <div>Display</div>
            <button
              className={displayType === "gif" ? "" : "underline"}
              onClick={() => setDisplayType("gif")}
            >
              GIF
            </button>
            <div>/</div>
            <button
              className={displayType === "image" ? "" : "underline"}
              onClick={() => setDisplayType("image")}
            >
              Image
            </button>
          </div>
          <div>
            by{" "}
            <a
              className="purple underline"
              href="https://grantcuster.com"
              target="_blank"
            >
              Grant Custer
            </a>
          </div>
        </div>
        {tools.map((tool, index) => (
          <ToolBox tool={tool} index={index} />
        ))}
        <div className="flex flex-col gap-4 p-4">
          <div className="orange">About</div>
          <div className="">
            Constraint Systems is a collection of experimental web-based
            creative tools. They are an ongoing attempt to explore alternative
            ways of interacting with pixels and text on a computer screen.
          </div>
        </div>
      </div>
      {selectedTool && <Preview />}
    </>
  );
}

function ToolBox({ tool, index }: { tool: ToolType; index: number }) {
  const [displayType] = useAtom(displayTypeAtom);
  const tools: ToolType[] = toolsData;
  const [, setSelectedTool] = useAtom(selectedToolAtom);
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0 },
    ); // Adjust threshold as needed

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  return (
    <div
      key={index}
      className="flex cursor-zoom-in bg-hard-black p-4 flex-col gap-2 aspect-square"
      onClick={() => {
        setSelectedTool(tool);
      }}
    >
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="gray">{tools.length - index}.</div>
          <div className="green">{tool.title}</div>
        </div>
        <div className="blue">{tool.date.split("-")[0]}</div>
      </div>
      <button
        ref={containerRef}
        className="grow relative"
        onClick={() => {
          setSelectedTool(tool);
        }}
      >
        <ToolMedia
          tool={tool}
          showMovingPreview={displayType === "gif" && isVisible}
          cursorClassName="cursor-zoom-in"
        />
      </button>
      <div className="flex flex-col">
        <div className="">{tool.description}</div>
        <div className="flex justify-between">
          <div className="gray"></div>
          <a
            href={tool.link}
            target="_blank"
            className="purple underline"
            onClick={(e) => e.stopPropagation()}
          >
            Launch
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;

function Preview() {
  const [tool, setSelectedTool] = useAtom(selectedToolAtom);

  return (
    tool && (
      <div
        className="fixed inset-0 flex bg-hard-black cursor-zoom-out flex-col gap-2"
        onClick={() => setSelectedTool(null)}
      >
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="green px-4">{tool.title}</div>
          </div>
          <button className="gray p-4" onClick={() => setSelectedTool(null)}>
            &times;
          </button>
        </div>
        <button className="grow relative" onClick={() => setSelectedTool(tool)}>
          <ToolMedia
            tool={tool}
            showMovingPreview
            cursorClassName="cursor-zoom-out"
          />
        </button>
        <div className="flex items-center">
          <div className="grow px-4">{tool.description}</div>
          <div>
            <a
              href={tool.link}
              target="_blank"
              className="purple underline p-4 block"
              onClick={(e) => e.stopPropagation()}
            >
              Launch
            </a>
          </div>
        </div>
      </div>
    )
  );
}

const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];

function ToolMedia({
  tool,
  showMovingPreview,
  cursorClassName,
}: {
  tool: ToolType;
  showMovingPreview: boolean;
  cursorClassName: string;
}) {
  const className = `absolute inset-0 ${cursorClassName} object-contain w-full h-full`;
  const movingPreview = tool.video ?? tool.gif;
  const stillImagePath = `images/${tool.image}`;

  if (showMovingPreview && movingPreview && isVideoAsset(movingPreview)) {
    return (
      <video
        autoPlay
        className={className}
        loop
        muted
        playsInline
        poster={stillImagePath}
        preload="metadata"
        src={`images/${movingPreview}`}
      />
    );
  }

  return (
    <img
      alt={tool.title}
      className={className}
      src={
        showMovingPreview && movingPreview
          ? `images/${movingPreview}`
          : stillImagePath
      }
    />
  );
}

function isVideoAsset(asset: string) {
  const normalizedAsset = asset.toLowerCase().split(/[?#]/)[0];

  return videoExtensions.some((extension) => normalizedAsset.endsWith(extension));
}
