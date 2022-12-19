import { useState, useEffect } from "react";

export type TApiResponse = {
  userId?: string;
  comId?: string;
  fullName?: string;
  text?: string;
  avatarUrl?: string;
  timeStamp?: string;
  reply?:
    | {
        userId: string;
        comId: string;
        fullName: string;
        avatarUrl: string;
        text: string;
      }[]
    | undefined;

  data?: any;
  error?: any;
  loading?: boolean;
};

export const useApiGet = (url: string): TApiResponse => {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAPIData = async () => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url);
      const json = await apiResponse.json();
      setData(json);
    } catch (error) {
      setError(error);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAPIData();
  }, []);

  return { data, error, loading };
};
