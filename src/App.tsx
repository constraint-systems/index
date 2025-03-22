import { useAtom } from 'jotai'
import toolsData from './assets/tools.json'
import { ToolType } from './types'
import { displayTypeAtom, selectedToolAtom } from './atoms'
import { useEffect } from 'react'

function App() {
  const tools: ToolType[] = toolsData
  const [displayType, setDisplayType] = useAtom(displayTypeAtom)
  const [selectedTool, setSelectedTool] = useAtom(selectedToolAtom)

  useEffect(() => {
    if (selectedTool) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [selectedTool])

  return (
    <>
      <div
        className="grid gap-[2px] p-[2px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
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
              className={displayType === 'gif' ? '' : 'underline'}
              onClick={() => setDisplayType('gif')}
            >
              GIF
            </button>
            <div>/</div>
            <button
              className={displayType === 'image' ? '' : 'underline'}
              onClick={() => setDisplayType('image')}
            >
              Image
            </button>
          </div>
          <div>
            by{' '}
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
          <div
            key={index}
            className="flex cursor-zoom-in bg-hard-black p-4 flex-col gap-2 aspect-square"
            onClick={() => {
              setSelectedTool(tool)
            }}
          >
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="gray">{tools.length - index}.</div>
                <div className="green">{tool.title}</div>
              </div>
              <div className="blue">{tool.date.split('-')[0]}</div>
            </div>
            <button
              className="grow relative"
              onClick={() => {
                setSelectedTool(tool)
              }}
            >
              <img
                className="absolute cursor-zoom-in inset-0 object-contain w-full h-full"
                src={
                  displayType === 'gif'
                    ? `images/${tool.gif}`
                    : `images/${tool.image}`
                }
              />
            </button>
            <div className="flex flex-col">
              <div className="">{tool.description}</div>
              <div className='flex justify-between'>
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
  )
}

export default App

function Preview() {
  const [tool, setSelectedTool] = useAtom(selectedToolAtom)

  return (
    tool && (
      <div className="fixed inset-0 flex bg-hard-black cursor-zoom-out flex-col gap-2"
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
        <button
          className="grow relative"
          onClick={() => setSelectedTool(tool)}
        >
          <img
            className="absolute inset-0 cursor-zoom-out object-contain w-full h-full"
            src={`images/${tool.gif}`}
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
  )
}
