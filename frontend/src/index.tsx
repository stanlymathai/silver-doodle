import * as React from "react"
import CommentSectionComponent from "./components/CommentSectionComponent/Index"
import GlobalProvider from "./context/Provider"
import "./Index.scss"

interface CommentSectionProps {
  currentUser: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  } | null
  inputStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  onSubmitAction?: Function
  onReplyAction?: Function
  currentData?: Function
  commentData: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    text: string
    replies?:
      | Array<{
          userId: string
          comId: string
          fullName: string
          avatarUrl: string
          text: string
        }>
      | undefined
  }>
}

export const CommentSection = ({
  currentUser,
  inputStyle,
  submitBtnStyle,
  cancelBtnStyle,
  commentData,
  onSubmitAction,
  onReplyAction,
  currentData
}: CommentSectionProps) => {
  return (
    <GlobalProvider
      currentUser={currentUser}
      inputStyle={inputStyle}
      submitBtnStyle={submitBtnStyle}
      cancelBtnStyle={cancelBtnStyle}
      commentData={commentData}
      onSubmitAction={onSubmitAction}
      onReplyAction={onReplyAction}
      currentData={currentData}
    >
      <CommentSectionComponent />
    </GlobalProvider>
  )
}
