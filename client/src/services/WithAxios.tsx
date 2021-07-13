import { useEffect, useState } from "react";
import useRefreshUser from "src/hooks/useRefreshUser";
import Loading from "src/pages/Loading";

interface Props {
  children: JSX.Element;
}

const WithAxios = ({ children }: Props) => {
  const [didLoad, setDidLoad] = useState<boolean>(false);
  const refresh = useRefreshUser();

  useEffect(() => {
    if (!didLoad) {
      refresh.mutate();
      setDidLoad(true);
    }
  }, [didLoad, refresh]);

  if (refresh.isSuccess || refresh.isError) {
    return children;
  } else {
    return <Loading></Loading>;
  }
};

export default WithAxios;
