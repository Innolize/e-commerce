import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { IBrand } from '../../types';

export default function useBrands() {
  return useQuery('brands', () => api.get('/api/brand').then((res: AxiosResponse<IBrand[]>) => res.data));
}
