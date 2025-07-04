import { useSnackbar as useNotistack } from 'notistack';

export const useAppSnackbar = () => {
  const { enqueueSnackbar } = useNotistack();

  return {
    showSuccess: (msg: string) => enqueueSnackbar(msg, { variant: 'success' }),
    showError: (msg: string) => enqueueSnackbar(msg, { variant: 'error' }),
    showInfo: (msg: string) => enqueueSnackbar(msg, { variant: 'info' }),
    showWarning: (msg: string) => enqueueSnackbar(msg, { variant: 'warning' }),
  };
};
