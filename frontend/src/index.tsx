import * as React from "react"
import { Provider } from "./context/Index"
import { SessionBox } from "./components/SessionBox/Index"

import "./Index.scss"

interface IProps {
  loading: boolean
  cancelBtnStyle?: object
  onUserRection: Function
  onReplyAction: Function
  onSubmitAction: Function
  onReportAction: Function
  loadMore?: Function
  currentUser: {
    userId: string
    avatar: string
    fullName: string
  }
  profanityData: object
  articleData: {
    articleId: string
    reaction: {
      like: boolean
      brilliant: boolean
      thoughtful: boolean
    }
    reactionCount: number
  }
  commentData: Array<{
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
    reactionCount: number
    replies: Array<{
      text: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false
      },
      reactionCount: number
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
  profanityData,
  onUserRection,
  onReplyAction,
  onSubmitAction,
  onReportAction,
  cancelBtnStyle
}: IProps) => {
  return (
    <Provider
      loading={loading}
      loadMore={loadMore}
      totalCount={totalCount}
      articleData={articleData}
      commentData={commentData}
      currentUser={currentUser}
      profanityData={profanityData}
      onUserRection={onUserRection}
      onReplyAction={onReplyAction}
      onSubmitAction={onSubmitAction}
      onReportAction={onReportAction}
      cancelBtnStyle={cancelBtnStyle}
    >
      <SessionBox />
    </Provider>
  )
}