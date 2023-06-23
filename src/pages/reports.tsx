import dynamic from "next/dynamic";
import React from "react";
import NavSideBar from "y/components/layout";

const ReactEmbedGist = dynamic(() => import("react-embed-gist"), {
  ssr: false,
});

export default function Reports() {
  return (
    <>
      <NavSideBar>
        <div>
          <ReactEmbedGist gist="jimicy/3bcb0bc8b9049a1201822da0115f7614" />
        </div>
      </NavSideBar>
    </>
  );
}
