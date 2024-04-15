import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlertService = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  warning: (message) => {
    toast.warning(message);
  },
  info: (message) => {
    toast.info(message);
  },
};

export default AlertService;
