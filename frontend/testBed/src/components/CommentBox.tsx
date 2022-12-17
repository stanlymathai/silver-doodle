import React from "react"
import { CommentSection } from "discussion-box"
import "discussion-box/dist/index.css"
import { useState } from "react"

const CommentBox = () => {
  const [data] = useState([
    {
      userId: "01a",
      comId: "012",
      fullName: "CryptoTasha",
      avatarUrl:
        "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/Author_number_12_966ab12057_7f767260bf.webp",
      text: "This is why I'm investing in web3 games",
      timeStamp:'2021-12-15T06:43:50.013Z',
      replies: [
        {
          userId: "02a",
          comId: "013",
          fullName: "Elon Musk",
          avatarUrl:
            "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/Author_number_12_Wasay_Ali_66ce69a0ab_5591888655.webp",
          text: "Has anyone seen web3? I can't find it.",
          timeStamp: "2022-09-15T06:43:50.013Z"
        },
        {
          userId: "01b",
          comId: "015",
          fullName: "Jack",
          avatarUrl:
            "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/Untitled_design_68_220x220_7068d345db.png",
          text: "It's somewhere between a and z",
          timeStamp: "2022-10-15T06:43:50.013Z"
        }
      ]
    },
    {
      userId: "02b",
      comId: "017",
      fullName: "GreenBull38",
      text: "This lady gets it!!! 😊",
      avatarUrl:
        "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/brendan_new_pic_cd4e9b3783.png",
      timeStamp: "2022-11-15T06:43:50.013Z",
      replies: []
    }
  ])

  return (
    <div style={{ width: "100%" }}>
      <CommentSection
        currentUser={{
          currentUserId: "01a",
          currentUserImg:
            "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png",
          currentUserFullName: "Stanly Mathai"
        }}
        commentData={data}
        currentData={(data: any) => {
          console.log("curent data", data)
        }}
        onSubmitAction={(data: {
          userId: string
          comId: string
          avatarUrl: string
          fullName: string
          text: string
          replies: any
        }) => {
          console.log("check submit, ", data)
        }}
        onReplyAction={(data: {
          userId: string
          repliedToCommentId: string
          avatarUrl: string
          fullName: string
          text: string
        }) => console.log("check reply, ", data)}
        inputStyle={{ border: "1px solid rgb(208 208 208)", color: "red" }}
        submitBtnStyle={{
          fontSize: "12px",
          color: "#1cf399",
          marginRight: "10px",
          borderRadius: "8px",
          backgroundColor: "transparent",
          border: "1px solid rgb(208 208 208)"
        }}
        cancelBtnStyle={{
          fontSize: "12px",
          color: "#f8f8ff",
          borderRadius: "8px",
          backgroundColor: "transparent",
          border: "1px solid rgb(208 208 208)"
        }}
      />
    </div>
  )
}

export default CommentBox
