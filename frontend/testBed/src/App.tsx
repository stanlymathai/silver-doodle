import React from "react"
import CommentBox from "./components/commentBox/Index"

const App = () => {
  const dummyProps = { // for development purpose
    articleId: "ArticleId",
    currentUser: {
      currentUserId: "userID",
      currentUserFullName: "fullName",
      currentUserImg: "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png",
    }
  }
  return (
    <div style={{ background: "#1a1a2b" }}>
      <div
        style={{
          margin: "auto",
          width: "50%"
        }}
      >
        <CommentBox articleId={dummyProps.articleId} currentUser={dummyProps.currentUser} />
      </div>
    </div>
  )
}

export default App
