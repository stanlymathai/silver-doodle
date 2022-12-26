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
  articleId: string
  inputStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  onSubmitAction?: Function
  onReplyAction?: Function
  commentData: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string;
    text: string
    replies?:
    | Array<{
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string;
      text: string
    }>
    | undefined
  }>
}

export const CommentSection = ({
  articleId,
  currentUser,
  submitBtnStyle,
  cancelBtnStyle,
  commentData,
  onSubmitAction,
  onReplyAction,
}: CommentSectionProps) => {
  return (
    <GlobalProvider
      articleId={articleId}
      currentUser={currentUser}
      submitBtnStyle={submitBtnStyle}
      cancelBtnStyle={cancelBtnStyle}
      commentData={commentData}
      onSubmitAction={onSubmitAction}
      onReplyAction={onReplyAction}
    >
      <CommentSectionComponent />
    </GlobalProvider>
  )
}
