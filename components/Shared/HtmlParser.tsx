import HTMLReactParser from "html-react-parser";
import React from "react";

export default function HtmlParser({ content }: { content: string }) {
  return <>{HTMLReactParser(content)}</>;
}
