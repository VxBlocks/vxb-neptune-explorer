import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
// @ts-ignore
import markdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import './index.css';

const mdParser = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

interface Props {
  value: string;
  onChange: (value: string) => void;
  moreButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
  view?: {
    menu: boolean;
    md: boolean;
    html: boolean;
    both: boolean;
    fullScreen: boolean;
    hideMenu: boolean;
  };
}

const Index: React.FC<Props> = ({ value = '', onChange, ...rest }) => {
  const { moreButton = false, className = '', style = {}, view = { menu: true, md: true, html: true, both: true, fullScreen: true, hideMenu: true } } = rest;
  const [showMore, setShowMore] = useState(false);
  const handleClickShowMore = () => {
    setShowMore(prev => !prev);
  };
 
  useEffect(() => {
    setShowMore(moreButton && value.length > 800)
  }, [moreButton, value]);
  const renderMoreButton = () => {
    if (value.length > 800) {
      return (
        <>
          <div className={`absolute bottom-0 h-[80px] w-full bg-gradient-to-t from-[#1b2331] ${showMore ? 'flex' : 'hidden'}`} />
          <div className={`flex w-full justify-center  ${showMore ? 'absolute -bottom-5' : ''}`}>
            <button className="border-[#eeeeee] hover:border-[#eeeeee] border-[1px] border-solid text-black mt-4 self-center rounded-xl py-2 px-4" onClick={handleClickShowMore}>
              {showMore ? "Show More" : "Show Less"}
            </button>
          </div>
        </>
      );
    }
  };
  return (
    <div className='relative'>
      <MdEditor
        readOnly
        className={`rcmd ${className} ${moreButton && showMore ? 'mb-10' : ''}`}
        value={value}
        style={{ ...style, maxHeight: moreButton && showMore ? '70vh' : 'fit-content' }}
        renderHTML={(text: string) => {
          return mdParser.render(text)
        }}
        view={view}
      />
      {moreButton && renderMoreButton()}
    </div>
  )
}

export default Index