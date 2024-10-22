import React, { useContext } from "react";
import parse from "html-react-parser";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CanvasContext } from "../CanvasContext";
import { fontList, sizeList } from "../Toolbar/Toolbar";

const Size = Quill.import("attributors/style/size");
Size.whitelist = sizeList;

const Font = Quill.import("attributors/style/font");
Font.whitelist = fontList;

Quill.register(Font, true);
Quill.register(Size, true);

const AddHeading = (props) => {
  const { content, id, isReadOnly, dimension } = props;
  const { actions } = useContext(CanvasContext);
  const editorRef = React.useRef(null);

  const updateEditorValue = (value) => {
    actions?.updateCanvasData({ id, content: value });
  };

  const modules = {
    toolbar: "#toolbar",
  };
  let scale = 1;
  const conatiner = document.querySelector(".quill-container");
  // if (conatiner && dimension) {
  //   const { offsetHeight, offsetWidth } = conatiner;
  //   const { width } = conatiner.getBoundingClientRect();
  //   scale = Math.min(
  //     parseFloat(dimension?.width ?? 0) / offsetWidth
  //     // parseFloat(dimension?.height ?? 0) / offsetHeight
  //   );
  //   console.log(scale);
  // }
  console.log(isReadOnly);

  return (
    <>
      <div>
        {isReadOnly ? (
          <div
            className="ql-editor"
            style={{
              fontFamily: "Arial",
              fontSize: "14px",
              padding: 0,
            }}
          >
            {parse(content || "")}
          </div>
        ) : (
          <ReactQuill
            ref={editorRef}
            readOnly={isReadOnly}
            theme="snow"
            className="quill-container"
            modules={modules}
            value={content}
            onChange={updateEditorValue}
          />
        )}
      </div>
    </>
  );
};

export default AddHeading;
