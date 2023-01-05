import { useContext, useState } from "react"

import React from "react"
import moment from "moment";
const { v4: uuidv4 } = require("uuid")

import "./Style.scss"
import { InputComponent } from "./InputComponent"
import { GlobalContext } from "../../context/Index"

interface InputFieldProps {
  comId?: string
  mode?: string
}

const InputField = ({ mode, comId }: InputFieldProps) => {
  const [text, setText] = useState("")

  const globalStore: any = useContext(GlobalContext)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const formData = {
      text,
      comId: uuidv4(),
      timeStamp: moment().format(),
      userId: globalStore.currentUserData.currentUserId,
      avatarUrl: globalStore.currentUserData.currentUserImg,
      fullName: globalStore.currentUserData.currentUserFullName,
    }
    const repliedToCommentId = comId;
    const articleId = globalStore.article.articleId

    setText("")

    if (mode) {
      return (
        await globalStore.onReply({ ...formData, repliedToCommentId }),
        await globalStore.onReplyAction({ ...formData, articleId, repliedToCommentId })
      )
    } else {
      return (
        await globalStore.handleSubmit(formData),
        await globalStore.onSubmitAction({ ...formData, articleId }))
    }
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
