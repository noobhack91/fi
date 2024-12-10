import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import * as consigneeApi from '../../api/consignee';
import { FileDisplay } from '../FileDisplay';
import { BaseModal } from './BaseModal';

interface LogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  consigneeId: string;
}

export const LogisticsModal: React.FC<LogisticsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  consigneeId
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [courierName, setCourierName] = useState('');
  const [docketNumber, setDocketNumber] = useState('');
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && consigneeId) {
      fetchExistingFiles();
    }
  }, [isOpen, consigneeId]);

  const fetchExistingFiles = async () => {
    try {
      const { files } = await consigneeApi.getConsigneeFiles(consigneeId, 'logistics');
      setExistingFiles(files);
    } catch (error) {
      console.error('Error fetching existing files:', error);
    }
  };

  const handleDeleteFile = async (url: string) => {
    try {
      await consigneeApi.deleteFile(url, 'logistics');
      setExistingFiles(prev => prev.filter(f => f !== url));
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('consigneeId', consigneeId);
      formData.append('date', date?.toISOString() || '');
      formData.append('courierName', courierName);
      formData.append('docketNumber', docketNumber);
      
      if (documents) {
        Array.from(documents).forEach(file => {
          formData.append('documents', file);
        });
      }

      await onSubmit(formData);
      onClose();
      toast.success('Logistics details updated successfully');
    } catch (error) {
      toast.error('Failed to update logistics details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Update Logistics Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Courier Name</label>
          <input
            type="text"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Docket Number</label>
          <input
            type="text"
            value={docketNumber}
            onChange={(e) => setDocketNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
            className="mt-1 block w-full"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        {existingFiles.length > 0 && (
          <FileDisplay 
            files={existingFiles} 
            onDelete={handleDeleteFile}
          />
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};