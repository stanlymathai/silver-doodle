import React, { createContext, useEffect, useState } from "react"
import _ from "lodash"

export const GlobalContext = createContext({})

export const GlobalProvider = ({
  children,
  currentUser,
  inputStyle,
  submitBtnStyle,
  cancelBtnStyle,
  commentData,
  onSubmitAction,
  onReplyAction,
  currentData
}: {
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  } | null
  inputStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  commentData?: Array<{
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
  onSubmitAction?: Function
  onReplyAction?: Function
  currentData?: Function
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<
    Array<{
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
  >([])
  const [replyArr, setReply] = useState<string[]>([])

  useEffect(() => {
    if (commentData) {
      setData(commentData)
    }
  }, [commentData])

  useEffect(() => {
    if (currentData) {
      currentData(data)
    }
  }, [data])

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

  const handleSubmit = (text: string, uuid: string) => {
    let copyData = [...data]
    copyData.push({
      userId: currentUserData!.currentUserId,
      comId: uuid,
      avatarUrl: currentUserData!.currentUserImg,
      fullName: currentUserData!.currentUserFullName,
      text: text,
      replies: []
    })
    setData(copyData)
  }

  const onReply = (
    text: string,
    comId: string,
    parentId: string,
    uuid: string
  ) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      copyData[indexOfParent].replies!.push({
        userId: currentUserData!.currentUserId,
        comId: uuid,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName,
        text: text
      })
      setData(copyData)
      handleReply(comId)
    } else {
      const indexOfId = _.findIndex(copyData, {
        comId: comId
      })
      copyData[indexOfId].replies!.push({
        userId: currentUserData!.currentUserId,
        comId: uuid,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName,
        text: text
      })
      setData(copyData)
      handleReply(comId)
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        currentUserData,
        data,
        onReply,
        handleReply,
        handleSubmit,
        replyArr,
        inputStyle,
        submitBtnStyle,
        cancelBtnStyle,
        onSubmitAction,
        onReplyAction
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
