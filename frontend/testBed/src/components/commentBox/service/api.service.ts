import HTTP from "./http.service";
import { ICommentData } from "./interface.service";

const handleError = (error: any, fn_name: string) => console.error(error, fn_name);
class CommentDataService {
  async fetchComments(articleId: string, limit?: number) {
    try {
      return await HTTP.get<Array<ICommentData>>(
        `/comment/${articleId}/${limit ?? 0}`
      );
    } catch (e) {
      return handleError(e, "fetchComments");
    }
  }

  async handleAction(payload: ICommentData) {
    try {
      return await HTTP.post<ICommentData>("/comment", { payload });
    } catch (e) {
      return handleError(e, "handleAction");
    }
  }
  async handleReport(payload: any) {
    try {
      return await HTTP.post<ICommentData>("/comment/report", { payload });
    } catch (e) {
      return handleError(e, "handleReport");
    }
  }
  async totalCount(articleId: string) {
    try {
      return await HTTP.get(`/comment/count/${articleId}`);
    } catch (e) {
      return handleError(e, "totalCount");
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
