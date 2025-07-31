import { useEffect } from "react";
import DOMPurify from "dompurify";

const HtmlToText = (props) => {
  const { html, index, isfull } = props;
  const convertToText = () => {
    let div = document.getElementById(index);
    let sanitizedHTML = DOMPurify.sanitize(html);
    if (div) {
      div.innerHTML = sanitizedHTML;
      if (!isfull) {
        let textContent = div.textContent || div.innerText || "";
        if (textContent.length > 50) {
          textContent = textContent.substring(0, 50) + "...";
          div.innerHTML = DOMPurify.sanitize(`<span>${textContent}</span>`);
        }
      }
    }
  };
  useEffect(() => {
    convertToText();
  }, [html, index, isfull]);

  return <div id={index}></div>;
};

export default HtmlToText;
