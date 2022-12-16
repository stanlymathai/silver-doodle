import React from "react"
import CommentBox from "./components/CommentBox"

const App = () => {
  return (
    <div style={{ background: "#1a1a2b" }}>
      <div
        style={{
          margin: "auto",
          width: "50%"
        }}
      >
        <CommentBox />
      </div>
    </div>
  )
}

export default App
