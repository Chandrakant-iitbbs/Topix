import { useEffect } from "react";

const HtmlToText = (props) => {
  const { html, index } = props;
  const convertToText = () => {
    let div = document.getElementById(index);
    if (div) {
      div.innerHTML = html;
    }
  };
  useEffect(() => {
    convertToText();
  }, []);

  return <div id={index}></div>;
};

export default HtmlToText;
