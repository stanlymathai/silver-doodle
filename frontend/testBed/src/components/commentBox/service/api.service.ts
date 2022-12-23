import HTTP from "./http.service";
import { ICommentData } from "./interface.service";

const handleError = (error: any) => console.log(error)
class CommentDataService {
  async fetchComments(articleId: string) {
    try {
      return await HTTP.get<Array<ICommentData>>(`/comment/${articleId}`);
    } catch (e) {
      return handleError(e);
    }
  }

  async handleAction(payload: ICommentData) {
    try {
      return await HTTP.post<ICommentData>("/comment", { payload });
    } catch (e) {
      return handleError(e);
    }
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