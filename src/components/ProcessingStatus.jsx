import { Loader, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PROCESSING_STATUS_LABELS } from '../utils/constants';

export default function ProcessingStatus({ status }) {
  const statusInfo = PROCESSING_STATUS_LABELS[status] || PROCESSING_STATUS_LABELS.pending;

  const getIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Loader className="h-5 w-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
    switch (statusInfo.color) {
      case 'yellow':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'red':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-lg border ${getColorClasses()}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{statusInfo.ru}</p>
        {status === 'processing' && (
          <div className="mt-2 w-full bg-white rounded-full h-2 overflow-hidden">
            <div className="h-full bg-current animate-pulse rounded-full" style={{ width: '70%' }} />
          </div>
        )}
      </div>
    </div>
  );
}
