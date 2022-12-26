import "./InputField.scss"
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/Provider"

import React from "react"
import moment from "moment";
const { v4: uuidv4 } = require("uuid")

import InputComponent from "./InputComponent"

interface InputFieldProps {
  formStyle?: object
  comId?: string
  fillerText?: string
  parentId?: string
  mode?: string
  customImg?: string
  cancelBtnStyle?: object
  submitBtnStyle?: object
  imgStyle?: object
  imgDiv?: object
}

const InputField = ({
  formStyle,
  comId,
  fillerText,
  parentId,
  mode,
  customImg,
  cancelBtnStyle,
  submitBtnStyle,
  imgStyle,
  imgDiv
}: InputFieldProps) => {
  const [text, setText] = useState("")

  useEffect(() => {
    if (fillerText) {
      setText(fillerText)
    }
  }, [fillerText])

  const globalStore: any = useContext(GlobalContext)

  const replyMode = async (replyUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text
    const timeStamp = moment().format()

    return (
      await globalStore.onReply(textToSend, comId, parentId, replyUuid, timeStamp),
      globalStore.onReplyAction &&
      (await globalStore.onReplyAction({
        userId: globalStore.currentUserData.currentUserId,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        fullName: globalStore.currentUserData.currentUserFullName,
        articleId: globalStore.articleId,
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
        userId: globalStore.currentUserData.currentUserId,
        avatarUrl: globalStore.currentUserData.currentUserImg,
        fullName: globalStore.currentUserData.currentUserFullName,
        articleId: globalStore.articleId,
        text: textToSend,
        comId: createUuid,
        timeStamp
      }))
    )
  }

  const handleSubmit = async (event: any, advText?: string) => {
    event.preventDefault()
    const createUuid = uuidv4()
    const replyUuid = uuidv4()
    mode === "replyMode"
      ? replyMode(replyUuid, advText)
      : submitMode(createUuid, advText)
    setText("")
  }

  return (
    <div>
      <InputComponent
        formStyle={formStyle}
        imgDiv={imgDiv}
        imgStyle={imgStyle}
        customImg={customImg}
        mode={mode}
        cancelBtnStyle={cancelBtnStyle}
        comId={comId}
        submitBtnStyle={submitBtnStyle}
        handleSubmit={handleSubmit}
        text={text}
        setText={setText}
      />
    </div>
  )
}
export default InputField
