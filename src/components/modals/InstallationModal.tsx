import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import * as consigneeApi from '../../api/consignee';
import { FileDisplay } from '../FileDisplay';
import { BaseModal } from './BaseModal';

interface InstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  consigneeId: string;
}

export const InstallationModal: React.FC<InstallationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  consigneeId
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && consigneeId) {
      fetchExistingFiles();
    }
  }, [isOpen, consigneeId]);

  const fetchExistingFiles = async () => {
    try {
      const { files } = await consigneeApi.getConsigneeFiles(consigneeId, 'installation');
      setExistingFiles(files);
    } catch (error) {
      console.error('Error fetching existing files:', error);
    }
  };
  const handleDeleteFile = async (url: string) => {
    try {
      await consigneeApi.deleteFile(url, 'installation');
      setExistingFiles(prev => prev.filter(f => f !== url));
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('consigneeId', consigneeId);
    formData.append('date', date?.toISOString() || '');
    if (file) {
      formData.append('file', file);
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Update Installation Report">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Installation Date</label>
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Installation Report</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            accept=".pdf,.jpg,.jpeg"
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
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </BaseModal>
  );
}