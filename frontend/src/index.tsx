import * as React from "react"
import GlobalProvider from "./context/Provider"
import { SessionBox } from "./components/SessionBox/Index"

import "./Index.scss"

interface IProps {
  loading: boolean
  cancelBtnStyle?: object
  onReportAction: Function
  onReplyAction: Function
  onSubmitAction: Function
  loadMore?: Function
  currentUser: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  }
  articleData: {
    articleId: string
    reaction: {
      like: boolean
      brilliant: boolean
      thoughtful: boolean
    }
  }
  commentData: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string
    text: string
    reaction: {
      like: boolean
      brilliant: boolean
      thoughtful: boolean
    }
    replies: Array<{
      text: string
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false
      },
    }>
  }>
  totalCount?: number
}

export const CommentSection = ({
  loading,
  loadMore,
  totalCount,
  commentData,
  currentUser,
  articleData,
  onReplyAction,
  onSubmitAction,
  onReportAction,
  cancelBtnStyle
}: IProps) => {
  return (
    <GlobalProvider
      loading={loading}
      loadMore={loadMore}
      totalCount={totalCount}
      commentData={commentData}
      currentUser={currentUser}
      articleData={articleData}
      onReplyAction={onReplyAction}
      onSubmitAction={onSubmitAction}
      onReportAction={onReportAction}
      cancelBtnStyle={cancelBtnStyle}
    >
      <SessionBox />
    </GlobalProvider>
  )
}