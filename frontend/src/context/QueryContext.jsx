import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';

import { useSearchParams } from 'react-router-dom';

const QueryContext = createContext(null);

const defaults = {
  search: '',

  region: [],
  gender: [],
  customerType: [],
  orderStatus: [],
  deliveryType: [],

  minAge: '',
  maxAge: '',

  category: [],
  tags: [],
  paymentMethod: [],

  startDate: '',
  endDate: '',

  sortBy: 'date',
  sortOrder: 'desc',

  page: 1,
  limit: 12
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return {
        ...state,
        ...action.payload,
        page: action.payload.page ?? state.page
      };

    case 'RESET':
      return {
        ...defaults
      };

    default:
      return state;
  }
};

const parseParam = (value) => {
  if (!value) return [];

  return value
    .split(',')
    .filter(Boolean);
};

const QueryProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, dispatch] = useReducer(
    reducer,
    defaults
  );

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const params = Object.fromEntries(
      searchParams.entries()
    );

    const nextState = {
      search: params.search || '',

      region: parseParam(params.region),
      gender: parseParam(params.gender),
      customerType: parseParam(params.customerType),
      orderStatus: parseParam(params.orderStatus),
      deliveryType: parseParam(params.deliveryType),

      minAge: params.minAge || '',
      maxAge: params.maxAge || '',

      category: parseParam(params.category),
      tags: parseParam(params.tags),
      paymentMethod: parseParam(params.paymentMethod),

      startDate: params.startDate || '',
      endDate: params.endDate || '',

      sortBy: params.sortBy || defaults.sortBy,
      sortOrder: params.sortOrder || defaults.sortOrder,

      page: Number(params.page) || defaults.page,
      limit: Number(params.limit) || defaults.limit
    };

    dispatch({
      type: 'SET_QUERY',
      payload: nextState
    });

    initialized.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!initialized.current) return;

    const params = {
      ...state,

      region: state.region.join(','),
      gender: state.gender.join(','),
      customerType: state.customerType.join(','),
      orderStatus: state.orderStatus.join(','),
      deliveryType: state.deliveryType.join(','),

      category: state.category.join(','),
      tags: state.tags.join(','),
      paymentMethod: state.paymentMethod.join(',')
    };

    Object.keys(params).forEach((key) => {
      const value = params[key];

      const isEmptyString =
        value === '';

      const isNullish =
        value === null ||
        value === undefined;

      if (isEmptyString || isNullish) {
        delete params[key];
      }
    });

    setSearchParams(params, {
      replace: true
    });
  }, [state, setSearchParams]);

  const value = useMemo(() => {
    return {
      state,
      dispatch
    };
  }, [state]);

  return (
    <QueryContext.Provider value={value}>
      {children}
    </QueryContext.Provider>
  );
};

const useQueryContext = () => {
  const context = useContext(QueryContext);

  if (!context) {
    throw new Error(
      'useQueryContext must be used within QueryProvider'
    );
  }

  return context;
};

export {
  QueryProvider,
  useQueryContext
};