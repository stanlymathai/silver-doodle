import * as React from "react"
import GlobalProvider from "./context/Provider"
import CommentSectionComponent from "./components/CommentSectionComponent/Index"

import "./Index.scss"

interface CommentSectionProps {
  currentUser: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  } | null
  loading: boolean
  articleId: string
  totalCount?: number
  cancelBtnStyle?: object
  onReportAction: Function
  onReplyAction?: Function
  onSubmitAction?: Function
  loadMore?: Function
  commentData: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string;
    text: string
    replies: Array<{
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string;
      text: string
    }>
  }>
}

export const CommentSection = ({
  loading,
  loadMore,
  articleId,
  totalCount,
  commentData,
  currentUser,
  onReplyAction,
  onSubmitAction,
  onReportAction,
  cancelBtnStyle
}: CommentSectionProps) => {
  return (
    <GlobalProvider
      loading={loading}
      loadMore={loadMore}
      articleId={articleId}
      totalCount={totalCount}
      commentData={commentData}
      currentUser={currentUser}
      onReplyAction={onReplyAction}
      onSubmitAction={onSubmitAction}
      onReportAction={onReportAction}
      cancelBtnStyle={cancelBtnStyle}
    >
      <CommentSectionComponent />
    </GlobalProvider>
  )
}