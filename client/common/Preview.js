import ReactDOM from "react-dom";
import React from "react";

import Microlink from "@microlink/react";
//import { Text, Box } from "rebass";

var TARGET_URL = '';

const serializeProps = props => {
  return Object.keys(props).reduce((acc, rawKey) => {
    const rawValue = props[rawKey];
    const key = rawValue === true ? rawKey : `${rawKey}=`;
    const value = rawValue === true ? "" : `'${rawValue}'`;
    return `${acc} ${key}${value}`;
  }, "");
};

const Story = ({ url = TARGET_URL, ...props }) => (
  <div my={5}>
    <div as="code" fontSize={2} fontWeight="bold">
    </div>
    <div mt={4}>
      <Microlink url={url} {...props} />
      {/*apiKey=''*/}
    </div>
  </div>
);

const Preview = (props) => {

  TARGET_URL = props.url;
  return (
    <div p={4} pt={0} as="main">
      {TARGET_URL != '' &&
        <Story size='large' media='{["video","image"]}' autoPlay={false} controls muted={false} lazy />
      }
      {TARGET_URL == '' &&
        <div></div>
      }


    </div>
  );
};



export default Preview;
