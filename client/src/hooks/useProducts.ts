import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import api from '../services/api';
import { IProduct } from '../types';

export default function useProducts() {
  return useQuery('products', () =>
    api.get('/api/product').then((res: AxiosResponse<IProduct[]>) => res.data)
  );
}
