import { RouteComponentProps } from 'react-router-dom';

type RouteProps = {
  id: string;
};

export interface SearchProps extends RouteComponentProps<RouteProps> {};
