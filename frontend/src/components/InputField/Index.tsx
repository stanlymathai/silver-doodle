import { useContext, useState } from "react"

import React from "react"
import moment from "moment";
const { v4: uuidv4 } = require("uuid")

import "./Style.scss"
import { InputComponent } from "./InputComponent"
import { GlobalContext } from "../../context/Index"

interface InputFieldProps {
  parentId?: string
  comId?: string
  mode?: string
}

const InputField = ({
  mode,
  comId,
  parentId,
}: InputFieldProps) => {
  const [text, setText] = useState("")

  const globalStore: any = useContext(GlobalContext)

  const replyMode = async (replyUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text
    const timeStamp = moment().format()

    return (
      await globalStore.onReply(textToSend, replyUuid, comId, parentId, timeStamp),
      globalStore.onReplyAction &&
      (await globalStore.onReplyAction({
        fullName: globalStore.currentUserData.currentUserFullName,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        userId: globalStore.currentUserData.currentUserId,
        articleId: globalStore.article.articleId,
        repliedToCommentId: comId,
        text: textToSend,
        comId: replyUuid,
        timeStamp
      }))
    )
  }
  const submitMode = async (createUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text
    const timeStamp = moment().format()

    return (
      await globalStore.handleSubmit(textToSend, createUuid),
      globalStore.onSubmitAction &&
      (await globalStore.onSubmitAction({
        fullName: globalStore.currentUserData.currentUserFullName,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        userId: globalStore.currentUserData.currentUserId,
        articleId: globalStore.article.articleId,
        text: textToSend,
        comId: createUuid,
        timeStamp
      }))
    )
  }

  const handleSubmit = async (event: any, advText?: string) => {
    event.preventDefault()
    const replyUuid = uuidv4()
    const createUuid = uuidv4()
    mode === "replyMode"
      ? replyMode(replyUuid, advText)
      : submitMode(createUuid, advText)
    setText("")
  }

  return (
    <InputComponent
      text={text}
      mode={mode}
      setText={setText}
      handleSubmit={handleSubmit}
    />
  )
}
export default InputField
