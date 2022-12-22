import HTTP from "./http.service";
import { ICommentData } from "./interface.service";

const handleError = (error: any) => console.log(error)
class CommentDataService {
  async getAll(articleId: string) {
    try {
      return await HTTP.get<Array<ICommentData>>(`/comment/${articleId}`);
    } catch (e) {
      return handleError(e);
    }
  }

  async submit(payload: ICommentData) {
    console.log("check submit payload, ", payload);
    try {
      return await HTTP.post<ICommentData>("/comment", { payload });
    } catch (e) {
      return handleError(e);
    }
  }

  reply(data: ICommentData) {
    console.log("check reply, ", data);
  }

  get(id: string) {
    return HTTP.get<ICommentData>(`/comment/${id}`);
  }

  create(data: ICommentData) {
    return HTTP.post<ICommentData>("/comment", data);
  }

  update(data: ICommentData, id: any) {
    return HTTP.put<any>(`/comment/${id}`, data);
  }

  findByArticle(article: string) {
    return HTTP.get<Array<ICommentData>>(`/comment?article=${article}`);
  }
}

export default new CommentDataService();
