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
  totalCount?: number
  cancelBtnStyle?: object
  onSubmitAction?: Function
  onReplyAction?: Function
  loadMore?: Function
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
  loadMore,
  articleId,
  totalCount,
  commentData,
  currentUser,
  onReplyAction,
  onSubmitAction,
  cancelBtnStyle
}: CommentSectionProps) => {
  return (
    <GlobalProvider
      loadMore={loadMore}
      articleId={articleId}
      totalCount={totalCount}
      commentData={commentData}
      currentUser={currentUser}
      onReplyAction={onReplyAction}
      onSubmitAction={onSubmitAction}
      cancelBtnStyle={cancelBtnStyle}
    >
      <CommentSectionComponent />
    </GlobalProvider>
  )
}
