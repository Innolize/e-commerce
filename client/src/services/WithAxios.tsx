import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "src/contexts/UserContext";
import useRefreshUser from "src/hooks/useRefreshUser";
import Loading from "src/pages/Loading";
import api from "./api";

interface Props {
  children: JSX.Element;
}

const WithAxios = ({ children }: Props) => {
  const [didLoad, setDidLoad] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const refresh = useRefreshUser();

  useEffect(() => {
    if (!didLoad) {
      refresh.mutate();
      setDidLoad(true);
    }
  }, [didLoad, refresh]);

  useMemo(() => {
    api.interceptors.request.use((config) => {
      const token = user?.access_token;
      const currentToken = config.headers.Authorization;
      if (token && `Bearer ${token}` !== currentToken) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }, [user]);

  if (refresh.isSuccess || refresh.isError) {
    return children;
  } else {
    return <Loading></Loading>;
  }
};

export default WithAxios;
