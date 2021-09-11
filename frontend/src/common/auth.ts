import { useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from './graphql/queries'

const useAuth = () => {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return { user: data?.currentUser };
};

export { useAuth };
