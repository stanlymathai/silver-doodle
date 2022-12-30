import React, { createContext, useEffect, useState } from "react"

import _ from "lodash"

export const GlobalContext = createContext({})

export const GlobalProvider = ({
  loadMore,
  children,
  articleId,
  totalCount,
  currentUser,
  commentData,
  onReplyAction,
  cancelBtnStyle,
  onSubmitAction
}: {
  articleId: string
  totalCount?: number
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  } | null
  cancelBtnStyle?: object
  commentData?: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string
    text: string
    replies?:
    | Array<{
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      text: string
    }>
    | undefined
  }>
  loadMore?: Function
  onReplyAction?: Function
  onSubmitAction?: Function
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<
    Array<{
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      text: string
      replies?:
      | Array<{
        userId: string
        comId: string
        fullName: string
        avatarUrl: string
        timeStamp: string
        text: string
      }>
      | undefined
    }>
  >([])
  const [replyArr, setReply] = useState<string[]>([])

  useEffect(() => { if (commentData) setData(commentData) }, [commentData])


  const handleReply = (id: string) => {
    let replyArrCopy: string[] = [...replyArr]
    let indexOfId = _.indexOf(replyArrCopy, id)
    if (_.includes(replyArr, id)) {
      replyArrCopy.splice(indexOfId, 1)
      setReply(replyArrCopy)
    } else {
      replyArrCopy.push(id)
      setReply(replyArrCopy)
    }
  }

  const handleSubmit = (text: string, uuid: string, timeStamp: string) => {
    let commentData = {
      text,
      timeStamp,
      replies: [],
      comId: uuid,
      userId: currentUserData!.currentUserId,
      avatarUrl: currentUserData!.currentUserImg,
      fullName: currentUserData!.currentUserFullName,
    }
    setData([commentData, ...data])
  }

  const onReply = (
    text: string,
    uuid: string,
    comId: string,
    parentId: string,
    timeStamp: string
  ) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      copyData[indexOfParent].replies!.push({
        text,
        timeStamp,
        comId: uuid,
        userId: currentUserData!.currentUserId,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName
      })
      setData(copyData)
      handleReply(comId)
    } else {
      const indexOfId = _.findIndex(copyData, { comId })
      copyData[indexOfId].replies!.push({
        text,
        timeStamp,
        comId: uuid,
        userId: currentUserData!.currentUserId,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName
      })
      setData(copyData)
      handleReply(comId)
    }
  }
  return (
    <GlobalContext.Provider
      value={{
        onReply,
        handleReply,
        handleSubmit,
        data,
        replyArr,
        articleId,
        totalCount,
        loadMore,
        onReplyAction,
        cancelBtnStyle,
        onSubmitAction,
        currentUserData,

      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
